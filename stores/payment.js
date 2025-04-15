import { loadConnectAndInitialize } from '@stripe/connect-js/pure';
import { loadStripe } from '@stripe/stripe-js/pure';
import { useToast } from 'vue-toastification';

import { createAccountLink } from '~/api/v2/connect-accounts';
import { getCourse, startCourse } from '~/api/v2/course';
import { searchCountries } from '~/api/v2/global';
import {
  getCustomerSetupIntent,
  postToAddPaymentMethod,
  getStripePaymentMethods,
  deleteStripePaymentMethod,
  putSetDefaultPaymentMethod,
  postStripeAccountSessions,
  paymentCreateBank,
  paymentGetBankList,
  paymentDeleteBank,
  paymentUpdateBank,
  getProductById,
  postPaymentCheckoutSession,
  getPaymentCheckoutSession,
} from '~/api/v2/payment';
import { STRIPE_PUBLIC_KEY } from '~/constant';
import {
  STRIPE_APPEARANCE,
  PAYMENT_MODEL,
  CHECKOUT_NOTIFICATION,
} from '~/constant/payment';
import { logToDebug } from '~/utils/log';
import WebSocketService from '~/utils/websocket';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    countries: [],
    // 用于profile setting/payment history里的add card弹窗
    addCardDialog: false,
    stripe: null,
    stripeElements: null,
    paymentMethodsFetchLoading: false,
    paymentMethods: [],
    selectedPaymentMethodIndex: 0,

    // checkout -- begin
    // 用户checkout之前弹出输入卡号或选择支付方式的弹窗
    checkoutDialog: false,
    // recurring dialog
    subscribeDialog: false,
    // free confirm cycles dialog
    freeConfirmCyclesDialog: false,
    // one-time-paid confirm cycles dialog
    oneTimePaidConfirmCyclesDialog: false,
    // 用户checkout成功的弹窗
    successDialog: false,
    // for checkout, null or courseObject from `getCourse()`
    currentCourseObject: null,
    cyclesId: '',
    // includes the cycles subs information
    courseProductLoading: false,
    courseProductDetails: null,
    buyQuantity: null,
    notificationTimer: null,
    checkoutAfterLogin: false,
    // used for checkout success callback
    checkoutFrom: null,
    checkoutSession: null,
    // checkout -- end

    // bank accounts
    bankList: [],

    // service subscription dialog
    serviceSubscriptionDialog: false,

    // service failed dialog, null or string
    serviceFailedDialog: null,
  }),
  actions: {
    setServiceDialog(dialogValue) {
      this.serviceSubscriptionDialog = dialogValue;
    },
    setBuyQuantity(quantity) {
      this.buyQuantity = quantity;
    },
    setSubscribeDialog(dialogValue) {
      this.subscribeDialog = dialogValue;
    },
    setSuccessDialog(dialogValue) {
      this.successDialog = dialogValue;
    },
    setCheckoutDialog(dialogValue) {
      this.checkoutDialog = dialogValue;
    },
    setOneTimePaidConfirmCyclesDialog(dialogValue) {
      this.oneTimePaidConfirmCyclesDialog = dialogValue;
    },
    async getCourseProductDetailsById(productId) {
      this.courseProductLoading = true;
      const productRes = await getProductById(productId);
      this.courseProductDetails = productRes;
      this.courseProductLoading = false;
    },
    async initStripe(newLang) {
      const i18n_redirected = useCookie('i18n_redirected');
      try {
        if (this.stripe && !newLang) {
          return this.stripe;
        }
        const lang = newLang || i18n_redirected.value || 'en';
        const stripe = await loadStripe(STRIPE_PUBLIC_KEY, {
          betas: ['custom_checkout_beta_5'],
          locale: lang,
        });
        this.stripe = stripe;
        return stripe;
      } catch (err) {
        console.error('error initStripe stripe', err);
      }
    },
    async initStripePaymentElement() {
      try {
        const stripe = await this.initStripe();
        const clientStriptRes = await getCustomerSetupIntent();
        const elements = stripe.elements({
          clientSecret: clientStriptRes.clientSecret,
          appearance: STRIPE_APPEARANCE,
        });
        this.stripeElements = elements;
        const paymentElement = elements.create('payment');
        return paymentElement;
      } catch (err) {
        console.error('error initStripeElements stripe', err);
      }
    },
    // 创建checkout session
    async handleCheckoutSession() {
      if (this.checkoutSession) {
        return this.checkoutSession;
      }
      const params = {
        // required
        courseId: this.currentCourseObject.id,
        quantity: this.buyQuantity,
        // required
        useSinglePayment: false,
      };
      if (this.currentCourseObject.cycles?.length) {
        params.cycleId = this.cyclesId;
      }
      const data = await postPaymentCheckoutSession(params);
      this.checkoutSession = data;
      return data;
    },
    async retrieveCheckoutSession(sessionId) {
      const data = await getPaymentCheckoutSession(sessionId);
      return data;
    },
    async initCheckoutSessionElement() {
      try {
        const stripe = await this.initStripe();
        const params = {
          // required
          courseId: this.currentCourseObject.id,
          quantity: this.buyQuantity,
          // required
          useSinglePayment: false,
        };
        if (this.currentCourseObject.cycles?.length) {
          params.cycleId = this.cyclesId;
        }
        const sessionRes = await this.handleCheckoutSession(params);
        const checkout = await stripe.initCheckout({
          clientSecret: sessionRes.clientSecret,
          elementsOptions: {
            appearance: STRIPE_APPEARANCE,
          },
        });
        return checkout;
      } catch (err) {
        console.error('error initCheckoutSessionElement stripe', err);
      }
    },
    async saveCardToStripe() {
      try {
        const authStore = useAuthStore();

        if (!this.stripe || !this.stripeElements) {
          const error = 'stripe or stripeElements not init';
          return { error };
        }
        // save card to stripe
        const confirmRes = await this.stripe.confirmSetup({
          elements: this.stripeElements,
          redirect: 'if_required',
          confirmParams: {
            return_url: window.location.href,
            payment_method_data: {
              billing_details: {
                email: authStore.user.email,
                name: authStore.user.fullName,
              },
            },
          },
        });
        if (confirmRes.error) {
          return {
            error: confirmRes.error.message,
          };
        }
        return {
          paymentMethodId: confirmRes.setupIntent.payment_method,
        };
      } catch (err) {
        console.error('error submitToSaveAddCard stripe', err);
      }
    },
    // 一般需要紧接着配合saveCardToStripe使用
    async postStripePaymentMethod({
      paymentMethodId,
      isDefault,
      toRefreshList,
    }) {
      const addRes = await postToAddPaymentMethod({
        paymentMethodId,
        isDefault: isDefault ?? true,
      });

      if (toRefreshList) {
        this.getStripePaymentMethodsList();
      }
      return addRes;
    },
    async getStripePaymentMethodsList() {
      this.paymentMethodsFetchLoading = true;
      const data = await getStripePaymentMethods();
      this.paymentMethodsFetchLoading = false;
      const { paymentMethods } = data;
      this.paymentMethods = paymentMethods.map((paymentMethodItem) => {
        const { id, stripeId, isDefault, owner, card } = paymentMethodItem;
        return {
          id,
          stripeId,
          isDefault,
          owner,
          ...card,
          cardType: card.networks.available[0],
        };
      });
      this.selectedPaymentMethodIndex = 0;
      return paymentMethods;
    },
    async deleteStripePaymentMethodById(id) {
      const res = await deleteStripePaymentMethod(id);
      this.getStripePaymentMethodsList();
      return res;
    },
    async setDefaultPaymentMethod(params) {
      const res = await putSetDefaultPaymentMethod(params);
      this.paymentMethods = this.paymentMethods.map((item) => ({
        ...item,
        isDefault: item.id === res.id,
      }));
      return res;
    },
    async getBankAccounts() {
      const authStore = useAuthStore();
      if (!authStore.finishedSignup) {
        console.error('only finished onboarding can call bank account');
        // only teacher can have bank account
        return null;
      }
      const bankListRes = await paymentGetBankList();
      this.bankList = bankListRes.data;
      return {
        bankList: bankListRes.data,
      };
    },
    async deleteBankAccountById(id) {
      const res = await paymentDeleteBank(id);
      await this.getBankAccounts();
      return res;
    },
    async updateBankAccount(id, params) {
      const res = await paymentUpdateBank(id, params);
      await this.getBankAccounts();
      return res;
    },
    async createBankAccount(params) {
      const stripe = await this.initStripe();
      const res = await stripe.createToken('bank_account', params);
      if (res.token) {
        await paymentCreateBank({
          token: res.token.id,
          isDefault: true,
        });
        await sleep(1000);
        this.getBankAccounts();
      }
      return res;
    },
    async getStripeCountries(params) {
      const searchRes = await searchCountries({
        ...params,
        stripeSupported: true,
        limit: 0,
      });
      this.countries = searchRes.data || [];
      return searchRes.data;
    },
    async createAccountLink(isUpdate) {
      const data = await createAccountLink({
        type: isUpdate ? 'account_update' : 'account_onboarding',
      });
      return data;
    },
    async getStripeBalanceSessions() {
      const data = await postStripeAccountSessions({ type: 'balance' });
      if (data) {
        return data.clientSecret;
      }
      return undefined;
    },
    async initStripeBalancesElement(containerId) {
      try {
        const i18n_redirected = useCookie('i18n_redirected');

        const stripeConnectInstance = loadConnectAndInitialize({
          locale: i18n_redirected?.value || 'en',
          publishableKey: STRIPE_PUBLIC_KEY,
          fetchClientSecret: this.getStripeBalanceSessions,
          appearance: {
            variables: {
              ...STRIPE_APPEARANCE.variables,
              spacingUnit: '8px',
              fontSizeBase: '16px',
              labelMdFontSize: '16px',
              labelSmFontSize: '16px',
              overlayBackdropColor: 'rgba(0,0,0,0.5)',
              colorText: '#d9d9d9',
              colorBackground: '#050505',
            },
          },
        });

        const balanceElement = stripeConnectInstance.create('balances');
        const container = document.getElementById(containerId);
        container.appendChild(balanceElement);
        return balanceElement;
      } catch (err) {
        console.error('error initStripeElements stripe', err);
      }
    },
    async getStripeAccountSessions() {
      try {
        const data = await postStripeAccountSessions({ type: 'onboarding' });
        if (data) {
          return data.clientSecret;
        }
        return undefined;
      } catch (err) {
        logToDebug({
          type: '----- error getStripeAccountSessions stripe -----',
          error: err,
        });
        console.error('error getStripeAccountSessions stripe', err);
      }
    },
    async initStripeAccountElement(containerId) {
      try {
        const i18n_redirected = useCookie('i18n_redirected');

        const stripeConnectInstance = loadConnectAndInitialize({
          locale: i18n_redirected?.value || 'en',
          publishableKey: STRIPE_PUBLIC_KEY,
          fetchClientSecret: this.getStripeAccountSessions,
          appearance: {
            variables: {
              colorPrimary: '#F0CA41',
              colorText: '#ffffff',
              colorBackground: '#060606',
              formBackgroundColor: '#050505',
              overlayBackdropColor: 'rgba(0,0,0,0.5)',
              buttonSecondaryColorBorder: '#060606',
              // buttonSecondaryColorText: '#f1f1f1',
              // buttonSecondaryColorBackground: '#121212',
            },
          },
        });

        const onboardingElement =
          stripeConnectInstance.create('account-onboarding');
        const container = document.getElementById(containerId);
        container.appendChild(onboardingElement);
        return onboardingElement;
      } catch (err) {
        console.error('error initStripeElements stripe', err);
      }
    },
    waitingForPayment({
      courseId, // required
      timeout = 15 * 1000,
    }) {
      return new Promise((resolve) => {
        const websocket = WebSocketService.getInstance();
        const handleBuyResultNotification = (event) => {
          if (event.courseId !== courseId) {
            return;
          }
          resolve(CHECKOUT_NOTIFICATION.SUCCESS_TEXT);
          websocket.off(
            CHECKOUT_NOTIFICATION.EVENT_NAME,
            handleBuyResultNotification,
          );
          if (this.notificationTimer) {
            clearTimeout(this.notificationTimer);
          }
        };

        websocket.on(
          CHECKOUT_NOTIFICATION.EVENT_NAME,
          handleBuyResultNotification,
        );

        if (this.notificationTimer) {
          clearTimeout(this.notificationTimer);
        }
        this.notificationTimer = setTimeout(() => {
          websocket.off(
            CHECKOUT_NOTIFICATION.EVENT_NAME,
            handleBuyResultNotification,
          );
          resolve(CHECKOUT_NOTIFICATION.TIMEOUT_TEXT);
        }, timeout);
      });
    },
    async handleFreeCourseCheckout(courseId) {
      const courseStore = useCourseStore();
      await startCourse({ courseId });
      await this.waitingForPayment({ courseId, timeout: 2 * 1000 });
      await courseStore.refresh({ courseId });
    },
    /**
     * @description 购买课程，调用出购买弹窗的公共函数，courseId必传
     * DialogSteps:
     * free course -> [confirmCyclesDialog?]
     * one-time-paid course -> cycles ? [confirmCyclesDialog, checkoutDialog] : [subscribeDialog, checkoutDialog]
     * recurring course -> [subscribeDialog, checkoutDialog]
     */
    async onCheckout(courseId, checkoutFrom) {
      if (!courseId) {
        console.error('no courseId passed');
        return;
      }

      // not logged, these 2 flags will help `Buy.vue` to watch to checkout after login
      const authStore = useAuthStore();
      if (!authStore.logged) {
        this.checkoutAfterLogin = true;
        authStore.popup = true;
        return;
      }

      const courseDetails = await getCourse({ courseId });
      const { billing, cycles, productId } = courseDetails;

      // own course validation
      const $toast = useToast();
      if (courseDetails.owner?.id === authStore.context) {
        $toast.error('You cannot buy your own course');
        return;
      }

      // free course
      if (billing.paymentModel === PAYMENT_MODEL.FREE) {
        if (cycles.length) {
          // todo
          console.log('show confirm free cycles confirm dialog');
          // this.setConfirmCyclesDialog(true);
        } else {
          await this.handleFreeCourseCheckout(courseId);
        }
        return courseDetails;
      }

      // not free course
      if (checkoutFrom) {
        this.checkoutFrom = checkoutFrom;
      }
      this.currentCourseObject = courseDetails;

      // init
      this.setBuyQuantity(1);
      this.checkoutSession = null;

      if (billing.paymentModel === PAYMENT_MODEL.RECURRING) {
        this.setSubscribeDialog(true);
        this.getCourseProductDetailsById(productId);
        return courseDetails;
      }

      if (billing.paymentModel === PAYMENT_MODEL.ONE_TIME) {
        if (cycles.length) {
          this.setOneTimePaidConfirmCyclesDialog(true);
        } else {
          this.setCheckoutDialog(true);
        }
      }
      return courseDetails;
    },
  },
});

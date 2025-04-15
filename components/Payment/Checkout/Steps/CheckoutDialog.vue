<template>
  <client-only>
    <el-dialog
      v-model="dialogShow"
      :show-close="false"
      append-to-body
      width="28rem"
      align-center
      destroy-on-close
      :close-on-click-modal="false"
      @close="handleCloseDialog"
      @open="handleOpenDialog"
    >
      <!-- header -->
      <div
        class="flex items-center justify-between rounded-t-md bg-[#0C0C0C] px-4 py-3.5"
      >
        <div class="flex items-center bg-[#0C0C0C] text-base text-[#B0B0B0]">
          <div
            v-if="showBack"
            class="mr-2.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5"
            data-cy="16327410f6920199"
            @click="handleClickBack"
          >
            <i class="fa-regular fa-arrow-left" />
          </div>
          <i v-else class="fa-regular fa-credit-card mr-2.5" />
          <span>
            {{ $t('payment.checkout') }}
          </span>
        </div>
        <div class="flex items-center justify-end">
          <PaymentCheckoutCompsSelectCycles
            v-if="isLive"
            :course="currentCourseObject"
            placement="bottom-end"
            show-seat
            read-only
          />
          <BaseIconClose
            :disabled="submitLoading"
            data-cy="36787456db0ad083"
            @click="handleCloseDialog"
          />
        </div>
      </div>
      <!-- body -->
      <div v-if="initLoading" class="flex items-center justify-center pt-16">
        <i class="fa-solid fa-spinner animate-spin text-xs" />
      </div>

      <!-- saved card list -->
      <div
        v-else
        class="mx-4 mb-2 mt-0 rounded border transition-all"
        :class="
          paymentType === PAYMENT_TYPE.CARD
            ? 'border-[#f0ca41]'
            : 'border-[transparent]'
        "
      >
        <div
          class="flex flex-col items-center justify-center overflow-hidden py-4"
        >
          <div
            class="mb-4 flex w-full cursor-pointer items-center pl-4"
            data-cy="aaebaebde93826ca"
            @click="handleSelectPaymentType(PAYMENT_TYPE.CARD)"
          >
            <BaseCheckboxStyle
              :state="
                paymentType === PAYMENT_TYPE.CARD
                  ? 'correctChecked'
                  : 'unchecked'
              "
            />
            <span
              class="text ml-1 text-[#B0B0B0] transition-all"
              :class="
                paymentType === PAYMENT_TYPE.CARD
                  ? 'text-white'
                  : 'text-[#B0B0B0]'
              "
            >
              {{ $t('payment.saved') }}
            </span>
          </div>
          <PaymentCheckoutCompsCarouselList />
        </div>
      </div>

      <!-- add card form -->
      <div
        class="mx-4 mb-2 mt-0 rounded border p-4 transition-all"
        :class="
          paymentType === PAYMENT_TYPE.NEW && !initLoading
            ? 'border-[#f0ca41]'
            : 'border-[transparent]'
        "
      >
        <div
          v-if="!initLoading"
          class="mb-4 flex cursor-pointer items-center"
          data-cy="fa0c37584b5b5b5a"
          @click="handleSelectPaymentType(PAYMENT_TYPE.NEW)"
        >
          <BaseCheckboxStyle
            :state="
              paymentType === PAYMENT_TYPE.NEW ? 'correctChecked' : 'unchecked'
            "
          />
          <span
            class="text ml-1 text-[#B0B0B0] transition-all"
            :class="
              paymentType === PAYMENT_TYPE.NEW ? 'text-white' : 'text-[#B0B0B0]'
            "
          >
            {{ $t('payment.new') }}
          </span>
        </div>
        <div id="payment-element" />
        <div
          v-if="!initLoading && !mountStripeLoading"
          class="mt-2 flex cursor-pointer gap-1 text-xs text-[#B0B0B0] transition-all"
          @click="handleSavePaymentMethodClick"
        >
          <BaseCheckboxStyle
            :state="savePaymentMethod ? 'correctChecked' : 'unchecked'"
            :disabled="paymentType !== PAYMENT_TYPE.NEW"
          />
          <span class="text ml-1 text-[#B0B0B0]">Save the payment method</span>
        </div>
      </div>
      <!-- body end-->

      <!-- footer -->
      <div class="flex items-center justify-between bg-[#0C0C0C] p-4">
        <div class="flex-shrink-0 text-sm font-light text-[#B7B7B7]">
          {{ $t('payment.total', { amount: totalAmount }) }}
        </div>

        <div class="flex items-center justify-center text-xs">
          <span class="mr-1 text-white">
            {{ $t('payment.quantity') }}
          </span>
          <BaseInputNumber
            v-model="paymentStore.buyQuantity"
            :disabled="!isOrg || submitLoading"
            :max-value="maxQuantity"
          />
        </div>

        <div
          class="relative flex cursor-pointer select-none items-center gap-2 overflow-hidden rounded-[0.3125rem] border-none text-sm leading-none transition-all"
          data-cy="buy-course-button"
          @click="prevSetBeforeClickToBuy"
        >
          <div
            key="loading"
            class="p-2 pb-1.5 transition-all active:scale-95"
            :class="[
              checkoutSuccess
                ? 'bg-animation bg-[#022c22] text-[#86efac]'
                : 'bg-[#f0ca41] text-[#101010] hover:bg-[#B59523]',
            ]"
          >
            <span v-if="!checkoutSuccess">
              <i
                v-if="initLoading || submitLoading || mountStripeLoading"
                class="fa-solid fa-spinner animate-spin text-xs"
              />
              {{ $t('course.membership.buy.now') }}
            </span>

            <span v-else>
              <i class="fa-regular fa-circle-check text-xs" />
              {{ $t('payment.card.success') }}
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>
<script setup>
import { ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { COURSE_TYPE } from '~/constant/course';
import { courseEvent } from '~/constant/eventBus';
import {
  CHECKOUT_NOTIFICATION,
  CHECKOUT_FROM_FLAGS,
  PAYMENT_MODEL,
} from '~/constant/payment';

const { t } = useI18n();
const $toast = useToast();
const { $eventBus } = useNuxtApp();
const paymentStore = usePaymentStore();
const authStore = useAuthStore();

let checkoutSessionElement;
const PAYMENT_TYPE = {
  CARD: 'saved card',
  NEW: 'new card',
};
const paymentType = ref(PAYMENT_TYPE.CARD);
const initLoading = ref(false);
const submitLoading = ref(false);
const mountStripeLoading = ref(false);
const checkoutSuccess = ref(false);
const savePaymentMethod = ref(true);
const forbiddenPaymentType = ref(false);

const logged = computed(() => authStore.logged);
const isOrg = computed(() => authStore.isOrg);
const dialogShow = computed(() => paymentStore.checkoutDialog);
const paymentMethodsList = computed(() => paymentStore.paymentMethods);
const selectedPaymentMethodIndex = computed(
  () => paymentStore.selectedPaymentMethodIndex,
);
const currentCourseObject = computed(() => paymentStore.currentCourseObject);
const checkoutFrom = computed(() => paymentStore.checkoutFrom);
const isLive = computed(
  () => currentCourseObject.value.type === COURSE_TYPE.LIVE,
);
const coursePaymentModel = computed(
  () => currentCourseObject.value.billing?.paymentModel,
);
const totalAmount = computed(() => {
  const { totalPrice } = currentCourseObject.value.billing || {};
  return moneyFormat(totalPrice * (paymentStore.buyQuantity || 1));
});
const maxQuantity = computed(() => {
  const { seatCount, purchases } = currentCourseObject.value;
  if (seatCount !== -1) {
    return seatCount - purchases;
  }
  return null;
});
const showBack = computed(() => {
  if (coursePaymentModel.value === PAYMENT_MODEL.RECURRING) {
    return true;
  }
  if (coursePaymentModel.value === PAYMENT_MODEL.ONE_TIME) {
    if (currentCourseObject.value.cycles?.length) {
      return true;
    }
  }
  return false;
});

watch(logged, (val) => {
  if (val) {
    handleInitCheckout();
  }
});

watchEffect(() => {
  if (!paymentMethodsList.value.length) {
    paymentType.value = PAYMENT_TYPE.NEW;
    forbiddenPaymentType.value = true;
  } else {
    paymentType.value = PAYMENT_TYPE.CARD;
    forbiddenPaymentType.value = false;
  }
});

// we can do mounted elementDom only when the dialog is opened
async function handleOpenDialog() {
  await handleInitCheckout();
}

function handleCloseDialog() {
  if (submitLoading.value) {
    return;
  }
  paymentStore.setCheckoutDialog(false);
}

function handleSelectPaymentType(type) {
  if (forbiddenPaymentType.value && type === PAYMENT_TYPE.CARD) {
    $toast.warning(t('payment.notSaved'));
    return;
  }
  paymentType.value = type;
}

// back to the previous dialog
function handleClickBack() {
  handleCloseDialog();
  // important!!!!!!! this will help to re-generate the checkout session
  paymentStore.checkoutSession = null;
  if (coursePaymentModel.value === PAYMENT_MODEL.RECURRING) {
    paymentStore.setSubscribeDialog(true);
  } else {
    paymentStore.setOneTimePaidConfirmCyclesDialog(true);
  }
}

function handleSavePaymentMethodClick() {
  if (paymentType.value !== PAYMENT_TYPE.NEW) {
    return;
  }
  savePaymentMethod.value = !savePaymentMethod.value;
}

// 初始化请求checkout session并挂载payment element
async function handleInitCheckout() {
  try {
    console.log('handleInitCheckout');
    checkoutSuccess.value = false;
    if (!logged.value) {
      return;
    }
    initLoading.value = true;
    const [_paymentListRes, checkoutSessionRes] = await Promise.all([
      paymentStore.getStripePaymentMethodsList(),
      paymentStore.initCheckoutSessionElement(),
    ]);
    checkoutSessionElement = checkoutSessionRes;
    mountStripeLoading.value = true;
    const paymentElement = checkoutSessionElement.createElement('payment', {
      layout: 'accordion',
    });
    paymentElement.mount('#payment-element');
    paymentElement.on('ready', () => {
      mountStripeLoading.value = false;
    });
  } catch (error) {
    console.error('handleInitCheckout', error);
  } finally {
    initLoading.value = false;
  }
}

// 让客户选择是否设置为默认支付方式
async function prevSetBeforeClickToBuy() {
  if (submitLoading.value || initLoading.value || mountStripeLoading.value) {
    return;
  }

  let showConfirmDialog = false;
  let confirmRes = false;
  let saveCardId = null;

  // when select saved card but not-default
  if (paymentType.value === PAYMENT_TYPE.CARD) {
    const targetPayment =
      paymentMethodsList.value[selectedPaymentMethodIndex.value];
    if (targetPayment) {
      console.log('targetPayment', targetPayment);
      if (!targetPayment.isDefault) {
        showConfirmDialog = true;
      }
      saveCardId = targetPayment.stripeId;
    }
  }

  // when checkout with new card
  if (paymentType.value === PAYMENT_TYPE.NEW) {
    if (savePaymentMethod.value) {
      showConfirmDialog = true;
    }
  }

  if (showConfirmDialog) {
    confirmRes = await ElMessageBox.confirm(
      t('base.dialog.question'),
      'Confirm',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      },
    ).catch(() => (confirmRes = false));
  }

  handleClickToBuy({
    savePaymentMethodAsDefault: confirmRes,
    saveCardId,
  });
}

async function handleClickToBuy({ savePaymentMethodAsDefault, saveCardId }) {
  try {
    submitLoading.value = true;
    let checkoutParams = {
      redirect: 'if_required',
      returnUrl: window.location.href,
    };

    // add card then submit
    if (paymentType.value === PAYMENT_TYPE.NEW) {
      if (savePaymentMethodAsDefault) {
        checkoutParams = {
          ...checkoutParams,
          savePaymentMethod: true,
          returnUrl: `${window.location.href}?setDefault=true`,
        };
      }
    } else {
      // select saved card then submit
      checkoutParams.paymentMethod = saveCardId;
    }

    // pay with default payment directly
    console.log('checkoutParams', checkoutParams);
    /**
     * @description: https://docs.stripe.com/js/custom_checkout/confirm
     * @param {
     *  savePaymentMethod: boolean,
     *  paymentMethod: string, // use saved card to pay
     *  redirect: string,
     *  returnUrl: string,
     * } checkoutParams
     */
    const confirmRes = await checkoutSessionElement.confirm(checkoutParams);
    console.log('confirmRes', confirmRes);

    // handle Payment Success Callback
    if (confirmRes.success) {
      const courseId = paymentStore.currentCourseObject.id;
      const notificationRes = await paymentStore.waitingForPayment({
        courseId,
      });

      // handle set default payment method
      if (savePaymentMethodAsDefault) {
        console.log('saveCardId', saveCardId);
        let cardId = saveCardId;
        if (!cardId) {
          const sessionInfo = await paymentStore.retrieveCheckoutSession(
            confirmRes.success.id,
          );
          console.log('sessionInfo', sessionInfo);
          cardId = sessionInfo.paymentMethod;
        }
        if (cardId) {
          console.log('cardId', cardId);
          await paymentStore.setDefaultPaymentMethod({
            paymentMethodId: cardId,
          });
          // await paymentStore.postStripePaymentMethod({
          //   paymentMethodId: cardId,
          //   isDefault: true,
          //   toRefreshList: false,
          // });
        }
      }

      if (notificationRes === CHECKOUT_NOTIFICATION.SUCCESS_TEXT) {
        checkoutSuccess.value = true;
        // waiting for the animation
        await sleep(2000);
      }

      submitLoading.value = false;
      // 课程详情 和 market页面的购买成功事件
      $eventBus.emit(courseEvent.PURCHASED_SUCCESS, { courseId });
      handleCloseDialog();
      paymentStore.setSuccessDialog(true);

      // sven 分配课程购买成功回调事件
      if (
        checkoutFrom.value ===
        CHECKOUT_FROM_FLAGS.IAM_MANAGE_LICENSES_UPDATE_COURSE
      ) {
        $eventBus.emit(courseEvent.UPDATE_MANAGE_LICENSES_COURSE);
        $eventBus.emit(courseEvent.UPDATE_IAM_ROLE_COURSE);
      }
    }

    if (confirmRes.error) {
      $toast.error(confirmRes.error?.message);
    }
  } catch (err) {
    console.error('handleClickToBuy', err);
  } finally {
    submitLoading.value = false;
  }
}
</script>
<style scoped>
@keyframes colorChange {
  0% {
    color: #101010;
    background-color: #f0ca41;
  }
  100% {
    color: #86efac;
    background-color: #022c22;
  }
}

.bg-animation {
  animation: colorChange 0.5s linear;
}
</style>

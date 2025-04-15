<template>
  <div class="flex flex-col items-center gap-2">
    <div class="text-sm text-white/70">
      {{
        paymentModel === PAYMENT_MODEL.ONE_TIME ||
        paymentModel === PAYMENT_MODEL.FREE
          ? `${$t('course.membership.buy.installment.withOut')} $${moneyFormat(totalPrice)}`
          : ''
      }}
      {{
        paymentModel === PAYMENT_MODEL.RECURRING
          ? $t('course.membership.buy.installment.with', {
              amount: `$${moneyFormat(installmentsAmount)}`,
            })
          : ''
      }}
    </div>
    <BaseButton
      type="primary"
      class="w-48 justify-center"
      data-cy="checkout-button"
      @click="onCheckout"
    >
      <i
        v-if="courseStore.purchasing"
        class="fa-solid fa-spinner animate-spin text-xs"
      />
      {{
        paymentModel === PAYMENT_MODEL.ONE_TIME
          ? $t('course.membership.buy.now')
          : ''
      }}
      {{
        paymentModel === PAYMENT_MODEL.RECURRING
          ? $t('course.membership.subscribe.title')
          : ''
      }}
      {{
        paymentModel === PAYMENT_MODEL.FREE ? $t('course.membership.start') : ''
      }}
    </BaseButton>
  </div>
</template>

<script>
import { PAYMENT_MODEL } from '~/constant/payment';

export default {
  setup() {
    const authStore = useAuthStore();
    const courseStore = useCourseStore();
    const paymentStore = usePaymentStore();
    return { authStore, courseStore, paymentStore, PAYMENT_MODEL };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    billing() {
      return this.course.billing || {};
    },
    paymentModel() {
      return this.billing.paymentModel;
    },
    totalPrice() {
      return this.billing.totalPrice || 0;
    },
    installmentsAmount() {
      return this.billing.installmentsAmount || 0;
    },
  },
  watch: {
    async 'authStore.logged'(logged) {
      if (logged && this.paymentStore.checkoutAfterLogin) {
        this.authStore.popup = false;
        this.paymentStore.checkoutAfterLogin = false;
        if (!this.buyed) {
          this.onCheckout();
        }
      }
    },
  },
  methods: {
    async onCheckout() {
      if (!this.authStore.logged) {
        this.authStore.popup = true;
        this.courseStore.popup.state = false;
        return;
      }

      if (this.courseStore.purchasing) {
        return;
      }

      try {
        this.courseStore.purchasing = true;
        await this.paymentStore.onCheckout(this.course.id);
        this.courseStore.purchasing = false;
      } catch (error) {
        this.courseStore.purchasing = false;
        throw error;
      }
    },
  },
};
</script>

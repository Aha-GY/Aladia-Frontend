<template>
  <OrganizationHubCourseEditItem
    class="mb-5"
    :class="
      billing.paymentModel === PAYMENT_MODEL.ONE_TIME ||
      billing.paymentModel === PAYMENT_MODEL.FREE
        ? 'pointer-events-none opacity-50'
        : ''
    "
    :disabled="
      billing.paymentModel === PAYMENT_MODEL.ONE_TIME ||
      billing.paymentModel === PAYMENT_MODEL.FREE
    "
    :value="billing.subscriptionFee"
    :focus="focus"
    :title="$t('course.price.fee')"
    :money="true"
  >
    <input
      v-model="billing.subscriptionFee"
      :disabled="billing.paymentModel === PAYMENT_MODEL.ONE_TIME"
      maxlength="10"
      class="relative z-0 h-full w-0 flex-1 bg-transparent text-right outline-none"
      data-cy="subscription-fee-input"
      @focus="focus = true"
      @blur="focus = false"
      @input="
        billing.subscriptionFee = billing.subscriptionFee.replace(/[^0-9]/g, '')
      "
    />
  </OrganizationHubCourseEditItem>
</template>

<script>
import { PAYMENT_MODEL } from '~/constant/payment';

export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse, PAYMENT_MODEL };
  },
  data() {
    return {
      focus: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    billing() {
      return this.course.billing || {};
    },
  },
  watch: {
    focus(val) {
      if (!val) {
        this.$emit('billing');
      }
    },
  },
};
</script>

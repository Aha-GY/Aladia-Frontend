<template>
  <OrganizationHubCourseEditItem
    class="mb-5"
    :class="
      billing.paymentModel === PAYMENT_MODEL.FREE
        ? 'pointer-events-none opacity-50'
        : ''
    "
    :disabled="billing.paymentModel === PAYMENT_MODEL.FREE"
    :value="billing.totalPrice"
    :focus="focus"
    :title="$t('course.price.title')"
    :money="true"
  >
    <input
      v-model="billing.totalPrice"
      maxlength="10"
      :disabled="billing.paymentModel === PAYMENT_MODEL.FREE"
      class="relative z-0 h-full w-0 flex-1 bg-transparent text-right outline-none"
      data-cy="total-price-input"
      @focus="focus = true"
      @blur="focus = false"
      @input="billing.totalPrice = billing.totalPrice.replace(/[^0-9]/g, '')"
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

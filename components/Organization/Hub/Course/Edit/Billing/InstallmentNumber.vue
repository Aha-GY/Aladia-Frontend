<template>
  <OrganizationHubCourseEditItem
    class="pointer-events-none mb-5 opacity-50"
    :disabled="billing.paymentModel === PAYMENT_MODEL.ONE_TIME"
    :value="billing.installmentNumber"
    :title="$t('course.price.billing.number')"
  >
    <input
      v-model="billing.installmentNumber"
      disabled
      maxlength="20"
      class="relative z-0 h-full w-0 flex-1 bg-transparent text-right outline-none"
      data-cy="81b81e3aa5aba1f9"
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
};
</script>

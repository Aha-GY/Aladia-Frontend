<template>
  <OrganizationHubCourseEditItem
    class="pointer-events-none mb-5 opacity-50"
    :disabled="billing.paymentModel === PAYMENT_MODEL.ONE_TIME"
    :value="billing.remainingAmount"
    :title="$t('course.price.remaining.amount')"
    :money="true"
  >
    <input
      v-model="billing.remainingAmount"
      disabled
      maxlength="20"
      class="relative z-0 h-full w-0 flex-1 bg-transparent text-right outline-none"
      data-cy="3dead54847f1007e"
    />
  </OrganizationHubCourseEditItem>
</template>

<script>
import { PAYMENT_MODEL } from '~/constant/payment';

export default {
  props: {
    loading: Boolean,
  },
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

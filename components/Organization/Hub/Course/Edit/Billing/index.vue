<template>
  <OrganizationHubCourseEditWrap :step="3" title="Billing">
    <OrganizationHubCourseEditBillingPaymentModel />
    <OrganizationHubCourseEditBillingTotalPrice @billing="retrieve" />
    <div v-if="type === 'live'">
      <OrganizationHubCourseEditBillingSubscriptionFee @billing="retrieve" />
      <OrganizationHubCourseEditBillingFrequency @billing="retrieve" />
      <OrganizationHubCourseEditBillingRemainingAmount />
      <OrganizationHubCourseEditBillingInstallmentNumber />
      <OrganizationHubCourseEditBillingInstallmentsAmount />
    </div>
  </OrganizationHubCourseEditWrap>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    type() {
      return this.course.type;
    },
    billing() {
      return this.course.billing || {};
    },
    dates() {
      return this.course.cycles?.[0]?.dates || {};
    },
  },
  watch: {
    dates: {
      handler() {
        this.retrieve();
      },
      deep: true,
    },
    'billing.paymentModel'(newVal, oldVal) {
      if (newVal && oldVal) {
        this.billing.totalPrice = null;
        this.billing.subscriptionFee = null;
        this.billing.frequency = null;
        this.billing.installments = [];
        this.billing.installmentNumber = null;
        this.billing.remainingAmount = null;
        this.billing.installmentsAmount = null;
      }
    },
  },
  methods: {
    async retrieve() {
      const dates = this.dates;
      const frequency = this.billing.frequency;
      const totalPrice = Number(this.billing.totalPrice);
      const subscriptionFee = Number(this.billing.subscriptionFee);

      if (!dates || !frequency || !totalPrice || !subscriptionFee) {
        return;
      }

      if (!dates.startDate || !dates.endDate) {
        return;
      }

      if (this.type !== 'live' || this.loading) {
        return;
      }

      try {
        this.loading = true;
        this.billing.installments = [];
        this.billing.installmentNumber = null;
        this.billing.remainingAmount = null;
        this.billing.installmentsAmount = null;
        const data = await this.hubCourse.retrieveBillingInfo({
          dates,
          frequency,
          totalPrice,
          subscriptionFee,
        });
        this.loading = false;
        Object.assign(this.billing, data);
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
};
</script>

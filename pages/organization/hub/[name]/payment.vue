<template>
  <div class="h-[calc(100vh-8rem)]">
    <OrganizationHubPaymentWidgets />
    <OrganizationHubPaymentHistory />
  </div>
</template>

<script>
export default {
  setup() {
    const hubPaymentStore = useHubPaymentStore();
    return { hubPaymentStore };
  },
  mounted() {
    this.hubPaymentStore.getPaymentTransactions();
    // this.hubPaymentStore.getTimeLine();
  },
};
</script>

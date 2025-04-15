<template>
  <div class="relative pr-3">
    <OrganizationHubReviewWidget />
    <OrganizationHubReviewHistory />
  </div>
</template>

<script>
export default {
  setup() {
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore };
  },
  beforeUnmount() {
    this.hubReviewStore.$reset();
  },
};
</script>

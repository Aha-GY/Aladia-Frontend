<template>
  <div>
    <OrganizationHubAnalyticsFilter class="mb-4" />
    <div>
      <OrganizationHubAnalyticsWidgets
        v-if="analyticsStore.widgetActive.length"
      />
      <OrganizationHubAnalyticsCreation v-else />
    </div>
    <OrganizationHubAnalyticsCreationSelect />
  </div>
</template>

<script>
export default {
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
  beforeUnmount() {
    this.analyticsStore.$reset();
  },
};
</script>

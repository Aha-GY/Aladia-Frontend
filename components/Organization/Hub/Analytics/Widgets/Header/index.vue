<template>
  <div class="mb-2 flex items-center justify-between">
    <OrganizationHubAnalyticsWidgetsHeaderName :name="name" />
    <div class="flex items-center gap-2">
      <OrganizationHubAnalyticsWidgetsHeaderMore />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
  },
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
};
</script>

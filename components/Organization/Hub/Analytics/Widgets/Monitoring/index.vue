<template>
  <OrganizationHubAnalyticsWidgetsWrap
    data-type="monitoring-activity"
    class="relative flex flex-col"
  >
    <OrganizationHubAnalyticsWidgetsHeader
      name="org.dashboard.monitoring.activity"
    />
    <OrganizationHubAnalyticsWidgetsMonitoringTime />
    <div class="flex flex-1 items-end justify-center">
      <OrganizationHubAnalyticsWidgetsMonitoringSingle v-if="filter === 1" />
      <OrganizationHubAnalyticsWidgetsMonitoringMultiple v-if="filter > 1" />
    </div>
  </OrganizationHubAnalyticsWidgetsWrap>
</template>

<script>
export default {
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
  computed: {
    filter() {
      return this.analyticsStore.filter;
    },
  },
};
</script>

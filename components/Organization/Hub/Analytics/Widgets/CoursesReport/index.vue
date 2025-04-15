<template>
  <OrganizationHubAnalyticsWidgetsWrap
    data-type="courses-report"
    class="flex flex-col"
  >
    <OrganizationHubAnalyticsWidgetsHeader
      name="org.hub.analytics.courses.report"
    />
    <OrganizationHubAnalyticsWidgetsCoursesReportSingle v-if="filter === 1" />
    <OrganizationHubAnalyticsWidgetsCoursesReportMultiple v-if="filter > 1" />
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

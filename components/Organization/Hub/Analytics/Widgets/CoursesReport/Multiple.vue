<template>
  <OrganizationHubAnalyticsWidgetsCoursesReportSingle
    v-if="analyticsStore.coursesReportDetail"
  />
  <OrganizationHubAnalyticsWidgetsCoursesReportOverview v-else />
</template>

<script>
export default {
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
  beforeUnmount() {
    this.analyticsStore.coursesReportDetail = null;
  },
};
</script>

<template>
  <OrganizationHubAnalyticsWidgetsWrap
    data-type="courses-monitoring"
    class="flex flex-col"
  >
    <OrganizationHubAnalyticsWidgetsHeader
      name="org.dashboard.monitoring.courses.inProgress"
    />
    <OrganizationHubAnalyticsWidgetsCoursesSearch
      :is-list="isList"
      @change="onChange"
    />
    <!-- <OrganizationHubAnalyticsWidgetsCoursesEmpty /> -->
    <OrganizationHubAnalyticsWidgetsCoursesList v-if="isList" />
    <OrganizationHubAnalyticsWidgetsCoursesMain v-else />
  </OrganizationHubAnalyticsWidgetsWrap>
</template>

<script>
export default {
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
  data() {
    return {
      isList: false,
    };
  },
  methods: {
    onChange(isList) {
      this.isList = isList;
    },
  },
};
</script>

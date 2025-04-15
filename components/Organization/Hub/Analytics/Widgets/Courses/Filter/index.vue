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
    <OrganizationHubAnalyticsWidgetsCoursesTab />
    <OrganizationHubAnalyticsWidgetsCoursesList v-if="isList" />
    <div v-else class="hide-scrollbar h-0 flex-1 overflow-y-auto">
      <OrganizationHubAnalyticsWidgetsCoursesFilterItem
        v-for="n in 4"
        :key="n"
      />
    </div>
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

<template>
  <div class="hide-scrollbar flex h-0 flex-1 flex-col gap-2 overflow-y-auto">
    <OrganizationHubAnalyticsWidgetsCoursesListItem v-for="n in 10" :key="n" />
  </div>
</template>

<script>
export default {
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
};
</script>

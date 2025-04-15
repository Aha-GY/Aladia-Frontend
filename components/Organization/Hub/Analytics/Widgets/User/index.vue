<template>
  <OrganizationHubAnalyticsWidgetsWrap
    data-type="users-activity"
    class="flex flex-col"
  >
    <OrganizationHubAnalyticsWidgetsHeader name="org.user.total" />
    <OrganizationHubAnalyticsWidgetsUserMain />
    <!-- <OrganizationHubAnalyticsWidgetsUserEmpty /> -->
  </OrganizationHubAnalyticsWidgetsWrap>
</template>

<script>
export default {
  props: {
    w: Number,
  },
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
  watch: {
    w: {
      immediate: true,
      handler() {
        // console.log(this.w);
      },
    },
  },
};
</script>

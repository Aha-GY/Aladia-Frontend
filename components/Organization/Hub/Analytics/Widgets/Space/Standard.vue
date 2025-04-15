<template>
  <OrganizationHubAnalyticsWidgetsWrap
    data-type="space-maintenance"
    class="relative flex flex-col"
  >
    <OrganizationHubAnalyticsWidgetsHeader
      name="org.hub.task.manage.maintenance"
    />
    <div v-if="w >= 8" class="flex gap-6">
      <OrganizationHubAnalyticsWidgetsSpaceStorage class="w-1/2" />
      <OrganizationHubAnalyticsWidgetsSpaceStreaming class="w-1/2" />
    </div>
    <div v-else>
      <OrganizationHubAnalyticsWidgetsSpaceSort
        data-cy="a2b4585491bf1163"
        @click="storage = !storage"
      />
      <OrganizationHubAnalyticsWidgetsSpaceStorage v-if="storage" />
      <OrganizationHubAnalyticsWidgetsSpaceStreaming v-else />
    </div>
    <!-- <OrganizationHubAnalyticsWidgetsSpaceEmpty /> -->
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
  data() {
    return {
      storage: true,
    };
  },
};
</script>

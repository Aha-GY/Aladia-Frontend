<template>
  <OrganizationHubAnalyticsWidgetsWrap
    data-type="users-activity"
    class="flex flex-col"
  >
    <OrganizationHubAnalyticsWidgetsHeader name="org.user.selected" />
    <div class="flex h-0 flex-1">
      <div class="w-48 pt-2">
        <div class="mb-6 text-2xl font-bold">
          {{ $t('org.hub.analytics.filter.user', { filter: filter }) }}
        </div>
        <div v-if="filter === 1" class="flex items-center gap-2">
          <img
            class="size-12 rounded-full border-2 border-white/50 object-cover"
            src="https://storage.googleapis.com/testing_uploads/elijah.jpeg"
          />
          <div class="text-sm">
            <div>Maria Invernizzi</div>
            <div class="text-[#88C359]">
              {{ $t('base.member.online') }}
            </div>
          </div>
        </div>
        <div v-if="filter > 1" class="flex flex-col gap-3">
          <div v-for="n in 3" :key="n" class="flex items-center gap-2">
            <img
              class="size-6 rounded-full object-cover"
              src="https://storage.googleapis.com/testing_uploads/elijah.jpeg"
            />
            <div class="text-sm">
              <div>Maria Invernizzi</div>
            </div>
          </div>
        </div>
      </div>
      <OrganizationHubAnalyticsWidgetsUserList v-if="w >= 4" class="h-full" />
    </div>
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
  computed: {
    filter() {
      return this.analyticsStore.filter;
    },
  },
};
</script>

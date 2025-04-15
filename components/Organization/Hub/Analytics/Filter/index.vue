<template>
  <div
    class="flex items-center justify-between rounded bg-black px-3 py-2 text-13"
  >
    <div class="flex flex-1 items-center text-white/50">
      <div class="mr-4">
        {{ $t('org.hub.analytics.filter.dialog') }}
      </div>
      <div
        class="mr-2 flex cursor-pointer items-center gap-2 rounded bg-white/5 px-3 py-1.5 text-white hover:bg-white/10"
      >
        <i class="fa-light fa-folder-open" />
        {{ $t('org.hub.analytics.filter.space') }}
      </div>
      <div
        class="mr-2 flex cursor-pointer items-center gap-2 rounded bg-white/5 px-3 py-1.5 text-white hover:bg-white/10"
        data-cy="14318b09b8dd6438"
        @click="onTimeRange"
      >
        <i class="fa-light fa-calendar-days" />
        {{ $t('org.hub.analytics.filter.time') }}
      </div>
      <div
        class="mr-2 flex cursor-pointer items-center gap-2 rounded bg-white/5 px-3 py-1.5 text-white hover:bg-white/10"
        data-cy="9d7727edb3dc7950"
        @click="onUsers"
      >
        <i class="fa-light fa-user-group" />
        {{ $t('org.hub.analytics.filter.users') }}
      </div>
    </div>
    <div class="cursor-pointer text-white/80">
      {{ $t('org.hub.analytics.filter.clear') }}
    </div>
  </div>
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
  methods: {
    onTimeRange() {
      if (this.filter === 3) {
        this.analyticsStore.filter = 0;
      } else {
        this.analyticsStore.filter = 3;
      }
    },
    onUsers() {
      if (this.filter === 1) {
        this.analyticsStore.filter = 0;
      } else {
        this.analyticsStore.filter = 1;
      }
    },
  },
};
</script>

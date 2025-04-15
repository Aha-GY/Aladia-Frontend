<template>
  <div class="flex h-8 items-center justify-between rounded-t-5 px-4">
    <div
      class="flex items-center gap-2 px-2 text-base font-medium text-[#FAFAFA]"
    >
      <i class="fa-light fa-filter-list" />
      {{ $t('base.filter.label') }}
    </div>
    <div
      class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
      data-cy="382ffa28848e30f2"
      @click="hubCalendarStore.sidebarOpen = false"
    >
      <i class="fa-light fa-sidebar text-sm text-[#D9D9D9]" />
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore };
  },
};
</script>

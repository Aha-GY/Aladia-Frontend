<template>
  <OrganizationHubAnalyticsWidgetsWrap
    data-type="incoming-events"
    class="flex flex-col"
  >
    <OrganizationHubAnalyticsWidgetsHeader name="org.hub.task.manage.event" />
    <div class="mb-4 flex items-center justify-between">
      <div class="text-sm font-semibold">February 2024</div>
      <div class="flex items-center gap-4 text-lg">
        <div class="next-icon flex cursor-pointer items-center justify-center">
          <BaseNextWhite class="rotate-180" />
        </div>
        <div class="next-icon flex cursor-pointer items-center justify-center">
          <BaseNextWhite />
        </div>
      </div>
    </div>
    <div class="mb-4 flex items-center justify-between font-light">
      <div class="flex cursor-pointer flex-col items-center">
        <div class="mb-1 text-white/50">M</div>
        <div class="flex size-6 items-center justify-center rounded-full">
          12
        </div>
        <div class="size-1 rounded-full bg-[#d8b847]" />
      </div>
      <div class="flex cursor-pointer flex-col items-center">
        <div class="mb-1 text-white/50">T</div>
        <div
          class="flex size-6 items-center justify-center rounded-full text-white/50"
        >
          13
        </div>
      </div>
      <div class="flex cursor-pointer flex-col items-center">
        <div class="mb-1 text-[#d8b847]">W</div>
        <div
          class="flex size-6 items-center justify-center rounded-full bg-[#d8b847] text-black"
        >
          14
        </div>
      </div>
      <div class="flex cursor-pointer flex-col items-center">
        <div class="mb-1 text-white/50">T</div>
        <div class="flex size-6 items-center justify-center rounded-full">
          15
        </div>
        <div class="size-1 rounded-full bg-[#d8b847]" />
      </div>
      <div class="flex cursor-pointer flex-col items-center">
        <div class="mb-1 text-white/50">F</div>
        <div class="flex size-6 items-center justify-center rounded-full">
          16
        </div>
        <div class="size-1 rounded-full bg-[#d8b847]" />
      </div>
      <div class="flex cursor-pointer flex-col items-center">
        <div class="mb-1 text-white/50">S</div>
        <div
          class="flex size-6 items-center justify-center rounded-full text-white/50"
        >
          17
        </div>
      </div>
      <div class="flex cursor-pointer flex-col items-center">
        <div class="mb-1 text-white/50">S</div>
        <div class="flex size-6 items-center justify-center rounded-full">
          18
        </div>
        <div class="size-1 rounded-full bg-[#d8b847]" />
      </div>
    </div>
    <OrganizationHubAnalyticsWidgetsIncomingMain />
    <!-- <OrganizationHubAnalyticsWidgetsIncomingEmpty /> -->
  </OrganizationHubAnalyticsWidgetsWrap>
</template>

<script>
export default {
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
};
</script>

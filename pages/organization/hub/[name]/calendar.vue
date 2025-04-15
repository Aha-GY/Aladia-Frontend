<template>
  <div
    class="relative flex h-[calc(100vh-8rem)] rounded"
    :class="hubCalendarStore.sidebarOpen ? 'gap-4' : ''"
  >
    <OrganizationHubCalendarSidebar />
    <OrganizationHubCalendar />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    const hubEventStore = useHubEventStore();
    return { hubCalendarStore, hubEventStore };
  },
  beforeUnmount() {
    this.hubCalendarStore.$reset();
    this.hubEventStore.$reset();
  },
};
</script>

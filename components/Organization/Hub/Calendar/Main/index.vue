<template>
  <div
    class="calendar-main relative z-10 -ml-4 flex h-0 w-[calc(100%+1rem)] flex-1 overflow-hidden pl-4"
  >
    <div
      ref="main"
      class="relative h-full w-full transition-all"
      :style="{
        width: `calc(100% - ${hubCalendarStore.sidebarRightOpen ? 246 : 0}px)`,
      }"
    >
      <OrganizationHubCalendarMainDay
        v-if="hubCalendarStore.dateTypeIndex === 0"
      />
      <OrganizationHubCalendarMainWeek
        v-if="hubCalendarStore.dateTypeIndex === 1"
      />
      <OrganizationHubCalendarMainMonth
        v-if="hubCalendarStore.dateTypeIndex === 2"
      />
      <OrganizationHubCalendarMainYear
        v-if="hubCalendarStore.dateTypeIndex === 3"
      />
      <OrganizationHubCalendarMainList
        v-if="hubCalendarStore.dateTypeIndex === 4"
      />
      <div
        v-if="hubCalendarStore.isDarg"
        class="pointer-events-none absolute cursor-pointer"
        :style="{
          top: `${dargClient.y}px`,
          left: `${dargClient.x}px`,
          width: `${hubCalendarStore.dargItems.width}px`,
        }"
      >
        <OrganizationHubCalendarMainMonthItem
          :entry="hubCalendarStore.dargItems"
        />
      </div>
      <!-- <OrganizationHubCalendarAdd v-if="!hubCalendarStore.courseId" /> -->
    </div>
    <OrganizationHubCalendarHeaderSearchEvents />
  </div>
</template>
<script>
import './style.css';

export default {
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore };
  },
  computed: {
    dargClient() {
      const rect = this.$refs.main.getBoundingClientRect();
      const clientX = this.hubCalendarStore.dargItems.clientX;
      const clientY = this.hubCalendarStore.dargItems.clientY;
      const x = clientX - rect.left - 12;
      const y = clientY - rect.top - 12;
      return {
        x: x > 0 ? x : 0,
        y: y > 0 ? y : 0,
      };
    },
  },
};
</script>

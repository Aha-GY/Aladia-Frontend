<template>
  <div
    v-if="!$device.isMobile"
    class="h-full w-[22.5rem] shrink-0 overflow-hidden rounded-5 bg-[#060606] transition-all"
    :class="hubCalendarStore.sidebarOpen ? 'ml-0' : '-ml-[22.5rem] opacity-0'"
  >
    <div class="flex h-full flex-col gap-2 pb-3">
      <div class="relative px-3">
        <BaseDatePicker
          v-model="rangeValue"
          class="!p-0"
          :default-value="hubCalendarStore.initDate"
          mode="daterange"
          @change="dateChange"
        />
        <div
          class="absolute right-6 top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
          data-cy="87c2b1577a8e26bb"
          @click="hubCalendarStore.sidebarOpen = false"
        >
          <i class="fa-solid fa-sidebar text-sm text-[#f1f1f1]" />
        </div>
      </div>
      <div
        class="hide-scrollbar ml-3 flex h-0 flex-1 flex-col gap-2 overflow-y-auto pr-3"
      >
        <BaseSpaceCourse
          v-if="course?.id"
          :course="course"
          :is-checked="true"
          class="mx-2"
          @change-cycle="onChangeCycle"
        />
        <OrganizationHubCalendarSidebarCalendars v-if="logged" />
        <OrganizationHubCalendarSidebarCourses v-if="logged" />
        <OrganizationHubCalendarSidebarOrganizations v-if="authStore.isUser" />
        <OrganizationHubCalendarSidebarUsers />
      </div>
    </div>
  </div>
  <OrganizationHubCalendarSidebarDelete />
  <el-drawer
    v-if="$device.isMobile"
    v-model="hubCalendarStore.sidebarOpen"
    :close-on-press-escape="false"
    :with-header="false"
    direction="ltr"
    size="80%"
  >
    <div class="relative flex h-full flex-col gap-2 p-2 pb-3">
      <BaseDatePicker
        v-model="rangeValue"
        class="flex flex-col items-center !p-0"
        :default-value="hubCalendarStore.initDate"
        mode="daterange"
        @change="dateChange"
      />
      <div
        class="hide-scrollbar flex h-0 flex-1 flex-col gap-4 overflow-y-auto"
      >
        <BaseSpaceCourse
          v-if="course?.id"
          :course="course"
          :is-checked="true"
          @change-cycle="onChangeCycle"
        />
        <OrganizationHubCalendarSidebarCalendars v-if="logged" />
        <OrganizationHubCalendarSidebarCourses v-if="logged" />
        <OrganizationHubCalendarSidebarOrganizations v-if="authStore.isUser" />
        <OrganizationHubCalendarSidebarUsers />
      </div>
      <!-- <div
        v-if="!course?.id"
        class="absolute bottom-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#E0B92C] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-all hover:rotate-180 hover:scale-125"
        data-cy="1821dd6d4b34de54"
        @click.stop="onCreate"
      >
        <i class="fa-regular fa-plus text-xl text-[#060606]" />
      </div> -->
    </div>
  </el-drawer>
</template>
<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    course: Object,
  },
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    const hubSidebar = useHubSidebarStore();
    const hubSpaces = useHubSpacesStore();
    const authStore = useAuthStore();
    return { hubCalendarStore, hubSpaces, hubSidebar, authStore };
  },
  data() {
    return {
      rangeValue: {
        start: null,
        end: null,
      },
      dateList: [
        {
          name: 'Day',
          type: 'day',
        },
        {
          name: 'Week',
          type: 'week',
        },
        {
          name: 'Month',
          type: 'month',
        },
        {
          name: 'Year',
          type: 'year',
        },
        {
          name: 'List',
          type: 'list',
        },
      ],
    };
  },
  computed: {
    dateTypeIndex() {
      return this.hubCalendarStore.dateTypeIndex;
    },
    logged() {
      return this.authStore.logged;
    },
  },
  beforeMount() {
    this.init();
  },
  methods: {
    init() {
      this.hubCalendarStore.sidebarOpen = !this.$device.isMobile;
      this.hubSidebar.state = false;
      if (this.logged) {
        this.hubCalendarStore.handleSelectCalendar();
      }
    },
    dateChange(item) {
      if (!item.start || !item.end) {
        this.hubCalendarStore.filterDates = {
          startDate: null,
          endDate: null,
        };
      } else {
        this.hubCalendarStore.initDate = dayjs(item.start).toDate();
        this.hubCalendarStore.filterDates = {
          startDate: item.start,
          endDate: item.end,
        };
      }
      // this.hubCalendarStore.startDateTime = dayjs(item.start).toISOString();
      // this.hubCalendarStore.endDateTime = dayjs(item.end).toISOString();
    },
    selectIndex(index) {
      this.hubCalendarStore.dateTypeIndex = index;
      this.hubCalendarStore.sidebarOpen = false;
    },
    async onCreate() {
      this.hubSidebar.state = false;
      this.hubSidebar.calendar.state = false;
      await this.$nextTick();
      this.hubSidebar.calendar.data = {
        color: '#1CC054',
      };
      this.hubCalendarStore.dateTypeIndex = 1;
      this.hubSidebar.state = true;
      this.hubSidebar.calendar.state = true;
      if (this.$device.isMobile) {
        this.hubCalendarStore.sidebarOpen = false;
      }
    },
    onChangeCycle(cycle, course) {
      this.hubCalendarStore.courseActives =
        this.hubCalendarStore.courseActives.map((r) => {
          if (r.id === course.id) {
            r.cycleId = cycle.id;
            this.hubCalendarStore.dateTimeRange.calendarIds =
              this.hubCalendarStore.dateTimeRange.calendarIds.filter(
                (id) => id !== r.calendarId,
              );
            this.hubCalendarStore
              .searchEvents(
                {
                  calendarId: r.calendarId,
                  cycleId: r.cycleId ? r.cycleId : undefined,
                },
                r.color,
              )
              .then((r) => {
                this.hubCalendarStore.entryDataList.push(...r);
              });
          }
          return r;
        });
    },
  },
};
</script>

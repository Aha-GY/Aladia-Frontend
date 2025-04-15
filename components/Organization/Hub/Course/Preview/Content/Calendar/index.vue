<template>
  <div class="hub-course-calendar h-full w-full">
    <OrganizationHubCalendar v-if="render" class="!mx-0 !w-full" />
  </div>
</template>

<script>
export default {
  setup() {
    const hubEvent = useHubEventStore();
    const hubCourse = useHubCoursesStore();
    const hubCalendarStore = useHubCalendarStore();
    return { hubEvent, hubCourse, hubCalendarStore };
  },
  data() {
    return {
      render: true,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    chapter() {
      return this.hubCourse.chapterPopup;
    },
    lecture() {
      return this.hubCourse.lecturePopup;
    },
  },
  watch: {
    // 'hubEvent.event': {
    //   handler() {
    //     this.addCreatingEvent();
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    lecture() {
      if (this.lecture) {
        this.addCreatingEvent();
      } else {
        this.hubCalendarStore.entryDataList =
          this.hubCalendarStore.entryDataList.filter(
            (entry) => !entry.creating,
          );
      }
    },
    async 'hubCourse.loading'(state) {
      // 刷新日历
      if (!state) {
        await this.$nextTick();
        this.render = false;
        await this.$nextTick();
        this.render = true;
      }
    },
  },
  mounted() {
    // this.hubCalendarStore.sidebarOpen = false;
  },
  // beforeUnmount() {
  //   this.hubCalendarStore.$reset();
  // },
  methods: {
    async addCreatingEvent() {
      const event = { ...this.hubEvent.event };

      if (this.lecture?.type !== 'live') {
        return;
      }
      if (!event.dates.startDate || !event.dates.endDate) {
        return;
      }
      if (
        this.hubCalendarStore.entryDataList.some(
          (entry) => entry.id === event.id,
        )
      ) {
        return;
      }

      const newEvent = {
        ...event,
        id: event.id || String(Date.now()), // 临时 id
        startDate: new Date(event.dates.startDate),
        endDate: new Date(event.dates.endDate),
        name: this.lecture.title,
        color: this.course.color,
        creating: true,
        entiry: {
          id: this.course.id,
          type: 'course',
        },
        // entityId: this.course.id,
        // entityType: 'course',
        chapterSummary: {
          id: this.chapter.id,
          title: this.chapter.name,
          dates: this.chapter.cycles[0].dates,
        },
      };

      // 每次只展示一个创建中的事件
      this.hubCalendarStore.entryDataList =
        this.hubCalendarStore.entryDataList.filter((entry) => !entry.creating);
      this.hubCalendarStore.entryDataList.push(newEvent);
    },
  },
};
</script>

<style lang="scss">
.hub-course-calendar {
  [data-tooltip='Main menu'] {
    display: none;
  }

  [data-type='list'] {
    display: none;
  }

  .calendar-setting {
    display: flex !important;
  }
}
</style>

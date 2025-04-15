<template>
  <OrganizationHubCourseEditWrap
    v-loading="hubCourse.chaptersLoading"
    element-loading-background="rgba(0, 0, 0, 0)"
    :step="4"
    title="Content"
  >
    <BaseDatePicker
      v-if="isCalendar && active"
      v-model="rangeValue"
      class="-mx-2 !mb-4 !p-0"
      mode="daterange"
      data-cy="org-open-live-course-datepicker"
    />
    <OrganizationHubCourseEditContentChapter />
    <div v-if="isCalendar && active" class="-ml-2.5 mt-4 flex flex-col gap-4">
      <OrganizationHubCalendarSidebarCalendars />
      <OrganizationHubCalendarSidebarCourses />
      <OrganizationHubCalendarSidebarOrganizations v-if="authStore.isUser" />
      <OrganizationHubCalendarSidebarUsers />
    </div>
    <div
      v-if="
        hubCourse.deleteCheck.length &&
        hubCourse.chapterOpen &&
        !hubCourse.isPreview
      "
      class="absolute bottom-12 left-0 !z-50 w-full p-4"
    >
      <OrganizationHubCourseEditContentActionToolbar />
    </div>
  </OrganizationHubCourseEditWrap>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubCalendarStore = useHubCalendarStore();
    const authStore = useAuthStore();
    return { hubCourse, hubCalendarStore, authStore };
  },
  data() {
    return {
      rangeValue: {
        start: null,
        end: null,
      },
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    active() {
      return this.hubCourse.step === 4;
    },
    isCalendar() {
      return this.hubCourse.calendarView;
    },
    calendarList() {
      return this.hubCalendarStore.calendarList;
    },
    selectedCalendars() {
      return this.hubCalendarStore.selectedCalendars || [];
    },
  },
  watch: {
    isCalendar() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (this.isCalendar) {
        await this.hubCalendarStore.handleSelectCalendar();
        this.selectedCalendar();
      }
    },
    selectedCalendar() {
      if (
        !this.selectedCalendars.find((r) => r.id === this.course.calendarId)
      ) {
        this.hubCalendarStore.selectedCalendars.push({
          ...this.course,
          id: this.course.calendarId,
        });
        this.hubCalendarStore.selectedCalendar(
          {
            calendarIds: [this.course.calendarId],
          },
          [this.course.color],
        );
      }
    },
  },
};
</script>

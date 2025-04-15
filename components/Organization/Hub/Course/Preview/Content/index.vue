<template>
  <div
    v-loading="hubCourse.chaptersLoading"
    element-loading-background="rgba(0, 0, 0, 0)"
    class="flex h-0 flex-1 gap-8 p-4"
  >
    <OrganizationHubCoursePreviewContentCalendar v-if="isCalendar" />
    <OrganizationHubCoursePreviewContentChapters v-else />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    isCalendar() {
      return this.hubCourse.calendarView;
    },
  },
};
</script>

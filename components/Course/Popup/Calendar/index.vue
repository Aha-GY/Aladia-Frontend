<template>
  <div class="relative flex h-full w-full gap-1.5 pt-2">
    <OrganizationHubCalendarSidebar :course="course" />
    <OrganizationHubCalendar :course="course" />
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    course() {
      const course = cloneDeep(this.courseStore.course);
      if (course.purchased) {
        course.cycles = course.cycles.filter((cycle) =>
          (course.purchasedCycles || []).includes(cycle.id),
        );
      }
      return course.purchased ? course : null;
    },
  },
};
</script>

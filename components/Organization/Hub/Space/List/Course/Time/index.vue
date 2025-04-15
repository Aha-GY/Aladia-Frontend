<template>
  <div class="flex h-8 items-center">
    <div class="flex items-center gap-2">
      <i class="fa-light fa-timer" />
      {{ secondsToHours(course.chaptersDuration || 0) }} h
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    return { hubSpaces, hubCourse };
  },
};
</script>

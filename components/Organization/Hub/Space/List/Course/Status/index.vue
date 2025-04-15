<template>
  <div class="flex items-center gap-2">
    <BaseCourseStatus
      v-if="course.version?.status"
      :status="course.version?.status"
    />
    <div v-else>----</div>
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

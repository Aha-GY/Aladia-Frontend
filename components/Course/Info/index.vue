<template>
  <div
    class="pointer-events-auto absolute left-0 right-0 z-20 px-6 transition-all duration-300"
    :class="control ? 'bottom-20 opacity-100' : 'bottom-6'"
  >
    <CourseInfoCourse />
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    control() {
      return this.courseStore.player.control;
    },
  },
};
</script>

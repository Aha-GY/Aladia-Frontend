<template>
  <div
    class="pointer-events-none absolute right-5 top-5 z-30 flex h-full items-start gap-0 transition-all duration-500"
    :class="chapters.length ? 'opacity-100' : 'opacity-0'"
  >
    <CourseChapterList v-if="!$device.isMobile" />
    <CourseChapterMenu />
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
      return this.courseStore.course;
    },
    chapters() {
      return this.course.chapters;
    },
  },
};
</script>

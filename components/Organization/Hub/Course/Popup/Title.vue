<template>
  <div class="flex-1 pr-2">
    <OrganizationHubCourseEditItem
      :value="lecture.title"
      :focus="nameFocus"
      :title="$t('base.courses.lesson.title')"
      class="!mb-0"
    >
      <input
        v-model="lecture.title"
        :class="nameFocus ? '' : 'truncate'"
        class="relative z-0 h-full w-0 flex-1 bg-transparent outline-none"
        maxlength="200"
        @focus="nameFocus = true"
        @blur="nameFocus = false"
      />
    </OrganizationHubCourseEditItem>
  </div>
</template>

<script>
export default {
  props: {
    lecture: Object,
    course: Object,
    chapter: Object,
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      nameFocus: false,
    };
  },
  watch: {
    nameFocus(value) {
      if (!value && this.lecture.title) {
        this.hubCourse.updateLecture({
          chapterId: this.chapter.id,
          lectureId: this.lecture.id,
          title: this.lecture.title,
        });
      }
    },
  },
};
</script>

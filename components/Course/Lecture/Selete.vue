<template>
  <BaseCheckboxStyle
    class="absolute bottom-0 right-0"
    :state="active ? 'correctChecked' : 'unchecked'"
    data-cy="83c6f30bca9d5f59"
    @mousedown.stop
    @mouseup.stop
    @click="onClick"
  />
</template>

<script>
export default {
  props: {
    lectureIndex: Number,
    chapterIndex: Number,
    lecture: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const socialStore = useSocialStore();
    const courseStore = useCourseStore();
    return { courseStore, socialStore };
  },
  computed: {
    active() {
      return (
        this.socialStore.selectedLecture.lectureIndex === this.lectureIndex &&
        this.socialStore.selectedLecture.chapterIndex === this.chapterIndex
      );
    },
  },
  methods: {
    onClick() {
      this.socialStore.selectedLecture.chapterIndex = this.chapterIndex;
      this.socialStore.selectedLecture.lectureIndex = this.lectureIndex;
      this.socialStore.selectedLecture.thumbnail =
        this.lecture.thumbnail.url || this.courseStore.course.thumbnail.url;
      this.socialStore.selectedLecture.id = this.lecture.id;
      this.socialStore.selectedLecture.realteToCourse = false;
    },
  },
};
</script>

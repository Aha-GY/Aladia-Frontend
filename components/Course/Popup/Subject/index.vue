<template>
  <div class="py-4">
    <div v-for="subject in subjects" :key="subject.id">
      <CoursePopupSubjectCollapse
        :name="subject.title"
        icon="fa-regular fa-chalkboard-user"
        :title="subject.title"
        :chapters-count="subject.chaptersCount"
        :lectures-count="subject.lecturesCount"
        :duration="subject.duration"
      >
        <CoursePopupSubjectChapter :chapters="subject.chapters" />
      </CoursePopupSubjectCollapse>
    </div>
  </div>
</template>

<script setup>
const courseStore = useCourseStore();

const subjects = computed(() => courseStore.subjects);
</script>

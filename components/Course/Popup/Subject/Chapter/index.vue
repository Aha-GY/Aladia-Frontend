<template>
  <div v-for="(chapter, chapterIndex) in chapters" :key="chapter.id">
    <CoursePopupSubjectChapterCollapse
      :name="chapter.name"
      icon="fa-regular fa-chalkboard-user"
      :title="chapter.name"
      :lectures-count="chapter.lecturesCount"
      :duration="chapter.duration"
    >
      <div class="flex flex-col gap-2">
        <CoursePopupSubjectLecture
          v-for="(lecture, lectureIndex) in chapter.lectures"
          :key="lectureIndex"
          :lecture="lecture"
          :chapter="chapter"
          :lecture-index="lectureIndex"
          :chapter-index="chapterIndex"
        />
      </div>
    </CoursePopupSubjectChapterCollapse>
  </div>
</template>

<script>
export default {
  props: {
    chapters: Object,
  },
};
</script>

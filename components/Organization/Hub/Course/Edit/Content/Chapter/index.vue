<template>
  <OrganizationHubCourseEditContentChapterHeader />
  <div
    class="overflow-hidden transition-all duration-300"
    :class="chapterOpen || subjectOpen ? 'max-h-min pb-16' : 'max-h-0 pb-0'"
  >
    <template v-if="chapterOpen">
      <OrganizationHubCourseEditContentChapterItem
        v-for="(chapter, chapterIndex) in chapters"
        :key="chapterIndex"
        :chapter="chapter"
        :chapter-index="chapterIndex"
      />
    </template>
    <template v-if="subjectOpen">
      <div class="absolute left-0 right-0 !z-40 h-[calc(80vh-5rem)]">
        <OrganizationHubCourseEditContentSubject>
          <div class="h-full w-full">
            <OrganizationHubCourseEditContentSubjectTeacherPopup />
          </div>
        </OrganizationHubCourseEditContentSubject>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    chapters() {
      return this.course.chapters;
    },
    chapterOpen() {
      return this.hubCourse.chapterOpen;
    },
    subjectOpen() {
      return this.hubCourse.subjectOpen;
    },
  },
};
</script>

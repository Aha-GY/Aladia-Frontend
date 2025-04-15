<template>
  <div v-loading="hubCourse.chaptersLoading" class="w-0 flex-1">
    <div class="mb-4 flex items-center justify-between gap-4 pr-3">
      <div class="text-base text-white">
        {{ $t('base.courses.chapters') }}
      </div>
      <div v-if="hubCourse.contentEditable" class="flex items-center gap-3">
        <div
          class="flex cursor-pointer items-center justify-center gap-1 rounded text-white hover:text-white/50"
          @click="onSubjectOpen"
        >
          <i class="fa-regular fa-chalkboard-user" />
          <span class="text-xs">Subjects</span>
        </div>
        <div
          class="flex cursor-pointer items-center justify-center gap-1 rounded text-white hover:text-white/50"
          @click="onAddClick"
        >
          <i v-if="loading" class="fa-solid fa-spinner animate-spin text-sm" />
          <i v-else class="fa-regular fa-circle-plus" />
          <span class="text-xs">New Chapter</span>
        </div>
        <div
          v-if="hubCourse.deleteCheck.length"
          class="flex cursor-pointer items-center gap-1.5 rounded bg-[#a20f0f0d] px-2 py-1 text-xs text-[#a84a46] hover:text-[#64241d]"
          data-cy="cd358be04615bd2c"
          @click="hubCourse.remove"
        >
          <i
            v-if="hubCourse.deleting"
            class="fa-solid fa-spinner animate-spin text-sm"
          />
        </div>
        <OrganizationHubCourseEditContentCheckbox :item="course" />
      </div>
    </div>
    <div
      class="hide-scrollbar relative overflow-y-auto overscroll-contain pb-36"
      style="height: calc(100vh - 9rem)"
    >
      <OrganizationHubCoursePreviewContentChaptersItem
        v-for="(chapter, chapterIndex) in course.chapters"
        :key="chapterIndex"
        :chapter-index="chapterIndex"
        :chapter="chapter"
      />
      <OrganizationHubCoursePreviewContentChaptersAdd
        v-if="hubCourse.contentEditable"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSubject = useHubSubjectStore();
    return { hubCourse, hubSubject };
  },
  data() {
    return {
      active: false,
      loading: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    dates() {
      return this.course.cycles[0]?.dates || {};
    },
  },
  methods: {
    async onAddClick() {
      this.hubCourse.chapterOpen = true;
      this.hubCourse.subjectOpen = false;

      if (!this.hubCourse.isPreview) {
        this.hubCourse.isPreview = true;
        await sleep(300);
      }

      if (this.loading) {
        return;
      }

      try {
        this.loading = true;
        const { chapter, lecture } = await this.hubCourse.appendChapter();
        if (chapter && lecture) {
          this.hubCourse.popupOpen = true;
          this.hubCourse.chapterPopup = chapter;
          this.hubCourse.lecturePopup = lecture;
          this.hubCourse.popupFrom = 'edit';
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    onSubjectOpen() {
      this.hubCourse.popupOpen = true;
      this.hubSubject.subjectPopup = true;
      this.hubSubject.isTeacherPoup = false;
      this.hubCourse.popupFrom = 'edit';
    },
  },
};
</script>

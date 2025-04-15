<template>
  <div
    class="group/chapter relative mb-2 flex h-9 items-center justify-between py-1 pl-1 pr-1"
    data-cy="chapter-list-group"
  >
    <div
      class="subject-toggler flex flex-1 cursor-pointer items-center gap-2"
      data-cy="974b6f4af782d7d6"
      @click="onChapterToggle"
    >
      <div
        class="flex h-5 w-5 items-center justify-center rounded text-sm hover:bg-white/5"
      >
        <i
          class="fa-light fa-chevron-right text-white/50 transition-all duration-300 hover:text-white/50"
          :class="
            hubCourse.chapterOpen
              ? 'rotate-90'
              : '!hidden group-hover/chapter:!flex'
          "
        />
        <i
          v-if="!hubCourse.chapterOpen"
          class="fa-light fa-bookmark mt-0.5 text-white/50 group-hover/chapter:hidden"
        />
      </div>
      <div
        class="text-base font-light"
        :class="hubCourse.chapterOpen ? 'text-white' : 'text-white/50'"
      >
        {{ $t('course.chapter.label') }}
      </div>
    </div>
    <div
      v-if="hubCourse.contentEditable"
      class="flex shrink-0 items-center gap-2 pr-1"
      data-cy="subject-edit-content"
    >
      <div
        class="subject-toggler flex h-7 w-7 cursor-pointer items-center justify-center rounded text-xs text-[#D9D9D9] hover:bg-white/10 hover:text-white/50"
        data-cy="subject-toggler-edit-content"
        @click="onSubjectOpen"
      >
        <i class="fa-regular fa-chalkboard-user" />
      </div>
      <div
        class="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-xs text-[#D9D9D9] hover:bg-white/10 hover:text-white/50"
        data-cy="add-chapter-plus-icon"
        @click="onAdd"
      >
        <i v-if="loading" class="fa-solid fa-spinner animate-spin text-sm" />
        <i v-else class="fa-light fa-add" />
      </div>
      <OrganizationHubCourseEditContentCheckbox :item="course" />
    </div>
    <div
      class="absolute bottom-0 left-0 right-0 flex h-[1px] justify-center bg-white/10 transition-all duration-300 group-hover/chapter:bg-white/30"
    >
      <div
        class="h-full bg-[#a2842a] transition-all duration-300"
        :class="{
          'w-full': hubCourse.chapterOpen,
          'w-0': !hubCourse.chapterOpen,
        }"
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
      loading: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
  },
  methods: {
    async onAdd() {
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
    onCancelRemove() {
      this.hubCourse.clearSelected();
    },
    onChapterToggle() {
      if (this.hubCourse.subjectOpen) {
        this.hubCourse.chapterOpen = true;
      } else {
        this.hubCourse.chapterOpen = !this.hubCourse.chapterOpen;
      }
      this.hubCourse.subjectOpen = false;
    },

    onSubjectOpen() {
      this.hubCourse.subjectOpen = !this.hubCourse.subjectOpen;
      if (this.hubCourse.subjectOpen) {
        this.hubCourse.chapterOpen = false;
      } else {
        this.hubCourse.chapterOpen = true;
      }
      this.hubSubject.isTeacherPoup = false;
    },
  },
};
</script>

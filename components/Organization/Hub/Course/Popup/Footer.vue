<template>
  <div
    class="flex h-12 items-center justify-between rounded-b bg-[#0c0c0c] px-3"
  >
    <div
      class="flex cursor-pointer items-center gap-2 rounded bg-[#190e0d] px-2 py-1 text-sm font-light transition-all duration-300 active:scale-95"
      data-cy="b597c174c595c91a"
      @click="onDelete"
    >
      <i v-if="deleting" class="fa-light fa-loader animate-spin text-base" />
      <i v-else class="fa-light fa-trash-can" />
      {{ $t('base.editor.delete') }}
    </div>
    <div
      class="flex items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
      :class="lectureSaveDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
      data-cy="save-chapter-icon-popup"
      @click="onSave"
    >
      <i v-if="saving" class="fa-light fa-loader animate-spin text-base" />
      <i v-else class="fa-light fa-save text-base" />
      {{ $t('base.upload.save') }}
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubCalendarStore = useHubCalendarStore();
    return { hubCourse, hubCalendarStore };
  },
  data() {
    return {
      saving: false,
      deleting: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    chapter() {
      return this.hubCourse.chapterPopup;
    },
    lecture() {
      return this.hubCourse.lecturePopup;
    },
    lectureSaveDisabled() {
      return (
        this.hubCourse.lectureVideoUploading ||
        this.hubCourse.lectureThumbnailUploading
      );
    },
  },
  methods: {
    async onDelete() {
      try {
        if (this.deleting) {
          return;
        }
        this.deleting = true;

        await this.hubCourse.delete({
          chapter: this.chapter,
          lecture: this.lecture,
        });

        this.deleting = false;
        this.hubCourse.popupOpen = false;
        this.hubCourse.chapterPopup = null;
        this.hubCourse.lecturePopup = null;
        this.hubCalendarStore.createOpen = false;
      } catch (error) {
        this.deleting = false;
        this.$toast.error(error.message);
      }
    },
    async onSave() {
      try {
        if (this.saving) {
          return;
        }
        if (this.lectureSaveDisabled) {
          return;
        }

        this.saving = true;

        await this.hubCourse.save({
          chapter: this.chapter,
          lecture: this.lecture,
        });

        await this.hubCourse.refreshChapter({
          chapterId: this.chapter.id,
        });

        this.hubCourse.getCourse();

        this.saving = false;
        this.hubCourse.popupOpen = false;
        this.hubCourse.chapterPopup = null;
        this.hubCourse.lecturePopup = null;
        this.hubCalendarStore.createOpen = false;
      } catch (error) {
        this.saving = false;
        this.$toast.error(error.message);
        throw error;
      }
    },
  },
};
</script>

<template>
  <div class="group/add flex cursor-pointer items-center gap-2 pl-8 pr-10">
    <div class="h-[1px] flex-1 bg-white/0 group-hover/add:bg-white/20" />
    <div
      class="flex w-6 items-center justify-center transition-all duration-300 group-hover/add:w-12 group-hover/add:scale-110"
    >
      <i v-if="loading" class="fa-light fa-loader animate-spin text-base" />
      <i
        v-else
        class="fa-light fa-add text-white/20 transition-all duration-300 group-hover/add:text-white/50"
        :data-cy="`add-lecture-button-${chapter.id}`"
        @click="onLectureAdd"
      />
    </div>
    <div class="h-[1px] flex-1 bg-white/0 group-hover/add:bg-white/20" />
  </div>
</template>

<script>
export default {
  props: {
    chapter: Object,
    chapterIndex: Number,
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
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
    async onLectureAdd() {
      if (!this.hubCourse.isPreview) {
        this.hubCourse.isPreview = true;
        await sleep(300);
      }

      try {
        this.loading = true;

        const type = this.chapterIndex === 0 ? 'on-demand' : this.course.type;
        const eventDates = this.hubCourse.getEventDefaultDates(this.chapter);
        const lecture = await this.hubCourse.updateLecture({
          type,
          chapterId: this.chapter.id,
          event:
            type === 'live' && eventDates
              ? {
                  dates: eventDates,
                }
              : undefined,
        });

        await this.hubCourse.refreshChapter({
          chapterId: this.chapter.id,
        });

        this.hubCourse.getCourse();

        this.hubCourse.popupOpen = true;
        const newLecture = this.hubCourse.findLecture(lecture.id);
        this.hubCourse.chapterPopup = this.chapter;
        this.hubCourse.lecturePopup = newLecture;
        this.hubCourse.popupFrom = 'edit';

        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
};
</script>

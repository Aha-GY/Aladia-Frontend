<template>
  <div class="group/add mt-4 flex items-center justify-center gap-6">
    <div
      class="flex h-4 cursor-pointer items-center justify-center"
      data-cy="d9c7faaa88b61159"
      @click="onAddClick"
    >
      <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
      <i
        v-else
        class="fa-light fa-plus transition-all duration-300 group-hover/add:rotate-90"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chapter: {
      type: Object,
      required: true,
    },
    lectureIndex: {
      type: Number,
      required: true,
    },
    chapterIndex: {
      type: Number,
      required: true,
    },
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
    async onAddClick() {
      if (this.loading) {
        return;
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

        if (lecture.type === 'on-demand') {
          await this.hubCourse.reorderLecture({
            chapterId: this.chapter.id,
            lectureId: lecture.id,
            position: this.lectureIndex + 1,
          });
        }

        await this.hubCourse.refreshChapter({
          chapterId: this.chapter.id,
        });

        this.hubCourse.getCourse();

        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
};
</script>

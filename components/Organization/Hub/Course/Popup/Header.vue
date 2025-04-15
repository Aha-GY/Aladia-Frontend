<template>
  <div v-if="course" class="mb-3 h-12 rounded-t bg-white/5 px-3 pt-1">
    <div class="w-4/5 truncate text-base">{{ course.title }}</div>
    <div v-if="showCourseDate" class="text-xs font-light text-white/50">
      {{
        $t('org.streaming.range', {
          start: formatDate(courseDates.startDate, 'DD MMM YYYY'),
          end: formatDate(courseDates.endDate, 'DD MMM YYYY'),
        })
      }}
    </div>
  </div>
  <div v-if="chapter" class="mb-3 bg-white/5 p-3">
    <div class="mb-2 flex items-center gap-4">
      <div>
        <i class="fa-light fa-bookmark text-base text-white/20" />
      </div>
      <div class="flex-1">
        <BaseInput
          v-model="chapter.name"
          :title="$t('course.chapter.title')"
          @blur="onChapterNameBlur"
        />
      </div>
    </div>
    <div v-if="showChapterDuration" class="flex items-center gap-4">
      <div>
        <i class="fa-light fa-calendar text-base text-white/20" />
      </div>
      <div class="popup-chapter-duration flex-1">
        <OrganizationHubCourseEditContentChapterDuration
          :chapter="chapter"
          :course="course"
          :width="460"
          :is-update="true"
          :chapter-index="chapterIndex"
          class="!gap-0 !pl-0"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubEvent = useHubEventStore();
    const hubCourse = useHubCoursesStore();
    return { hubEvent, hubCourse };
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
    event() {
      return this.hubEvent.event;
    },
    courseDates() {
      return this.course.cycles[0]?.dates || {};
    },
    chapterIndex() {
      return this.course.chapters.findIndex(
        (chapter) => chapter.id === this.chapter.id,
      );
    },
    showCourseDate() {
      return (
        this.courseDates.startDate &&
        this.courseDates.endDate &&
        this.course.type === 'live'
      );
    },
    showChapterDuration() {
      return this.course.type === 'live' && this.chapterIndex !== 0;
    },
  },
  watch: {
    'chapter.cycles[0].dates': {
      handler(dates) {
        // 默认第一个live lecture的时间为章节的开始时间
        if (
          dates?.startDate &&
          this.chapter.lectures.length === 1 &&
          this.lecture.type === 'live'
        ) {
          const { startDate, endDate } = getCreateDateRange(
            dates.startDate || new Date(),
          );
          this.event.dates.startDate = startDate;
          this.event.dates.endDate = endDate;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onChapterNameBlur() {
      if (this.chapter.name) {
        this.hubCourse.updateChapter({
          chapterId: this.chapter.id,
          name: this.chapter.name,
        });
      }
    },
  },
};
</script>

<style>
.popup-chapter-duration .fa-calendar {
  display: none;
}
</style>

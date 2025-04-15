<template>
  <div
    :id="`chapter-${chapterIndex}`"
    :data-chapter-id="chapter.id"
    class="pointer-events-auto relative mb-4 w-[25rem] rounded border border-white/10 bg-black/80 backdrop-blur-md transition-all last:mb-0"
    :style="{ maxHeight: open ? `calc(100vh - 23.3rem)` : null }"
  >
    <CourseChapterHeader
      :open="open"
      :chapter="chapter"
      :chapter-index="chapterIndex"
    />
    <div class="transition-all duration-200" :class="open ? 'py-2' : 'py-0'">
      <div
        class="hide-scrollbar relative z-20 pr-1 transition-all duration-200"
        :class="open ? 'overflow-y-auto' : 'overflow-hidden'"
        :style="{ maxHeight: open ? `calc(100vh - 28rem)` : '0rem' }"
      >
        <div v-if="open" class="py-2">
          <CourseChapterSkeleton v-if="chapter.loading" />
          <div v-else class="flex flex-col">
            <template
              v-for="(lecture, lectureIndex) in chapter.lectures"
              :key="lectureIndex"
            >
              <CourseLectureExpand
                v-if="lecture.component === 'CourseLectureExpand'"
                :group-data="lecture"
                :chapter="chapter"
                :lecture-index="lecture.lectureIndex"
                :chapter-index="chapterIndex"
                :is-select-model="isSelectModel"
              />
              <CourseLecture
                v-else
                :lecture="lecture"
                :chapter="chapter"
                :lecture-index="lecture.lectureIndex"
                :display-lecture-index="lectureIndex"
                :chapter-index="chapterIndex"
                :is-select-model="isSelectModel"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chapter: Object,
    chapterIndex: Number,
    isSelectModel: Boolean,
  },
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    open() {
      return this.courseStore.chapter.index === this.chapterIndex;
    },
    course() {
      return this.courseStore.course;
    },
  },
  watch: {
    open: {
      immediate: true,
      handler(value) {
        if (value && !this.chapter.loaded && !this.chapter.loading) {
          this.getLectures();
        }
      },
    },
  },
  methods: {
    async getLectures() {
      await this.courseStore.getLectures({
        courseId: this.course.id,
        chapterId: this.chapter.id,
      });
    },
  },
};
</script>

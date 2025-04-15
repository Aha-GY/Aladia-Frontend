<template>
  <div>
    <div
      class="group/chapter mb-2 rounded p-3 font-light transition-all"
      :class="open ? 'bg-white/5' : 'hover:bg-white/5'"
    >
      <div
        class="flex cursor-pointer items-center gap-3"
        :class="{ 'pb-2': open }"
        @click="open = !open"
      >
        <div
          class="flex size-5 shrink-0 items-center justify-center rounded hover:bg-white/10 group-hover/chapter:bg-white/10"
        >
          <div :class="open ? '' : 'hidden group-hover:flex'">
            <i
              class="fa-solid fa-angle-right transition-all"
              :class="{ 'rotate-90': open }"
            />
          </div>
          <div :class="open ? 'hidden' : 'group-hover:hidden'">
            <i class="fa-solid fa-angle-right transition-all" />
          </div>
        </div>
        {{ `Chapter ${chapterIndex + 1}` }}: {{ chapter.name }}
      </div>
      <div
        class="hide-scrollbar overflow-hidden overflow-y-scroll pl-8 transition-all duration-300"
        :class="{ 'max-h-[36rem] py-4': open, 'max-h-0 py-0': !open }"
      >
        <!-- <div
          v-if="chapter.description"
          class="mb-4 pl-8 [&>ul]:ml-6 [&>ul]:list-disc"
          v-html="chapter.description"
        /> -->

        <CoursePopupDescriptionSkeleton v-if="chapter.loading" />

        <div
          v-for="(lecture, lectureIndex) in chapter.lectures"
          v-else
          :key="lectureIndex"
        >
          <CoursePopupDescriptionLecture :lecture="lecture" />
        </div>
        <div
          class="mt-4 flex h-6 w-24 cursor-pointer items-center justify-center text-xs hover:bg-white/5"
          @click="open = false"
        >
          {{ $t('course.material.read.less') }}
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
  },
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
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

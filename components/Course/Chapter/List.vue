<template>
  <div
    ref="chapterRef"
    class="hide-scrollbar pointer-events-none flex h-full max-h-[calc(100vh-15rem)] flex-col transition-all duration-300"
    :class="
      chapter.state
        ? 'mr-4 w-[25rem] overflow-y-auto opacity-100'
        : 'mr-0 w-0 overflow-x-hidden opacity-0'
    "
  >
    <CourseChapterItem
      v-for="(item, index) in chapters"
      :key="index"
      :chapter="item"
      :chapter-index="index"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    const chapterRef = ref(null);
    onClickOutside(
      chapterRef,
      () => {
        courseStore.chapter.state = false;
      },
      {
        ignore: ['.el-popper', '.menu-ref'],
      },
    );
    return { courseStore, chapterRef };
  },
  computed: {
    chapter() {
      return this.courseStore.chapter;
    },
    course() {
      return this.courseStore.course;
    },
    chapters() {
      return this.course.chapters;
    },
  },
  watch: {
    async 'chapter.index'(chapterIndex) {
      await sleep(500);

      if (chapterIndex === null) {
        return;
      }

      if (chapterIndex === 0) {
        return this.$refs.chapterRef.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }

      if (chapterIndex === this.chapters.length - 1) {
        const $prev = this.$refs.chapterRef.children[chapterIndex - 2];
        return this.$refs.chapterRef.scrollTo({
          top: $prev?.offsetTop || 0,
          behavior: 'smooth',
        });
      }

      const $prev = this.$refs.chapterRef.children[chapterIndex - 1];
      this.$refs.chapterRef.scrollTo({
        top: $prev?.offsetTop || 0,
        behavior: 'smooth',
      });
    },
  },
};
</script>

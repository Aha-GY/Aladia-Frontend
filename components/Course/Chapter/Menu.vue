<template>
  <div class="pointer-events-auto flex flex-col justify-between gap-2">
    <div
      v-if="!$device.isMobile"
      class="menu-ref group relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded border border-white/10 bg-black/80 shadow-md backdrop-blur transition-all hover:border-white/50 active:scale-90"
      data-cy="755d16adde95343e"
      @click="onMenuClick"
    >
      <i class="fa-solid fa-films transition-all group-hover:scale-125" />
    </div>
    <div
      v-if="!$device.isMobile"
      class="flex h-0 w-10 flex-1 flex-col items-center justify-between gap-2 rounded border border-white/10 bg-black/80 py-2 text-sm shadow-md backdrop-blur"
    >
      <div class="mb-0">Ch</div>
      <div
        class="group relative flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center transition-all active:scale-90"
        data-cy="2ecd6460fcccd45e"
        @click="onUpClick"
      >
        <div
          class="absolute h-0 w-0 rounded bg-white/20 transition-all group-hover:h-full group-hover:w-full"
        />
        <i class="fa-solid fa-chevron-up" />
      </div>
      <div
        v-if="chapters.length"
        class="hide-scrollbar flex max-h-[calc(100vh-40rem)] w-full flex-col items-center gap-1 overflow-y-auto scroll-smooth"
      >
        <div
          v-for="n in chapters.length"
          :key="n"
          ref="chapter"
          class="group relative flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center transition-all active:scale-90"
          data-cy="09871ee8e0c44bb3"
          @click="onChapterClick(n - 1)"
        >
          <div
            class="absolute rounded bg-white/20 transition-all group-hover:h-full group-hover:w-full"
            :class="chapter.index === n - 1 ? 'h-full w-full' : 'h-0 w-0'"
          />
          <div class="relative">{{ n }}</div>
        </div>
      </div>
      <div
        class="group relative flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center transition-all active:scale-90"
        data-cy="9129aa31033e978d"
        @click="onDownClick"
      >
        <div
          class="absolute h-0 w-0 rounded bg-white/20 transition-all group-hover:h-full group-hover:w-full"
        />
        <i class="fa-solid fa-chevron-down" />
      </div>
    </div>
    <el-tooltip
      v-for="item in types"
      :key="item.name"
      effect="light"
      :content="$t(item.title)"
      placement="left"
    >
      <div
        class="group relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded border border-white/10 bg-black/80 shadow-md backdrop-blur transition-all hover:border-white/50 active:scale-90"
        data-cy="baf3303e2494cf3c"
        @click="onTypeClick(item.name)"
      >
        <i class="transition-all group-hover:scale-125" :class="item.icon" />
        <i
          v-if="!buyed"
          class="fa-solid fa-lock absolute -bottom-1 -left-1 scale-90 text-xs"
        />
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    popup() {
      return this.courseStore.popup;
    },
    chapter() {
      return this.courseStore.chapter;
    },
    course() {
      return this.courseStore.course;
    },
    chapters() {
      return this.course.chapters;
    },
    buyed() {
      return this.courseStore.buyed;
    },
    hasLive() {
      return this.course.type === 'live';
    },
    types() {
      const subjectsType =
        this.courseStore.subjects?.length > 0
          ? [
              {
                name: 'subjects',
                title: 'course.header.subjects',
                icon: 'fa-regular fa-chalkboard-user',
              },
            ]
          : [];

      return this.hasLive
        ? [
            {
              name: 'chat',
              title: 'course.header.chat',
              icon: 'fa-light fa-message-lines',
            },
            {
              name: 'calendar',
              title: 'course.header.calender',
              icon: 'fa-light fa-calendar-lines',
            },
            {
              name: 'review',
              title: 'course.header.review',
              icon: 'fa-solid fa-star',
            },
            {
              name: 'description',
              title: 'course.header.description',
              icon: 'fa-light fa-list',
            },
            ...subjectsType,
          ]
        : [
            {
              name: 'question',
              title: 'course.header.qa',
              icon: 'fa-light fa-comments-question',
            },
            {
              name: 'review',
              title: 'course.header.review',
              icon: 'fa-solid fa-star',
            },
            {
              name: 'description',
              title: 'course.header.description',
              icon: 'fa-light fa-list',
            },
            ...subjectsType,
          ];
    },
  },
  watch: {
    async 'chapter.index'(index) {
      await sleep(300);
      const chapter = this.$refs.chapter[index];
      chapter.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    },
  },
  methods: {
    onTypeClick(type) {
      this.chapter.state = false;
      this.popup.state = true;
      this.popup.type = type;
    },
    onMenuClick() {
      this.chapter.state = !this.chapter.state;
    },
    onChapterClick(chapterIndex) {
      this.chapter.state = true;
      this.chapter.index = chapterIndex;
    },
    onUpClick() {
      this.chapter.state = true;
      if (this.chapter.index === null) {
        this.chapter.index = 0;
      } else {
        const next = this.chapter.index - 1;
        if (next < 0) {
          this.chapter.index = 0;
        } else {
          this.chapter.index = next;
        }
      }
    },
    onDownClick() {
      this.chapter.state = true;
      if (this.chapter.index === null) {
        this.chapter.index = 0;
      } else {
        const next = this.chapter.index + 1;
        if (next > this.chapters.length - 1) {
          this.chapter.index = this.chapters.length - 1;
        } else {
          this.chapter.index = next;
        }
      }
    },
  },
};
</script>

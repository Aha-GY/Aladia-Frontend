<template>
  <div
    class="group/item relative z-10 flex min-h-12 cursor-pointer items-center justify-between gap-1 rounded-b rounded-t bg-black/50 p-2 text-sm"
    :class="open ? 'border-b border-[#565656]/50' : ''"
    data-cy="9a875e5ee5aac079"
    @click="onTitleClick"
  >
    <div class="flex flex-1 items-center gap-2">
      <div class="flex h-6 w-6 items-center justify-center">
        <div
          class="h-full w-full items-center justify-center"
          :class="open ? 'hidden' : 'flex group-hover/item:hidden'"
        >
          <div
            v-if="disabled"
            ref="lock-icon"
            class="flex h-6 w-6 items-center justify-center"
          >
            <i class="fa-solid fa-lock text-xs" />
          </div>
          <div
            v-else
            class="flex h-6 w-6 items-center justify-center text-xs font-bold text-[#FFEC29]"
          >
            {{ chapterIndex + 1 }}
          </div>
        </div>
        <div
          class="flex h-6 w-6 items-center justify-center text-xl"
          :class="open ? 'flex' : 'hidden group-hover/item:flex'"
        >
          <i
            class="fa-solid fa-chevron-right text-sm transition-all"
            :class="open ? 'rotate-90' : 'rotate-0'"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <div
          class="overflow-hidden text-ellipsis whitespace-nowrap"
          :class="[completion ? 'max-w-48' : 'max-w-60']"
        >
          {{ chapter.name }}
        </div>
        <div v-if="showDate" class="text-xs text-[#989898]">
          {{ formatDate(chapter.cycles[0].dates.startDate, 'DD MMM YYYY') }}
          -
          {{ formatDate(chapter.cycles[0].dates.endDate, 'DD MMM YYYY') }}
        </div>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <div v-if="!hasLive" class="flex items-center gap-2 text-xs">
        <i class="fa-solid fa-play" />
        <div class="text-white/50">
          {{ chapter.numberOfLectures }}
        </div>
      </div>
      <div v-if="hasLive" class="flex items-center gap-2 text-xs">
        <i class="fa-solid fa-calendar" />
        <div class="text-white/50">
          {{ chapter.numberOfLectures }}
        </div>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <i class="fa-solid fa-clock" />
        <div class="text-white/50">
          {{ secondToTime(chapter.lecturesDuration) }}
        </div>
      </div>
      <div v-if="completion" class="relative scale-90">
        <BaseProgress
          :diameter="32"
          :stroke-width="2"
          :inner-stroke-width="2"
          :animate-speed="100"
          :completed-steps="completion"
          :total-steps="100"
          start-color="#985de6"
          stop-color="#985de6"
          inner-stroke-color="#ffffff10"
        />
        <div
          class="absolute bottom-0 left-0 right-0 top-0 flex scale-75 items-center justify-center text-xs text-[#985de6]"
        >
          {{ completion }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    open: Boolean,
    chapter: Object,
    chapterIndex: Number,
  },
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    disabled() {
      return this.chapterIndex > 0 && !this.courseStore.buyed;
    },
    course() {
      return this.courseStore.course;
    },
    hasLive() {
      return this.chapterIndex > 0 && this.course.type === 'live';
    },
    completion() {
      return this.courseStore.getChapterCompletion(this.chapter);
    },
    showDate() {
      return (
        this.chapter.name !== 'Introduction' &&
        this.chapter.cycles[0] &&
        this.chapter.cycles[0].dates &&
        this.chapter.cycles[0].dates.startDate &&
        this.chapter.cycles[0].dates.endDate
      );
    },
  },
  watch: {
    async open(state) {
      if (state && this.disabled) {
        this.$refs['lock-icon']?.classList.add('animate__animated');
        this.$refs['lock-icon']?.classList.add('animate__tada');
        await sleep(2000);
        this.$refs['lock-icon']?.classList.remove('animate__animated');
        this.$refs['lock-icon']?.classList.remove('animate__tada');
      }
    },
  },
  methods: {
    onTitleClick() {
      if (this.open) {
        this.courseStore.chapter.index = null;
      } else {
        this.courseStore.chapter.index = this.chapterIndex;
      }
    },
  },
};
</script>

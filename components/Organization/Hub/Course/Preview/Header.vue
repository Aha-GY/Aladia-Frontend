<template>
  <div
    class="flex h-12 shrink-0 items-center gap-3 bg-white/5 pl-4 pr-2 text-sm"
  >
    <div class="flex flex-1 items-center gap-4 md:gap-8">
      <OrganizationHubCourseEditInfoCyclesSelect />
      <div class="flex items-center gap-2">
        <i class="fa-light fa-bookmark" />
        {{ chapters }}
        <span class="hidden md:flex">{{ $t('course.chapter.lower') }}</span>
      </div>
      <div class="flex items-center gap-2">
        <i class="fa-light fa-play" />
        {{ lectures }}
        <span class="hidden md:flex">
          {{ $t('base.courses.lecture.lower') }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <i class="fa-light fa-clock" />
        {{ duration }}
      </div>
    </div>
    <OrganizationHubCourseEditContentViewMode v-if="hubCourse.step === 4" />
    <BaseIconClose data-cy="close-chapter-icon" @click="onClose" />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    cycles() {
      return this.course.cycles || [];
    },
    dates() {
      return this.cycles[0].dates;
    },
    numberOf() {
      return this.course.version?.numberOf || {};
    },
    chapters() {
      return this.course.chapters.length || this.numberOf.chapters;
    },
    lectures() {
      const lectures = this.course.chapters.reduce(
        (acc, chapter) => acc + chapter.lectures.length,
        0,
      );
      return (
        lectures || this.numberOf.onDemandLectures + this.numberOf.liveLectures
      );
    },
    duration() {
      const totalSeconds = this.course.chaptersDuration;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.round(totalSeconds % 60);

      return hours > 0
        ? `${hours} hr ${minutes} min ${seconds} sec`
        : minutes > 0
          ? `${minutes} min ${seconds} sec`
          : `${seconds} sec`;
    },
  },
  methods: {
    onClose() {
      this.hubCourse.isPreview = false;
    },
  },
};
</script>

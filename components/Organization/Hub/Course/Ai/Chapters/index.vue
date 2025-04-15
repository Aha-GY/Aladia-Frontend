<template>
  <div
    class="mb-2 flex w-full flex-col gap-4 rounded-md border-[0.5px] border-[#FFFFFF0D] bg-[#0C0C0C] p-4 pb-6 text-sm"
  >
    <div class="flex items-center gap-2 pl-1.5 text-base">
      <i class="fa-solid fa-list" />
      <span>Chapters & Lectures</span>
    </div>
    <div class="relative flex w-full items-center justify-between pl-1.5">
      <div>
        {{ $t('course.chapter.count') }}
      </div>
      <BaseInputStepNumber v-model="ai.info.numberOfChapters" />
      <div class="absolute -bottom-1 left-1 h-[1px] w-full bg-[#303030]/60" />
    </div>

    <div
      v-if="!hasSubject"
      class="relative flex w-full items-center justify-between pl-1.5"
    >
      <div>
        {{ $t('base.courses.lecture.perChapter') }}
      </div>
      <BaseInputStepNumber v-model="ai.info.lecturesPerChapter" />
      <div class="absolute -bottom-1 left-1 h-[1px] w-full bg-[#303030]/60" />
    </div>

    <div
      v-if="type !== 'on-demand'"
      class="flex w-full items-center justify-between pl-1.5"
    >
      <el-popover
        ref="durationPopover"
        trigger="click"
        width="460"
        placement="bottom"
      >
        <template #reference>
          <div
            ref="durationRef"
            class="flex flex-1 items-center"
            @click="durationOpen = true"
          >
            <BaseInput
              ref="duration"
              v-model="duration"
              readonly
              :title="$t('course.duration.label')"
            />
          </div>
        </template>
        <div class="flex flex-col p-1">
          <div
            v-for="(title, value) in durations"
            :key="value"
            class="mb-1 cursor-pointer rounded px-2 py-1 hover:bg-white/10"
            @click="onDurationChange(value)"
          >
            {{ $t(title, { minute: value }) }}
          </div>
        </div>
      </el-popover>
    </div>

    <div
      v-if="type !== 'live'"
      class="flex w-full items-center justify-between pl-1.5"
    >
      <div>Generate Lecture Thumbnails Using AI?</div>
      <BaseSwitcher
        :active="ai.info.generateLectureThumbnail"
        @change="onThumbnailChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const durationRef = ref(null);
    const durationOpen = ref(false);
    const hubCourse = useHubCoursesStore();
    const hubSubject = useHubSubjectStore();
    return { hubCourse, hubSubject, durationRef, durationOpen };
  },
  data() {
    return {
      duration: '',
      durations: {
        120: 'course.duration.minutes',
        90: 'course.duration.minutes',
        60: 'course.duration.minutes',
        45: 'course.duration.minutes',
        30: 'course.duration.minutes',
      },
      abilitateLecturesSubject: false,
    };
  },
  computed: {
    ai() {
      return this.hubCourse.ai;
    },
    type() {
      return this.hubCourse.detail.type;
    },
    hasSubject() {
      return this.hubSubject.detail.subjects.some(
        (subject) => subject.selected,
      );
    },
  },
  mounted() {
    const lectureDuration = this.ai.info.lectureDuration;
    this.duration = this.$t(this.durations[lectureDuration], {
      minute: lectureDuration,
    });
  },
  methods: {
    onDurationChange(value) {
      this.duration = this.$t(this.durations[value], { minute: value });
      this.ai.info.lectureDuration = Number(value);
      this.durationOpen = false;
      this.$refs.duration.focus = false;
      this.$refs.durationPopover.hide();
    },
    onThumbnailChange(value) {
      this.ai.info.generateLectureThumbnail = value;
    },
  },
};
</script>

<template>
  <div
    class="mb-2 flex w-full flex-col gap-4 rounded-md border-[0.5px] border-[#FFFFFF0D] bg-[#0C0C0C] p-4 pb-6 text-sm"
  >
    <div class="flex items-center gap-2 pl-1.5 text-base">
      <i class="fa-regular fa-chalkboard-user" />
      <span>{{ $t('base.courses.lectures') }}</span>
    </div>
    <div class="flex w-full items-center justify-between pl-1.5">
      <div>Generate Thumbnail with AI?</div>
      <BaseSwitcher
        :active="ai.info.generateLectureThumbnail"
        @change="onThumbnailChange"
      />
    </div>
    <div class="flex w-full items-center justify-between pl-1.5">
      <el-popover
        ref="titlePopover"
        trigger="click"
        width="460"
        placement="bottom"
      >
        <template #reference>
          <div
            ref="titleRef"
            class="flex flex-1 items-center"
            data-cy="7e17c33fa170980d"
            @click="titlelOpen = true"
          >
            <BaseInput
              ref="title"
              v-model="title"
              readonly
              :title="$t('course.title.length')"
            />
          </div>
        </template>
        <div class="flex flex-col p-1">
          <div
            v-for="(title, value) in titles"
            :key="value"
            class="mb-1 cursor-pointer rounded px-2 py-1 hover:bg-white/10"
            data-cy="9df40678db1aed07"
            @click="onTitleChange(value)"
          >
            {{ $t(title) }}
          </div>
        </div>
      </el-popover>
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
            data-cy="4a6c02cce9aef3a1"
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
            data-cy="af36180ca2f05384"
            @click="onDurationChange(value)"
          >
            {{ $t(title, { minute: value }) }}
          </div>
        </div>
      </el-popover>
    </div>
    <div
      v-if="!hasSubject"
      class="relative flex w-full items-center justify-between pl-1.5"
    >
      <div class="text-13 text-white/50">
        {{ $t('base.courses.lecture.perChapter') }}
      </div>
      <BaseInputStepNumber v-model="ai.info.lecturesPerChapter" />
      <div class="absolute -bottom-1 left-1 h-[1px] w-full bg-[#303030]/60" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const titleRef = ref(null);
    const titlelOpen = ref(false);
    const durationRef = ref(null);
    const durationOpen = ref(false);
    const hubCourse = useHubCoursesStore();
    const hubSubject = useHubSubjectStore();
    return {
      hubCourse,
      titleRef,
      titlelOpen,
      durationRef,
      durationOpen,
      hubSubject,
    };
  },
  data() {
    return {
      title: '',
      titles: {
        mediumTitle: 'org.titles.medium',
        shortTitle: 'org.titles.short',
        descriptiveTitle: 'org.titles.descriptive',
      },
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
  watch: {
    titlelOpen(state) {
      if (state) {
        this.$refs.title.$refs.input.blur();
        this.$refs.title.focus = true;
      }
    },
  },
  mounted() {
    const lectureTitleLength = this.ai.info.lectureTitleLength;
    this.title = this.$t(this.titles[lectureTitleLength]);

    const lectureDuration = this.ai.info.lectureDuration;
    this.duration = this.$t(this.durations[lectureDuration], {
      minute: lectureDuration,
    });
  },
  methods: {
    onTitleChange(type) {
      this.title = this.$t(this.titles[type]);
      this.titlelOpen = false;
      this.$refs.title.focus = false;
      this.$refs.titlePopover.hide();
    },
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

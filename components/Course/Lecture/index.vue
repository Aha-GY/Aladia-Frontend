<template>
  <div
    v-if="lecture.id"
    :data-lecture-id="lecture.id"
    :class="[
      'mx-2 mb-2 rounded py-2 last-of-type:mb-0 hover:bg-[#FFF]/5',
      isSelectModel ? 'transition-bg duration-30' : '',
      isSelectActive ? 'bg-[#2e2e2e]/[0.3]' : '',
      isFilesOpen ? 'bg-[#e2e2e2]/[0.03]' : '',
    ]"
  >
    <div class="relative flex rounded transition-all duration-300 last:mb-4">
      <div class="flex items-center px-2">
        <i
          class="fa-solid fa-play text-11 text-purple-800 transition-all duration-300"
          :class="active ? '' : 'opacity-0'"
        />
      </div>
      <div
        class="relative h-[3.5rem] w-[6.23rem] shrink-0 cursor-pointer"
        data-cy="9826e9ae078fba31"
        @mouseenter="isLectureHover = true"
        @mouseleave="isLectureHover = false"
        @click="onLectureClick"
      >
        <div
          class="relative h-full scale-100 overflow-hidden rounded transition-all active:scale-95"
        >
          <CourseLectureThumbnail :lecture="lecture" :status="status" />
          <CourseLectureTime
            v-if="!isSelectModel"
            :active="active"
            :type="type"
            :player="player"
            :lecture="lecture"
          />
          <CourseLectureIcon
            :active="active"
            :loading="loading"
            :playing="playing"
          />
          <CourseLectureLock
            v-if="
              course.suspend == true &&
              status !== 'future' &&
              status !== 'live' &&
              !isSelectModel
            "
            :is-lecture-hover="isLectureHover"
            :is-lecture-click="isLectureClick"
            :disabled="disabled"
            :active="active"
            :suspend="course.suspend"
          />
          <div
            v-if="status === 'live'"
            class="absolute inset-0 z-30 flex items-center justify-center gap-2 bg-black/80 text-sm"
          >
            <BaseLive class="scale-125" />
            {{ $t('course.stream.live') }}
          </div>
          <CourseLectureSelete
            v-if="isSelectModel"
            class="absolute bottom-0 right-0 z-30"
            :lecture="lecture"
            :lecture-index="lectureIndex"
            :chapter-index="chapterIndex"
          />
        </div>
        <CourseLecturePlayed
          v-if="status !== 'future' && status !== 'live'"
          :lecture="lecture"
          :active="active"
        />
      </div>
      <div class="flex flex-1 flex-col justify-center gap-1 px-2 text-xs">
        <div class="flex items-center gap-2 text-white/50">
          <div class="mr-2 flex w-full items-center gap-2 self-stretch">
            <div class="shrink-0">
              {{ $t('course.lecture') }} {{ displayLectureIndex + 1 }}
            </div>
            <el-tooltip
              v-if="subject.id"
              effect="light"
              :content="subject.title"
              placement="top-end"
              :offset="5"
            >
              <div
                class="flex cursor-pointer items-center justify-between gap-1.5 rounded-full px-1.5 py-1 text-xs font-light text-white"
                :style="{ background: hexToRgba(subject.color, 0.2) }"
              >
                <i class="fa-regular fa-chalkboard-user" />
                <span class="max-w-24 truncate">
                  {{ subject.title }}
                </span>
              </div>
            </el-tooltip>
          </div>
          <!-- <BaseWaveform
            v-if="active && playing && type === 'on-demand' && !isSonModel"
            :playing="playing"
          /> -->
          <!-- For now it should be removed. we will talk about it -->
          <!-- <BaseCountdown
            v-if="type === 'live' && status === 'future'"
            :start-date="event?.dates?.startDate"
            @time-elapsed="onTimeElapsed"
          /> -->
        </div>
        <div
          class="line-clamp-2 min-h-[2rem] max-w-52 whitespace-break-spaces break-words"
        >
          {{ lecture.title }}
        </div>
      </div>
      <CourseLectureFile
        :lecture="lecture"
        :status="status"
        :is-files-open="isFilesOpen"
        data-cy="7bea2cd7f2ee6dc7"
        @click="handleFilesOpen"
      />
      <CourseLectureLabel :status="status" />
    </div>
    <CourseLectureAttachments :lecture="lecture" :is-files-open="isFilesOpen" />
  </div>
</template>

<script>
export default {
  props: {
    lecture: Object,
    chapter: Object,
    lectureIndex: Number,
    displayLectureIndex: Number,
    chapterIndex: Number,
    isSelectModel: Boolean,
  },
  setup() {
    const socialStore = useSocialStore();
    const courseStore = useCourseStore();
    const hubEvent = useHubEventStore();
    return { courseStore, socialStore, hubEvent };
  },
  data() {
    return {
      isLectureClick: false,
      isFilesOpen: false,
      isLectureHover: false,
    };
  },
  computed: {
    type() {
      return this.lecture.type;
    },
    course() {
      return this.courseStore.course;
    },
    subject() {
      return this.lecture.subject || {};
    },
    player() {
      return this.courseStore.player;
    },
    active() {
      return (
        this.courseStore.lectureIndex === this.lectureIndex &&
        this.courseStore.chapterIndex === this.chapterIndex
      );
    },
    isSelectActive() {
      return (
        this.socialStore.selectedLecture.lectureIndex === this.lectureIndex &&
        this.socialStore.selectedLecture.chapterIndex === this.chapterIndex
      );
    },
    playing() {
      return this.active && this.player.playing;
    },
    loading() {
      return this.active && this.player.loading;
    },
    lectureCover() {
      return this.lecture.thumbnail.url || this.course.thumbnail.url;
    },
    disabled() {
      return this.chapterIndex > 0 && !this.courseStore.buyed;
    },
    event() {
      return this.lecture.originalEvent;
    },
    live() {
      return this.event?.live || {};
    },
    status() {
      const { startDate, endDate } = this.event?.dates || {};
      if (startDate && endDate) {
        return getCurrentTimeStatus(startDate, endDate);
      }
      return ''; // 'live', 'future', 'past'
    },
    open() {
      return (
        this.courseStore.chapter.state &&
        this.courseStore.chapter.index === this.chapterIndex
      );
    },
    completion() {
      return this.courseStore.getLectureCompletion(this.lecture);
    },
  },
  watch: {
    isLectureHover(state) {
      if (!state) {
        this.isLectureClick = false;
      }
    },
  },
  methods: {
    async onLectureClick() {
      if (this.isSelectModel) {
        return;
      }
      const art = window['art'];

      // 未购买
      if (this.disabled) {
        this.isLectureClick = true;
        this.$refs['lock-icon']?.classList.add('animate__animated');
        this.$refs['lock-icon']?.classList.add('animate__tada');
        await sleep(1000);
        this.$refs['lock-icon']?.classList.remove('animate__animated');
        this.$refs['lock-icon']?.classList.remove('animate__tada');
        this.isLectureClick = false;
        return;
      }

      // 正在播放的视频
      if (this.active && art) {
        // 假如视频未播放，自动跳转到上次播放位置
        if (!this.player.currentTime && this.completion) {
          art.seek = (this.completion / 100) * art.duration;
        }
        art.toggle();
        return;
      }

      // 点播视频
      if (this.lecture.type === 'on-demand') {
        const url = this.lecture.videos[0]?.url;
        if (url) {
          this.player.currentLecture = this.lecture;
          this.player.currentChapter = this.chapter;
          this.courseStore.play(this.lecture);
          this.$router.replace({
            query: {
              ...this.$route.query,
              lectureId: this.lecture.id,
              chapterId: this.chapter.id,
            },
          });
        } else {
          this.$toast.error(this.$t('course.file.video.empty'));
        }
        return;
      }

      // 直播视频
      if (this.lecture.type === 'live') {
        if (!this.live.roomId) {
          const { roomId } = await this.hubEvent.getEventAuthToken({
            calendarId: this.event.calendarId,
            eventId: this.event.id,
          });
          this.live.roomId = roomId;
        }
        if (this.status !== 'past' && this.live.roomId) {
          this.player.currentLecture = this.lecture;
          this.player.currentChapter = this.chapter;
          this.$router.replace({
            query: {
              ...this.$route.query,
              lectureId: this.lecture.id,
              chapterId: this.chapter.id,
            },
          });
        }
      }
    },
    async onTimeElapsed() {
      // 倒计时结束，更新开始时间触发直播
      const startDate = new Date().toISOString();
      await sleep(200);
      if (this.status) {
        this.event.dates.startDate = startDate;
      }
    },
    handleFilesOpen() {
      if (this.isSelectModel) {
        return;
      }
      this.isFilesOpen = !this.isFilesOpen;
    },
  },
};
</script>

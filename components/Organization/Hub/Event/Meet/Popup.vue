<template>
  <div class="flex flex-col gap-2 p-2">
    <div v-if="status === 'future'" class="flex items-center gap-2">
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-light fa-hourglass-clock text-[#707070]" />
      </div>
      <BaseCountdown :start-date="dates?.startDate" />
    </div>

    <div v-if="status === 'live'" class="flex items-center gap-2">
      <BaseLive class="h-4 w-4 scale-50" />
      <div class="shrink-0 text-xs font-medium text-[#FAFAFA]">
        {{ $t('meet.ongoing') }}
      </div>
      <div class="truncate text-xs text-white">
        {{ secondToTimeLabel(startSeconds) }}
      </div>
    </div>
    <div
      v-if="(status === 'future' || status === 'live') && live.roomId"
      class="flex items-center gap-2"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-light fa-link text-[#707070]" />
      </div>
      <div class="truncate text-xs text-[#E0B92C] underline underline-offset-2">
        {{ link }}
      </div>
      <div
        class="flex h-5 w-5 cursor-pointer items-center justify-center active:scale-95"
        data-cy="c1e91bd12e1d7c4e"
        @click="copy(link)"
      >
        <i class="fa-light fa-copy text-[#FAFAFA]" />
      </div>
    </div>

    <div
      v-if="(status === 'future' || status === 'live') && live.roomId"
      class="flex items-center gap-2"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-light fa-hashtag text-[#707070]" />
      </div>
      <div class="text-xs font-medium text-[#FAFAFA]">
        {{ $t('meet.roomId') }}
      </div>
      <div class="text-xs font-medium text-[#FAFAFA]">{{ live.roomId }}</div>
      <div
        class="flex h-5 w-5 cursor-pointer items-center justify-center active:scale-95"
        data-cy="8977a8f309b9033c"
        @click="copy(live.roomId)"
      >
        <i class="fa-light fa-copy text-[#FAFAFA]" />
      </div>
    </div>

    <div v-if="status === 'past'" class="flex items-center gap-2">
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-solid fa-clock text-[#707070]" />
      </div>
      <div class="text-xs font-medium text-[#FAFAFA]">
        {{ $t('org.calendar.setting.select.duration.total') }}
      </div>
      <div class="text-sm text-white">{{ secondToTimeLabel(durations) }}</div>
    </div>

    <div
      v-if="status === 'past' && recordings.length"
      class="flex items-center gap-2"
    >
      <div class="text-xs font-medium text-[#707070]">
        {{ $t('meet.recordings') }}
      </div>

      <div class="flex h-5 w-5 items-center justify-center text-xs font-light">
        {{ recordings.length }}
      </div>
    </div>

    <div
      v-if="status === 'past' && recordings.length"
      class="hide-scrollbar flex max-h-32 flex-col gap-1.5 overflow-y-auto transition-all"
    >
      <div
        v-for="item in recordings"
        :key="item?.file?.fileId"
        class="flex cursor-pointer items-center gap-2 rounded-5 py-1.5 transition-all hover:bg-white/5"
        data-cy="b9e443e54a0e1014"
        @click="open(item.file)"
      >
        <div class="flex h-6 w-6 items-center justify-center">
          <i class="fa-solid fa-play text-xs" />
        </div>
        <div class="flex w-0 flex-1 items-center gap-1">
          <div class="truncate text-sm text-[##F1F1F1]">{{ item.title }}</div>
          <div class="text-xs text-[#707070]">
            {{ secondToTime(item.duration) }}
          </div>
        </div>
        <!-- <el-tooltip effect="light" placement="right">
          <div class="flex h-6 w-6 cursor-pointer items-center justify-center">
            <i class="fa-solid fa-info-circle text-xs" />
          </div>
          <template #content>
            <div class="text-sm">
              Start time: {{ formatDate(item.startedAt, 'HH:mm') }}
            </div>
            <div class="text-sm">
              End time: {{ formatDate(item.stoppedAt, 'HH:mm') }}
            </div>
          </template>
        </el-tooltip> -->
      </div>
    </div>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  setup() {
    const hubEvent = useHubEventStore();
    const hubCalendar = useHubCalendarStore();
    return { hubEvent, hubCalendar };
  },
  data() {
    return {
      show: false,
      hover: false,
    };
  },
  computed: {
    event() {
      return this.hubEvent.event;
    },
    live() {
      return this.event.live;
    },
    dates() {
      return this.event.dates;
    },
    startSeconds() {
      const diff = dayjs(new Date(this.dates?.endDate)).diff(
        dayjs(new Date(this.dates?.startDate)),
        'minute',
      );
      const startDate =
        diff % 1440 === 0
          ? dayjs(new Date(this.dates?.startDate)).startOf('day')
          : new Date(this.dates?.startDate);
      return this.status === 'live' ? dayjs().diff(startDate, 'second') : 0;
    },
    status() {
      const { startDate, endDate } = this.dates || {};
      if (startDate && endDate && this.live.roomId !== null) {
        return getCurrentTimeStatus(startDate, endDate);
      }
      return ''; // 'live', 'future', 'past'
    },
    course() {
      return this.hubEvent.course;
    },
    chapter() {
      return this.hubEvent.chapter;
    },
    lecture() {
      return this.hubEvent.lecture;
    },
    link() {
      if (this.event?.entity?.id || this.course?.id) {
        let form = '';
        if (
          (this.event.spaceId && this.event.folderId) ||
          (this.course.spaceId && this.course.folderId)
        ) {
          form += `&from=space&space=${this.event.spaceId || this.course.spaceId}&folder=${this.event.folderId || this.course.folderId}`;
        }
        return `${window.location.origin}/courses/${this.event?.entity?.id || this.course?.id}?version=latest&chapterId=${this.event?.chapterSummary?.id || this.chapter?.id}&lectureId=${this.event.lectureId || this.lecture?.id}${form}`;
      } else {
        return `${window.location.origin}/meet/${this.live.roomId}`;
      }
    },
    recordings() {
      return this.live?.recordings || [];
    },
    durations() {
      return this.recordings.map((r) => r.duration).reduce((a, b) => a + b, 0);
    },
  },
  methods: {
    open(file) {
      // window.open(file.signedUrl, '_blank');
      if (this.event?.entity?.id || this.course?.id) {
        let form = '';
        if (
          (this.event.spaceId && this.event.folderId) ||
          (this.course.spaceId && this.course.folderId)
        ) {
          form += `&from=space&space=${this.event.spaceId || this.course.spaceId}&folder=${this.event.folderId || this.course.folderId}`;
        }
        this.$router.push(
          `/courses/${this.event?.entity?.id || this.course?.id}?version=latest&chapterId=${this.event?.chapterSummary?.id || this.chapter?.id}&lectureId=${this.event.lectureId || this.lecture?.id}&videoId=${file.fileId}${form}`,
        );
      } else {
        window.open(
          `${window.location.origin}/player?calendarId=${this.event.calendarId}&eventId=${this.event.id}&videoId=${file.fileId}&type=calendar`,
          '_blank',
        );
      }
      this.hubCalendar.createOpen = false;
    },
    timeFormat(date) {
      return formatDate(date, 'HH:mm:ss');
    },
    copy(value) {
      navigator.clipboard.writeText(value).then(
        () => {
          this.$toast.success(this.$t('index.copy.clipboard'));
        },
        (err) => {
          console.error('failed ot copy link to clip board', err);
        },
      );
    },
    secondToTimeLabel(second) {
      const hour = Math.floor(second / 3600);
      const min = Math.floor((second - hour * 3600) / 60);
      const sec = Math.floor(second - hour * 3600 - min * 60);
      return hour > 0
        ? `${hour} Hours ${min} Minutes ${sec} Seconds`
        : min > 0
          ? `${min} Minutes ${sec} Seconds`
          : `${sec} Seconds`;
    },
  },
};
</script>

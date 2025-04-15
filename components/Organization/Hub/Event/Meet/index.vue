<template>
  <div class="relative flex gap-4">
    <div class="mt-2 flex w-5 justify-center">
      <i class="fa-light fa-video-plus text-base text-white/20" />
    </div>
    <div class="flex justify-between gap-2 text-xs md:text-sm">
      <div
        v-if="hubEvent.meetLoading"
        class="flex h-7 w-32 items-center justify-center rounded-5 bg-white/5"
      >
        <i class="fa-solid fa-spinner animate-spin text-xs" />
      </div>
      <div v-else class="flex items-center">
        <div
          v-if="
            ['live', 'future'].includes(status) ||
            (roomStatus === 'live' && !event.id)
          "
          class="flex cursor-pointer items-center gap-1.5 rounded-5 bg-[#E0B92C] px-2 py-1.5 font-semibold text-[#212121] transition-all hover:bg-[#C4A000]"
          data-cy="375e2e1c9699f900"
          @click="goMeet"
        >
          <i v-if="loading" class="fa-light fa-spinner animate-spin text-xs" />
          {{ $t('course.room.join') }}
          <div
            v-if="event.id"
            ref="buttonRef"
            class="flex h-5 w-5 items-center justify-center rounded-5 bg-black/10"
            data-cy="caed231bb56de945"
            @mouseenter="open = true"
          >
            <i class="fa-light fa-info-circle text-[#FAFAFA]" />
          </div>
        </div>

        <div
          v-else-if="status === 'past' && live.processingRecordings"
          class="flex items-center gap-1.5 rounded-5 bg-white/5 px-2 py-1.5 text-xs font-medium text-[#FAFAFA]"
        >
          <i class="fa-light fa-spinner animate-spin text-xs" />
          {{ $t('course.room.recording.processed') }}
        </div>

        <div
          v-else-if="status === 'past'"
          class="flex cursor-pointer items-center gap-1.5 rounded-5 bg-[#E0B92C] px-2 py-1.5 font-semibold text-[#212121] transition-all hover:bg-[#C4A000]"
          data-cy="268ef21903860ef8"
          @click="goCourse"
        >
          {{
            recordings.length
              ? $t('course.room.recording.watch')
              : $t('course.room.closed')
          }}
          <div
            ref="buttonRef"
            class="flex h-5 w-5 items-center justify-center rounded-5 bg-black/10"
            data-cy="5111e55c2a1d4b48"
            @mouseenter="open = true"
            @click.stop
          >
            <i class="fa-light fa-info-circle text-[#FAFAFA]" />
          </div>
        </div>

        <div
          v-if="roomStatus === 'pending'"
          class="flex cursor-pointer items-center gap-2 rounded-5 bg-[#c6a54c] px-2 py-1.5 font-semibold text-[#212121] transition-all"
          data-cy="event-create-room-button"
          @click="onCreate"
        >
          {{ $t('course.room.create') }}
        </div>
      </div>
      <div class="flex h-8 items-center text-xs text-[#707070]">
        {{ textLabel }}
      </div>
    </div>
    <el-popover
      :visible="open"
      :virtual-ref="buttonRef"
      :offset="10"
      :width="334"
      placement="bottom-start"
      virtual-triggering
      :persistent="false"
      :teleported="false"
      @close="open = false"
    >
      <OrganizationHubEventMeetPopup />
    </el-popover>
  </div>
</template>

<script>
import dayJS from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

const dayjs = dayJS.tz;

dayJS.extend(isBetween);
export default {
  setup() {
    const open = ref(false);
    const buttonRef = ref(null);
    const hubEvent = useHubEventStore();
    onClickOutside(
      buttonRef,
      () => {
        open.value = false;
      },
      {
        ignore: ['.el-popper'],
      },
    );
    const hubCalendar = useHubCalendarStore();
    return { hubEvent, hubCalendar, open, buttonRef };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    event() {
      return this.hubEvent.event;
    },
    live() {
      return this.event.live || {};
    },
    recordings() {
      return this.live?.recordings || [];
    },
    dates() {
      return this.event.dates;
    },
    roomStatus() {
      return this.event.roomStatus;
    },
    status() {
      const { startDate, endDate } = this.dates || {};
      if (startDate && endDate && this.roomStatus !== 'pending') {
        return getCurrentTimeStatus(startDate, endDate);
      }
      return ''; // 'live', 'future', 'past'
    },
    lecture() {
      return this.hubEvent.lecture;
    },
    chapter() {
      return this.hubEvent.chapter;
    },
    course() {
      return this.hubEvent.course;
    },
    textLabel() {
      if (this.status === 'past') {
        return this.$t('meet.past');
      } else if (this.status === 'future') {
        return this.$t('meet.future');
      } else if (this.status === 'live') {
        const diff = dayjs(new Date(this.dates?.endDate)).diff(
          dayjs(new Date(this.dates?.startDate)),
          'minute',
        );
        const startDate =
          diff % 1440 === 0
            ? dayjs(new Date(this.dates?.startDate)).startOf('day')
            : new Date(this.dates?.startDate);
        return this.$t('meet.continues', {
          time: secondToTime(dayjs().diff(startDate, 'second')),
        });
      }
      return '';
    },
  },
  methods: {
    async onCreate() {
      if (this.live.roomId) {
        return;
      }
      this.hubEvent.meetLoading = true;
      if (this.event.id) {
        try {
          await this.hubEvent.updateEvent({
            calendarId: this.event.calendarId,
            id: this.event.id,
            roomStatus: 'live',
          });
          this.event.roomStatus = 'live';
          this.hubEvent.meetLoading = false;
        } catch (error) {
          this.hubEvent.meetLoading = false;
        }
      } else {
        await sleep(1000);
        this.event.roomStatus = 'live';
        this.hubEvent.meetLoading = false;
      }
    },
    async goMeet() {
      if (!this.event.id) {
        return;
      }
      if (this.event?.entity?.id || this.course?.id) {
        this.goCourse();
      } else {
        if (!this.live.roomId) {
          try {
            this.loading = true;
            const { roomId } = await this.hubEvent.getEventAuthToken({
              calendarId: this.event.calendarId,
              eventId: this.event.id,
            });
            this.live.roomId = roomId;
            this.loading = false;
          } catch (error) {
            console.log(error);
            this.loading = false;
            return;
          }
        }
        window.open(
          `${window.location.origin}/meet/${this.live.roomId}`,
          '_blank',
        );
      }
    },
    async goCourse() {
      if (!this.event.id) {
        return;
      }
      if (!this.live.roomId) {
        this.loading = true;
        const { roomId } = await this.hubEvent.getEventAuthToken({
          calendarId: this.event.calendarId,
          eventId: this.event.id,
        });
        this.live.roomId = roomId;
        this.loading = false;
      }
      if (
        this.event?.entity?.id &&
        this.event?.chapterSummary?.id &&
        this.event.lectureId
      ) {
        let form = '';
        if (this.event.spaceId && this.event.folderId) {
          form += `&from=space&space=${this.event.spaceId}&folder=${this.event.folderId}`;
        }
        this.$router.push(
          `/courses/${this.event?.entity?.id}?version=latest&chapterId=${this.event?.chapterSummary?.id}&lectureId=${this.event.lectureId}${form}`,
        );
      } else if (this.course?.id && this.chapter?.id && this.lecture?.id) {
        let form = '';
        if (this.course.spaceId && this.course.folderId) {
          form += `&from=space&space=${this.course.spaceId}&folder=${this.course.folderId}`;
        }
        this.$router.push(
          `/courses/${this.course?.id}?version=latest&chapterId=${this.chapter?.id}&lectureId=${this.lecture?.id}${form}`,
        );
      }
      this.hubCalendar.createOpen = false;
    },
    copy(id) {
      navigator.clipboard.writeText(id).then(
        () => {
          this.$toast.success('roomId copied to clipboard');
        },
        (err) => {
          console.error('failed ot copy link to clip board', err);
        },
      );
    },
  },
};
</script>

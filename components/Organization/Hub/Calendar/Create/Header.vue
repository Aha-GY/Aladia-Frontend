<template>
  <div
    class="relative flex items-center justify-between gap-1 rounded-t-5 bg-[#0c0c0c] px-4 py-3"
  >
    <div v-if="course" class="bg-[#0c0c0c]">
      <div class="text-base">{{ course.title }}</div>
      <div class="text-xs font-light text-white/50">
        {{
          $t('org.streaming.range', {
            start: formatDate(cycle?.dates?.startDate, 'DD MMM YYYY'),
            end: formatDate(cycle?.dates?.endDate, 'DD MMM YYYY'),
          })
        }}
      </div>
    </div>
    <div v-else class="flex items-center gap-1">
      <div
        v-if="isLive"
        class="relative flex items-center text-xs text-[#707070]"
      >
        <BaseLive class="h-6 w-6 scale-50" />
        {{ $t('org.streaming.live') }}
      </div>
      <div v-if="isLive && onPremise" class="text-[#707070]">,</div>
      <div
        v-if="onPremise"
        class="relative flex items-center gap-1 text-xs text-[#707070]"
      >
        <i class="fa-solid fa-map-location-dot" />
        {{ $t('org.streaming.onPremise') }}
      </div>
    </div>

    <div class="z-10 flex items-center gap-1">
      <BaseIconClose
        data-cy="calendar-event-close-icon"
        @click.stop="onClose"
      />
    </div>
  </div>
</template>
<script>
import dayJS from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

const dayjs = dayJS.tz;

dayJS.extend(isBetween);
export default {
  setup() {
    const hubEventStore = useHubEventStore();
    const hubCalendarStore = useHubCalendarStore();
    return { hubEventStore, hubCalendarStore };
  },
  computed: {
    event() {
      return this.hubEventStore.event;
    },
    course() {
      return this.hubCalendarStore.courses.find(
        (r) => r.id === this.event?.entity?.id,
      );
    },
    cycleId() {
      const course = this.hubCalendarStore.selectedCalendars.find(
        (r) => r.id === this.course.calendarId,
      );
      return this.course?.cycleId ? this.course.cycleId : course?.cycleId;
    },
    cycle() {
      return (
        this.course?.cycles?.find((r) => r.id === this.cycleId) ||
        this.course?.cycles[0] ||
        {}
      );
    },
    dates() {
      return this.event.dates;
    },
    isLive() {
      return (
        dayjs().isBetween(
          dayjs(new Date(this.dates.startDate)),
          dayjs(new Date(this.dates.endDate)),
          null,
          '[]',
        ) && this.live
      );
    },
    live() {
      return this.event.roomStatus === 'live';
    },
    onPremise() {
      return this.event.onPremise?.address;
    },
  },
  methods: {
    onClose() {
      this.hubCalendarStore.createOpen = false;
      if (!this.event.id) {
        this.hubCalendarStore.entryDataList =
          this.hubCalendarStore.entryDataList.filter((r) => r.id !== 'create');
      }
    },
  },
};
</script>

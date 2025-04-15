<template>
  <div
    class="flex gap-4 font-light"
    :class="noChapterDates ? '!cursor-not-allowed' : ''"
  >
    <div class="flex h-8 w-5 items-center justify-center">
      <i class="fa-light fa-calendar text-base text-white/20" />
    </div>
    <div
      class="flex flex-col items-start gap-3"
      :class="noChapterDates ? 'pointer-events-none' : ''"
    >
      <BaseDateTime
        :start-date="startDate"
        :end-date="endDate"
        :all-day="allDay"
        :disabled-dates="disabledDates"
        @change="onChange"
      />
      <div
        class="flex cursor-pointer items-center justify-end gap-2 text-white/50"
        data-cy="308a28c8f419fdbb"
        @click="onAllDayClick"
      >
        <BaseCheckbox :active="allDay" />
        {{ $t('org.calendar.allDay') }}
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
    return { hubEvent };
  },
  data() {
    return {
      startDate: null,
      endDate: null,
      allDay: false,
      oldStartDate: null,
      oldEndDate: null,
    };
  },
  computed: {
    type() {
      return this.hubEvent.type;
    },
    event() {
      return this.hubEvent.event;
    },
    frequency() {
      return this.event.frequency;
    },
    dates() {
      return this.event.dates;
    },
    chapter() {
      return this.hubEvent.chapter;
    },
    chapterDates() {
      return this.chapter?.id ? this.chapter?.cycles[0]?.dates : {};
    },
    disabledDates() {
      return [
        {
          start: null,
          end: dayjs(this.chapterDates.startDate).subtract(1, 'day'),
          // end: this.chapterDates.startDate,
        },
        {
          start: this.chapterDates.endDate
            ? dayjs(new Date(this.chapterDates.endDate)).subtract(1, 'day')
            : null,
          end: null,
        },
        // { start: null, end: dayjs().subtract(1, 'day') },
      ];
    },
    noChapterDates() {
      return (
        this.type === 'lecture' &&
        !this.chapterDates.startDate &&
        !this.chapterDates.endDate
      );
    },
  },
  watch: {
    'dates.startDate'(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.init();
      }
    },
    'dates.endDate'(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.dates.startDate) {
        this.startDate = new Date(this.dates.startDate);
      } else {
        this.startDate = new Date();
      }

      if (this.dates.endDate) {
        this.endDate = new Date(this.dates.endDate);
      } else {
        this.endDate = new Date();
      }

      // const startDate = formatDate(this.startDate, 'YYYY-MM-DD');
      // const endDate = formatDate(this.endDate, 'YYYY-MM-DD');
      const diff = dayjs(this.endDate).diff(dayjs(this.startDate), 'minute');
      if (diff % 1440 === 0) {
        this.oldStartDate = getCreateDateRange(this.dates.startDate).startDate;
        this.oldEndDate = getCreateDateRange(this.dates.endDate).endDate;
        this.allDay = true;
      } else {
        this.allDay = false;
      }
    },
    onAllDayClick() {
      this.allDay = !this.allDay;

      let startDate = this.dates.startDate;
      let endDate = this.dates.endDate;

      if (this.allDay) {
        this.oldStartDate = this.dates.startDate;
        this.oldEndDate = this.dates.endDate;
        startDate = getZeroTimeZone(this.dates.startDate);
        endDate = getZeroTimeZone(this.dates.endDate);
        // dayjs(new Date(this.oldStartDate))
        //   .startOf('day')
        //   .toISOString();
        // endDate = dayjs(new Date(this.oldEndDate)).endOf('day').toISOString();
      } else {
        startDate = this.oldStartDate;
        endDate = this.oldEndDate;
      }

      this.startDate = new Date(startDate);
      this.endDate = new Date(endDate);
      this.dates.startDate = startDate;
      this.dates.endDate = endDate;
    },
    async onChange(start, end) {
      this.dates.startDate = start.toISOString();
      this.dates.endDate = end.toISOString();

      this.oldStartDate = getCreateDateRange(this.dates.startDate).startDate;
      this.oldEndDate = getCreateDateRange(this.dates.endDate).endDate;

      await this.hubEvent.availableCalendar({
        dates: this.dates,
        frequency: this.frequency,
      });
    },
  },
};
</script>

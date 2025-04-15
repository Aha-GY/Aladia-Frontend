<template>
  <div
    ref="buttonRef"
    class="group/input relative z-30 flex w-72 cursor-pointer flex-col items-center justify-end"
    data-cy="calendar-end-date-lable"
    @click="open = true"
  >
    <div
      v-if="hubEvent.type === 'lecture'"
      class="w-full"
      data-cy="calander-end-date-lecture-lable"
    >
      <div
        v-if="endDateReference.reference === 'custom'"
        class="flex w-full items-center gap-1.5 transition-all duration-300"
      >
        <input
          readonly
          :value="dateString"
          :placeholder="$t('course.range.set')"
          class="min-w-0 flex-1 cursor-pointer bg-transparent outline-none"
          data-cy="4c6a9148fe7be5be"
          @focus="dateFocus = true"
          @blur="dateFocus = false"
        />
      </div>
      <div v-else class="w-full text-white/50">
        {{ $t('course.range.set') }}
      </div>
    </div>
    <div v-else class="w-full" data-cy="calander-end-date-not-lecture-lable">
      <div
        v-if="dateString"
        class="flex w-full items-center gap-1.5 transition-all duration-300"
      >
        <input
          readonly
          :value="dateString"
          :placeholder="$t('course.range.set')"
          class="min-w-0 flex-1 cursor-pointer bg-transparent outline-none"
          data-cy="calander-end-date-not-lecture-input-lable"
          @focus="dateFocus = true"
          @blur="dateFocus = false"
        />
      </div>
      <div
        v-else
        class="w-full text-white/50"
        data-cy="calander-end-date-not-lecture-not-input-lable"
      >
        {{ $t('course.range.set') }}
      </div>
    </div>
    <el-popover
      :visible="open"
      :virtual-ref="buttonRef"
      :show-arrow="false"
      :width="310"
      virtual-triggering
      placement="bottom-start"
      :persistent="false"
      :teleported="false"
      :popper-options="{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [-4, 12],
            },
          },
        ],
      }"
      @close="open = false"
    >
      <div ref="popupRef" class="p-2">
        <BaseDatePicker
          v-model="date"
          :disabled-dates="disabledDates"
          data-cy="calendar-choose-date"
          @change="onChange"
        />
        <BasePopupBottom @close="open = false" />
      </div>
    </el-popover>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  setup() {
    const open = ref(false);
    const buttonRef = ref(null);
    const popupRef = ref(null);
    const hubEvent = useHubEventStore();

    onClickOutside(
      buttonRef,
      () => {
        open.value = false;
      },
      {
        ignore: [popupRef],
      },
    );

    return { hubEvent, open, buttonRef, popupRef };
  },
  data() {
    return {
      dateFocus: false,
      date: null,
    };
  },
  computed: {
    event() {
      return this.hubEvent.event;
    },
    lecture() {
      return this.hubEvent.lecture;
    },
    startDate() {
      return this.event.dates.startDate;
    },
    disabledDates() {
      return [
        {
          start: null,
          end: this.startDate
            ? dayjs(new Date(this.startDate)).startOf('day')
            : dayjs().startOf('day'), // Disable all dates before the start date
        },
      ];
    },
    frequency() {
      return this.event.frequency;
    },
    endDate() {
      return this.frequency.endDate;
    },
    // date() {
    //   return this.endDate ? new Date(this.endDate) : new Date(this.startDate);
    // },
    dateString() {
      if (this.endDate) {
        return formatDate(this.endDate, 'DD MMM YYYY');
      } else {
        return '';
      }
    },
    endDateReference() {
      return this.event.endDateReference || {};
    },
  },
  watch: {
    'endDateReference.reference'(reference) {
      if (reference !== 'custom') {
        this.open = false;
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.date = this.endDate
        ? new Date(this.endDate)
        : new Date(this.startDate);
    },
    onChange(date) {
      this.frequency.endDate = dayjs(date).endOf('day').toISOString();
      this.open = false;

      this.availableCalendar();
    },
    availableCalendar() {
      if (this.frequency.type === 'custom') {
        if (!this.frequency.counter) {
          return;
        }
        if (
          this.frequency.periodicity === 'week' &&
          !this.frequency.days?.length
        ) {
          return;
        }
        if (
          this.frequency.periodicity === 'month' &&
          !this.frequency.monthlySelection
        ) {
          return;
        }
      }
      this.hubEvent.availableCalendar({
        dates: this.event.dates,
        frequency: this.event.frequency,
      });
    },
  },
};
</script>

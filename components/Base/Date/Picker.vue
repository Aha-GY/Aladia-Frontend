<template>
  <div class="relative flex flex-col items-center px-2 pb-2.5 font-semibold">
    <div
      class="relative mx-2 mb-4 flex h-8 w-[14rem] select-none items-center justify-between gap-2"
    >
      <div
        class="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md transition-all active:scale-95"
        :data-cy="`${dataCy}-left-arrow-date-picker`"
        @mouseenter="leftHover = true"
        @mouseleave="leftHover = false"
        @click="onLeft"
      >
        <i
          class="fa-solid transition-all"
          :class="leftHover ? 'fa-arrow-left' : 'fa-chevron-left'"
          :data-cy="
            leftHover ? 'left-arrow-date-picker' : 'left-chevron-date-picker'
          "
        />
      </div>
      <div
        class="flex w-[9rem] cursor-pointer items-center justify-center gap-1 rounded-md text-base leading-none text-[#E4E4E4] transition-all hover:text-[#E4E4E4]/85 active:scale-95"
        :data-cy="`${dataCy}-month-year-date-picker`"
        @click="yearShow = !yearShow"
      >
        <div class="font-[500]">
          {{ dayjsDate.format('MMMM') }}
        </div>
        <div class="font-bold">{{ dayjsDate.year() }}</div>
      </div>
      <div
        class="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md transition-all active:scale-95"
        :data-cy="`${dataCy}-right-arrow-date-picker`"
        @mouseenter="rightHover = true"
        @mouseleave="rightHover = false"
        @click="onRight"
      >
        <i
          class="fa-solid transition-all"
          :class="rightHover ? 'fa-arrow-right' : 'fa-chevron-right'"
          :data-cy="
            rightHover ? 'right-arrow-date-picker' : 'right-chevron-date-picker'
          "
        />
      </div>
      <!-- <div
        class="absolute bottom-0 left-0 right-0 flex h-[1px] justify-center bg-white/10"
      >
        <div
          class="h-full bg-[#937a32] transition-all duration-300"
          :class="yearShow ? 'w-full' : 'w-0'"
        />
      </div> -->
    </div>

    <div class="mb-1.5 flex w-full items-center justify-center gap-0.5">
      <div
        v-for="item in weekList"
        :key="item"
        :data-cy="`${dataCy}-${item}-week-list-date-picker`"
        class="flex h-3 flex-1 items-center justify-center rounded-md text-10 font-[500] leading-none text-[#707070]"
      >
        {{ item }}
      </div>
    </div>

    <div class="grid w-full grid-cols-7 grid-rows-6 gap-y-1.5 overflow-hidden">
      <div
        v-for="(date, index) in daysInMonth"
        :key="index"
        :data-cy="`${dataCy}-${index}-number-of-days-in-month-date-picker`"
        class="relative flex items-center justify-center px-1"
      >
        <div
          v-if="mode === 'daterange' && !sameDay"
          class="absolute left-0 top-[5%] h-[90%] w-full"
          :class="{ 'bg-[#4E2E78]': isBgRange(date) }"
          :style="bgStyle(date)"
        />
        <div
          class="relative z-10 flex h-6 w-6 select-none items-center justify-center rounded-md border border-transparent text-xs font-[500] transition-all active:scale-95"
          :class="[
            isToday(date)
              ? isSelectedToday(date)
                ? 'bg-[#9747ff] text-white'
                : 'text-[#e4b53d] hover:border-[#E4B53D]'
              : isSelectedToday(date)
                ? 'bg-[#9747ff] text-white'
                : isSameMonth(date)
                  ? 'text-white hover:bg-[#9747ff]'
                  : '!text-[#707070]/30 hover:bg-[#9747ff] hover:!text-white',
            isDisabled(date)
              ? 'cursor-not-allowed !text-white/50 hover:text-white'
              : 'cursor-pointer',
          ]"
          :data-cy="`${dataCy}-day-${index}-date-picker`"
          @mouseenter="onMouseenter(date)"
          @mouseleave="onMouseleave"
          @click.stop="onChangeDate(date)"
        >
          {{ date.getDate() }}
        </div>
      </div>
    </div>

    <div
      class="pointer-events-none absolute left-0 top-11 z-20 flex h-[calc(100%-2.75rem)] w-full select-none flex-col bg-[#0C0C0C] transition-all duration-300"
      :class="
        yearShow
          ? 'pointer-events-auto scale-100 opacity-100'
          : 'scale-[0.8] opacity-0'
      "
    >
      <div
        class="grid flex-1 grid-cols-3 grid-rows-4 gap-x-2.5 gap-y-6 px-2 py-4"
      >
        <div
          v-for="(item, index) in 12"
          :key="item"
          class="flex cursor-pointer items-center justify-center rounded text-xs transition-all hover:font-bold active:scale-95"
          :class="dayjsDate.month() === index ? 'text-[#E4B53D]' : 'text-white'"
          :data-cy="`${dataCy}-${item}-number-of-month-date-picker`"
          @click="onChangeMonth(index)"
        >
          {{ getMonthLabel(index) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayJS from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

const dayjs = dayJS.tz;

dayJS.extend(isBetween);
export default {
  props: {
    modelValue: {
      type: [Date, Object, String],
    },
    defaultValue: {
      type: [Date, Object, String],
      default: new Date(),
    },
    disabledDates: {
      type: Array,
      default: () => [{ start: null, end: null }],
    },
    mode: {
      type: String,
      default: 'date', // date, daterange
    },
    dataCy: {
      type: String,
      default: 'date-picker',
    },
  },
  data() {
    return {
      weekList: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
      initDate: dayjs(new Date(this.defaultValue)).toDate(),
      tempDate: null,
      yearShow: false,
      leftHover: false,
      rightHover: false,
      isFirst: true,
    };
  },
  computed: {
    dayjsDate() {
      return dayjs(this.initDate);
    },
    daysInMonth() {
      return getDaysInMonth(this.initDate);
    },
    sameDay() {
      if (!this.modelValue.start || !this.modelValue.end) {
        return false;
      }
      return dayjs(new Date(this.modelValue.start)).isSame(
        dayjs(new Date(this.modelValue.end)),
        'day',
      );
    },
  },
  watch: {
    modelValue: {
      handler(value) {
        if (!this.isFirst) {
          return;
        }
        // this.isFirst = false;
        if (this.mode === 'date') {
          this.initDate = value
            ? dayjs(new Date(value)).toDate()
            : dayjs(new Date(this.defaultValue)).toDate();
        } else if (this.mode === 'daterange') {
          this.initDate = value.start
            ? dayjs(new Date(value.start)).toDate()
            : dayjs(new Date(this.defaultValue)).toDate();
        }
      },
      deep: true,
      immediate: true,
    },
    defaultValue() {
      this.initDate = dayjs(new Date(this.defaultValue)).toDate();
    },
  },
  methods: {
    getMonthLabel(month) {
      return dayjs().set('month', month).format('MMMM');
    },
    onLeft() {
      if (this.yearShow) {
        this.initDate = dayjs(this.initDate).subtract(1, 'year').toDate();
      } else {
        this.initDate = dayjs(this.initDate).subtract(1, 'month').toDate();
      }
    },
    onRight() {
      if (this.yearShow) {
        this.initDate = dayjs(this.initDate).add(1, 'year').toDate();
      } else {
        this.initDate = dayjs(this.initDate).add(1, 'month').toDate();
      }
    },
    onChangeMonth(month) {
      this.yearShow = false;
      this.initDate = dayjs(this.initDate).set('month', month).toDate();
    },
    onChangeDate(date) {
      if (this.isDisabled(date)) {
        return;
      }
      this.isFirst = true;
      // this.initDate = dayjs(date).toDate();
      if (this.mode === 'date') {
        this.$emit('update:modelValue', date);
        this.$emit('change', date);
      } else {
        if (this.modelValue.start && this.modelValue.end) {
          this.isFirst = false;
          this.$emit('update:modelValue', { start: null, end: null });
          this.$emit('change', { start: null, end: null });
        } else if (this.modelValue.start) {
          if (dayjs(date) >= dayjs(new Date(this.modelValue.start))) {
            this.$emit('update:modelValue', {
              start: this.modelValue.start,
              end: date,
            });
            this.$emit('change', { start: this.modelValue.start, end: date });
          } else if (dayjs(new Date(this.modelValue.start)) > dayjs(date)) {
            this.$emit('update:modelValue', {
              start: date,
              end: this.modelValue.start,
            });
            this.$emit('change', { start: date, end: this.modelValue.start });
          }
        } else {
          this.$emit('update:modelValue', { start: date, end: null });
        }
      }
    },
    isToday(date) {
      return dayjs().isSame(dayjs(date), 'day');
    },
    isSelectedToday(date) {
      if (this.mode === 'date') {
        return dayjs(new Date(this.modelValue || null)).isSame(
          dayjs(date),
          'day',
        );
      } else {
        return (
          dayjs(new Date(this.modelValue.start || null)).isSame(
            dayjs(date),
            'day',
          ) ||
          dayjs(new Date(this.modelValue.end || null)).isSame(
            dayjs(date),
            'day',
          )
        );
      }
    },
    isSameMonth(date) {
      return dayjs(this.initDate).isSame(dayjs(date), 'month');
    },
    isDisabled(date) {
      return this.disabledDates.some((item) => {
        if (item.start && item.end) {
          return dayjs(date).isBetween(
            dayjs(new Date(item.start)),
            dayjs(new Date(item.end)),
            null,
            '[]',
          );
        }
        if (item.start) {
          return dayjs(date) > dayjs(new Date(item.start)).add(1, 'day');
        }
        if (item.end) {
          return dayjs(date) < dayjs(new Date(item.end));
        }
      });
    },
    onMouseenter(date) {
      this.tempDate = dayjs(date);
    },
    onMouseleave() {
      this.tempDate = null;
    },
    isBgRange(date) {
      if (this.mode === 'date') {
        return;
      }

      if (this.modelValue.start && this.modelValue.end) {
        return (
          dayjs(date).startOf('day') >=
            dayjs(new Date(this.modelValue.start)).startOf('day') &&
          dayjs(date).startOf('day') <= dayjs(new Date(this.modelValue.end))
        );
      }
      if (this.tempDate && this.modelValue.start) {
        if (this.tempDate > dayjs(new Date(this.modelValue.start))) {
          return (
            dayjs(date) >= dayjs(new Date(this.modelValue.start)) &&
            dayjs(date) <= this.tempDate
          );
        } else if (this.tempDate < dayjs(new Date(this.modelValue.start))) {
          return (
            dayjs(date) >= this.tempDate &&
            dayjs(date) <= dayjs(new Date(this.modelValue.start))
          );
        }
      }
      return false;
    },
    bgStyle(date) {
      if (this.mode === 'date') {
        return {};
      }
      if (this.modelValue.start && this.modelValue.end) {
        if (dayjs(date).isSame(dayjs(new Date(this.modelValue.start)), 'day')) {
          return {
            left: '50%',
          };
        } else if (
          dayjs(date).isSame(dayjs(new Date(this.modelValue.end)), 'day')
        ) {
          return {
            left: '-50%',
          };
        }
        return {};
      }
      if (this.tempDate && this.modelValue.start) {
        let startDate = null;
        let endDate = null;
        if (this.tempDate > this.modelValue.start) {
          startDate = dayjs(new Date(this.modelValue.start));
          endDate = this.tempDate;
        } else {
          startDate = this.tempDate;
          endDate = dayjs(new Date(this.modelValue.start));
        }
        if (dayjs(date).isSame(dayjs(startDate), 'day')) {
          return {
            left: '50%',
          };
        } else if (dayjs(date).isSame(endDate, 'day')) {
          return {
            left: '-50%',
          };
        }
      }

      return {};
    },
  },
};
</script>

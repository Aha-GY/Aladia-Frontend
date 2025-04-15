<template>
  <div
    ref="datePicker"
    class="relative flex h-8 items-center justify-between gap-2 px-2 md:px-4"
  >
    <div
      class="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-5 transition-all hover:bg-white/5 active:scale-95"
      :data-tooltip="`prev ${typeName}`"
      data-cy="cd727239687a0b2c"
      @mouseenter="leftHover = true"
      @mouseleave="leftHover = false"
      @click="handleBtnPrev"
    >
      <i
        class="fa-solid transition-all"
        :class="leftHover ? 'fa-arrow-left' : 'fa-chevron-left'"
      />
    </div>
    <div
      class="relative flex h-6 w-[9rem] cursor-pointer items-center justify-center whitespace-nowrap rounded-5 text-base font-[500] leading-none text-[#E4E4E4] hover:bg-white/5"
      data-cy="fd9120bfc20abbd8"
      @click.stop="openDatePicker"
    >
      {{ dateName }}
    </div>
    <div
      class="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-5 transition-all hover:bg-white/5 active:scale-95"
      :data-tooltip="`next ${typeName}`"
      data-cy="bd4d4152f3f246eb"
      @mouseenter="rightHover = true"
      @mouseleave="rightHover = false"
      @click="handleBtnNext"
    >
      <i
        class="fa-solid transition-all"
        :class="rightHover ? 'fa-arrow-right' : 'fa-chevron-right'"
      />
    </div>
    <div
      v-if="datePickerShow"
      class="absolute left-0 top-0 z-10 rounded-md bg-[#0C0C0C] shadow-[0_6px_24px_rgba(0,0,0,0.06)]"
    >
      <BaseDatePicker
        v-model="hubCalendarStore.initDate"
        @change="onChangeDate"
      />
    </div>
  </div>
</template>
<script>
import dayJS from 'dayjs';

import locales from '~/constant/en';

const dayjs = dayJS.tz;

const labels = locales.labels;
export default {
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    const datePicker = ref();
    const datePickerShow = ref(false);
    onClickOutside(datePicker, () => {
      datePickerShow.value = false;
    });
    return { hubCalendarStore, datePicker, datePickerShow };
  },
  data() {
    return {
      leftHover: false,
      rightHover: false,
    };
  },
  computed: {
    initDate() {
      return this.hubCalendarStore.initDate;
    },
    typeName() {
      return ['day', 'week', 'month', 'year', 'list'][
        this.hubCalendarStore.dateTypeIndex
      ];
    },
    dateName() {
      let name = '';
      switch (this.hubCalendarStore.dateTypeIndex) {
        case 0:
          name = formatDate(this.initDate, 'DD MMMM YYYY');
          break;
        case 1:
          name = this.getWeekRange();
          break;
        case 2:
          name = formatDate(this.initDate, 'MMMM YYYY');
          break;
        case 3:
          name = formatDate(this.initDate, 'YYYY');
          break;
        case 4:
          name = formatDate(this.initDate, 'MMMM YYYY');
          break;
        default:
          break;
      }
      return name;
    },
  },
  methods: {
    handleBtnPrev() {
      switch (this.hubCalendarStore.dateTypeIndex) {
        case 0:
          this.hubCalendarStore.initDate = dayjs(this.initDate)
            .subtract(1, 'day')
            .toDate();
          break;
        case 1:
          this.hubCalendarStore.initDate = dayjs(this.initDate)
            .subtract(1, 'week')
            .toDate();
          break;
        case 2:
          this.hubCalendarStore.initDate = dayjs(this.initDate)
            .subtract(1, 'month')
            .toDate();
          break;
        case 3:
          this.hubCalendarStore.initDate = dayjs(this.initDate)
            .subtract(1, 'year')
            .toDate();
          break;
        case 4:
          this.hubCalendarStore.initDate = dayjs(this.initDate)
            .subtract(1, 'month')
            .toDate();
          break;
        default:
          break;
      }
    },
    handleBtnNext() {
      switch (this.hubCalendarStore.dateTypeIndex) {
        case 0:
          this.hubCalendarStore.initDate = dayjs(this.initDate)
            .add(1, 'day')
            .toDate();
          break;
        case 1:
          this.hubCalendarStore.initDate = dayjs(this.initDate)
            .add(1, 'week')
            .toDate();
          break;
        case 2:
          this.hubCalendarStore.initDate = dayjs(this.initDate)
            .add(1, 'month')
            .toDate();
          break;
        case 3:
          this.hubCalendarStore.initDate = dayjs(this.initDate)
            .add(1, 'year')
            .toDate();
          break;
        case 4:
          this.hubCalendarStore.initDate = dayjs(this.initDate)
            .add(1, 'month')
            .toDate();
          break;
        default:
          break;
      }
    },
    getWeekRange() {
      const weekArray = getWeekArray(this.hubCalendarStore.initDate);
      const [m1, m2] = [
        dayjs(weekArray[0]).month(),
        dayjs(weekArray[6]).month(),
      ];
      const [d1, d2] = [dayjs(weekArray[0]).date(), dayjs(weekArray[6]).date()];

      if (m1 === m2) {
        return `${
          labels.monthsShort[m1]
        } ${d1} – ${d2} ${dayjs(weekArray[0]).year()}`;
      } else {
        return `${labels.monthsShort[m1]} ${d1} – ${d2} ${
          labels.monthsShort[m2]
        } ${dayjs(weekArray[1]).year()}`;
      }
    },
    openDatePicker() {
      this.datePickerShow = true;
    },
    onChangeDate() {
      this.datePickerShow = false;
    },
  },
};
</script>

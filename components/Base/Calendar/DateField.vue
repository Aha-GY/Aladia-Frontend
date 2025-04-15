<template>
  <div
    class="flex h-7 items-center gap-1.5 rounded border border-white/20 px-1"
  >
    <div class="relative">
      <input
        ref="day"
        v-model="day"
        type="text"
        maxlength="2"
        class="w-6 rounded text-center outline-none"
        @focus="dayFocused = true"
        @input="handleDayInput"
        @blur="formatDay"
      />
      <input
        v-if="!dayInput"
        v-model="lastDay"
        type="text"
        maxlength="2"
        class="pointer-events-none absolute inset-0 w-6 rounded text-center outline-none"
        :class="dayFocused ? 'bg-[#eacb5b] text-black' : 'text-white'"
        placeholder="DD"
        readonly
      />
    </div>
    <div>/</div>
    <div class="relative">
      <input
        ref="month"
        v-model="month"
        type="text"
        maxlength="2"
        class="w-6 rounded text-center outline-none"
        @focus="monthFocused = true"
        @input="handleMonthInput"
        @blur="formatMonth"
      />
      <input
        v-if="!monthInput"
        v-model="lastMonth"
        type="text"
        maxlength="2"
        class="pointer-events-none absolute inset-0 w-6 rounded text-center outline-none"
        :class="monthFocused ? 'bg-[#eacb5b] text-black' : 'text-white'"
        placeholder="MM"
        readonly
      />
    </div>
    <div>/</div>
    <div class="relative">
      <input
        ref="year"
        v-model="year"
        type="text"
        maxlength="4"
        class="w-12 rounded text-center outline-none"
        @focus="yearFocused = true"
        @input="handleYearInput"
        @blur="formatYear"
      />
      <input
        v-if="!yearInput"
        v-model="lastYear"
        type="text"
        maxlength="2"
        class="pointer-events-none absolute inset-0 w-12 rounded text-center outline-none"
        :class="yearFocused ? 'bg-[#eacb5b] text-black' : 'text-white'"
        placeholder="MM"
        readonly
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: {
    modelValue: {
      type: Date,
      default: new Date(),
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      day: '',
      month: '',
      year: '',
      lastDay: '',
      lastMonth: '',
      lastYear: '',
      dayFocused: false,
      monthFocused: false,
      yearFocused: false,
      dayInput: false,
      monthInput: false,
      yearInput: false,
    };
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newDate) {
        const date = dayjs(newDate);
        this.lastDay = date.format('DD');
        this.lastMonth = date.format('MM');
        this.lastYear = date.format('YYYY');
      },
    },
  },
  methods: {
    handleDayInput(e) {
      this.dayInput = true;
      this.day = e.target.value.replace(/\D/g, '');
      this.lastDay = this.day;
      this.updateDate();
      if (this.day.length === 2) {
        this.$refs.month.focus();
      }
    },
    handleMonthInput(e) {
      this.monthInput = true;
      this.month = e.target.value.replace(/\D/g, '');
      this.lastMonth = this.month;
      this.updateDate();
      if (this.month.length === 2) {
        this.$refs.year.focus();
      }
    },
    handleYearInput(e) {
      this.yearInput = true;
      this.year = e.target.value.replace(/\D/g, '');
      this.lastYear = this.year;
      this.updateDate();
    },
    formatDay() {
      this.dayInput = false;
      this.dayFocused = false;
      if (this.day) {
        let day = parseInt(this.day);
        if (day < 1) {
          day = 1;
        }
        if (day > 31) {
          day = 31;
        }
        this.day = '';
        this.lastDay = day.toString().padStart(2, '0');
        this.updateDate();
      }
    },
    formatMonth() {
      this.monthInput = false;
      this.monthFocused = false;
      if (this.month) {
        let month = parseInt(this.month);
        if (month < 1) {
          month = 1;
        }
        if (month > 12) {
          month = 12;
        }
        this.month = '';
        this.lastMonth = month.toString().padStart(2, '0');
        this.updateDate();
      }
    },
    formatYear() {
      this.yearInput = false;
      this.yearFocused = false;
      if (this.year) {
        let year = parseInt(this.year);
        const currentYear = new Date().getFullYear();
        if (year < 2020) {
          year = 2020;
        }
        if (year > currentYear) {
          year = currentYear;
        }
        this.year = '';
        this.lastYear = year.toString().padStart(4, '0');
        this.updateDate();
      }
    },
    updateDate() {
      if (this.lastDay && this.lastMonth && this.lastYear) {
        const dateStr = `${this.lastYear}-${this.lastMonth}-${this.lastDay}`;
        const date = dayjs(dateStr);
        if (date.isValid()) {
          this.$emit('update:modelValue', date.toDate());
        }
      }
    },
  },
};
</script>

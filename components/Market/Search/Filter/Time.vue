<template>
  <div class="mb-4 rounded bg-white/5 p-4">
    <div class="mb-4 text-center font-medium">
      {{ $t('course.range.title') }}
    </div>
    <el-date-picker
      v-model="value"
      type="daterange"
      unlink-panels
      format="DD MMMM YYYY"
      :range-separator="$t('course.range.separator')"
      :start-placeholder="$t('course.range.start')"
      :end-placeholder="$t('course.range.end')"
      :shortcuts="shortcuts"
      placement="bottom-start"
    />
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    query: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      value: [],
    };
  },
  computed: {
    shortcuts() {
      return [
        {
          text: this.$t('filter.period.week'),
          value: () => {
            const end = dayjs();
            const start = end.subtract(7, 'day');
            return [start.toDate(), end.toDate()];
          },
        },
        {
          text: this.$t('filter.period.month'),
          value: () => {
            const end = dayjs();
            const start = end.subtract(1, 'month');
            return [start.toDate(), end.toDate()];
          },
        },
        {
          text: this.$t('filter.period.quarter'),
          value: () => {
            const end = dayjs();
            const start = end.subtract(3, 'month');
            return [start.toDate(), end.toDate()];
          },
        },
      ];
    },
  },
  watch: {
    value(date) {
      this.query.startDate = date[0];
      this.query.endDate = date[1];
    },
  },
  mounted() {
    this.value = [this.query.startDate, this.query.endDate];
  },
  methods: {
    disabledDate(date) {
      return date > dayjs().endOf('day');
    },
  },
};
</script>

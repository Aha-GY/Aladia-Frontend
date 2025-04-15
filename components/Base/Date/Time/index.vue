<template>
  <div
    class="relative flex items-center gap-2 text-sm leading-none text-[#f1f1f1]/95"
  >
    <el-popover
      v-model:visible="startShow"
      trigger="click"
      :show-arrow="false"
      :teleported="false"
      width="268"
    >
      <template #reference>
        <BaseDateTimeLabel :date="startDateValue" :show="startShow" />
      </template>
      <BaseDatePicker
        v-model="startDateValue"
        :disabled-dates="disabledDates"
        @change="onDateChange"
      />
    </el-popover>

    <el-popover
      v-if="!allDay"
      :visible="startTimeShow"
      trigger="click"
      :show-arrow="false"
      :persistent="false"
      :teleported="false"
    >
      <template #reference>
        <BaseDateTimeLabel
          ref="startRef"
          :date="startDateValue"
          :is-time="true"
          :show="startTimeShow"
          data-cy="d23cccee4fd56637"
          @click="startTimeShow = true"
          @hide="startTimeShow = false"
          @on-change="onChange($event, 'start', true)"
        />
      </template>

      <BaseTimePicker
        type="HH:mm"
        :time="startTime"
        @on-change="onChange($event, 'start', false)"
      />
    </el-popover>

    <el-popover
      v-if="!allDay"
      :visible="endTimeShow"
      trigger="click"
      :show-arrow="false"
      :persistent="false"
      :teleported="false"
    >
      <template #reference>
        <BaseDateTimeLabel
          ref="endRef"
          :date="endDateValue"
          :is-time="true"
          :show="endTimeShow"
          data-cy="779a93d134da1404"
          @click="endTimeShow = true"
          @hide="endTimeShow = false"
          @on-change="onChange($event, 'end', true)"
        />
      </template>

      <BaseTimePicker
        type="HH:mm"
        :time="endTime"
        :start-time="isSameDay ? startTime : null"
        :is-slice="false"
        @on-change="onChange($event, 'end', false)"
      />
    </el-popover>

    <el-popover
      v-if="!isSameDay || allDay"
      v-model:visible="endShow"
      trigger="click"
      :show-arrow="false"
      width="268"
      :teleported="false"
    >
      <template #reference>
        <BaseDateTimeLabel :date="endDateValue" :show="endShow" />
      </template>
      <BaseDatePicker
        v-model="endDateValue"
        :disabled-dates="disabledDates"
        @change="onDateChange"
      />
    </el-popover>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    startDate: [String, Date],
    endDate: [String, Date],
    allDay: {
      type: Boolean,
      default: false,
    },
    disabledDates: {
      type: Array,
      default: () => [{ start: null, end: null }],
    },
  },
  setup() {
    const startRef = ref(null);
    const startTimeShow = ref(false);
    const endRef = ref(null);
    const endTimeShow = ref(false);

    onClickOutside(
      startRef,
      () => {
        startTimeShow.value = false;
      },
      { ignore: ['.el-popper'] },
    );
    onClickOutside(
      endRef,
      () => {
        endTimeShow.value = false;
      },
      { ignore: ['.el-popper'] },
    );
    return { startRef, startTimeShow, endRef, endTimeShow };
  },
  data() {
    return {
      startDateValue: new Date(),
      endDateValue: new Date(),
      startShow: false,
      endShow: false,
      isInit: false,
      isSameDate: false,
      startDateTime: '',
      endDateTime: '',
    };
  },
  computed: {
    startTime() {
      return formatDate(this.startDateValue, 'HH:mm');
    },
    endTime() {
      return formatDate(this.endDateValue, 'HH:mm');
    },
    isSameDay() {
      return dayjs(this.startDateValue).isSame(this.endDateValue, 'day');
    },
  },
  watch: {
    startDate() {
      if (this.startDate) {
        this.startDateValue = this.startDate;
      } else {
        this.startDateValue = dayjs().toDate();
      }
    },
    endDate() {
      if (this.endDate) {
        this.endDateValue = this.endDate;
      } else {
        this.endDateValue = dayjs().toDate();
      }
    },
    startShow(val) {
      if (val) {
        this.isInit = true;
        this.isSameDate = dayjs(this.startDateValue).isSame(
          this.endDateValue,
          'day',
        );
        this.startDateTime = formatDate(this.startDateValue, 'HH:mm');
        this.endDateTime = formatDate(this.endDateValue, 'HH:mm');
      }
    },
    endShow(val) {
      if (val) {
        this.isInit = true;
        this.isSameDate = dayjs(this.startDateValue).isSame(
          this.endDateValue,
          'day',
        );
        this.startDateTime = formatDate(this.startDateValue, 'HH:mm');
        this.endDateTime = formatDate(this.endDateValue, 'HH:mm');
      }
    },
  },
  methods: {
    onDateChange() {
      if (!this.isInit) {
        return;
      }
      if (!this.allDay) {
        const startDate = formatDate(this.startDateValue, 'YYYY-MM-DD');
        const endDate = formatDate(this.endDateValue, 'YYYY-MM-DD');
        this.startDateValue = dayjs(
          `${startDate} ${this.startDateTime}`,
        ).toDate();
        this.endDateValue = dayjs(
          `${this.isSameDate ? startDate : endDate} ${this.endDateTime}`,
        ).toDate();
      } else {
        this.startDateValue = new Date(getZeroTimeZone(this.startDateValue));
        this.endDateValue = new Date(getZeroTimeZone(this.endDateValue));
      }

      if (dayjs(this.endDateValue) < dayjs(this.startDateValue)) {
        const startDateValue = this.startDateValue;
        this.startDateValue = this.endDateValue;
        this.endDateValue = startDateValue;
      }

      this.$emit('change', this.startDateValue, this.endDateValue);
      this.startShow = false;
      this.endShow = false;
    },
    onChange(item, type, show) {
      if (type === 'start') {
        this.startTimeShow = show;
        const date = formatDate(this.startDateValue, 'YYYY-MM-DD');
        this.startDateValue = dayjs(`${date} ${item}`).toDate();
      } else {
        this.endTimeShow = show;
        const isSecondDay = formatDate(this.startDateValue, 'HH:mm') > item;
        const date = formatDate(this.endDateValue, 'YYYY-MM-DD');
        this.isSameDate = dayjs(this.startDateValue).isSame(
          this.endDateValue,
          'day',
        );
        if (isSecondDay && this.isSameDate) {
          this.endDateValue = dayjs(`${date} ${item}`).add(1, 'day').toDate();
        } else {
          this.endDateValue = dayjs(`${date} ${item}`).toDate();
        }
      }

      if (dayjs(this.endDateValue) <= dayjs(this.startDateValue)) {
        if (formatDate(this.startDateValue, 'HH:mm') >= '23:00') {
          this.endDateValue = dayjs(this.startDateValue)
            .set('hour', 23)
            .set('minute', 45)
            .toDate();
        } else {
          this.endDateValue = dayjs(this.startDateValue)
            .add(60, 'minute')
            .toDate();
        }
      } else if (
        formatDate(this.startDateValue, 'HH:mm') ===
          formatDate(this.endDateValue, 'HH:mm') &&
        this.isSameDate
      ) {
        this.endDateValue = dayjs(this.startDateValue)
          .add(15, 'minute')
          .toDate();
      }

      this.$emit('change', this.startDateValue, this.endDateValue);
    },
  },
};
</script>

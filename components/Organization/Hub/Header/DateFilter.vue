<template>
  <div class="flex flex-col gap-4 px-3 py-2">
    <div class="flex gap-7 text-[#D9D9D9]/80">
      <div class="flex w-44 flex-col gap-1.5">
        <div class="mb-1 flex h-9 items-center text-base">
          {{ $t('course.select.period') }}
        </div>

        <div
          v-for="item in times"
          :key="item.type"
          class="flex items-center gap-2 p-1.5"
        >
          <BaseCheckboxStyle
            :state="item.type === type ? 'checked' : 'unchecked'"
            data-cy="46c196a506ee97e2"
            @click="onClick(item.type)"
          />
          {{ $t(item.name) }}
        </div>
      </div>

      <div class="flex w-72 flex-col gap-1.5">
        <div class="flex h-9 w-full items-center justify-between text-base">
          {{ $t('course.select.period') }}
          <i class="fa-solid fa-calendar-days" />
        </div>

        <div class="flex items-center gap-2 py-1">
          <div class="text-base font-medium">
            {{ $t('course.select.from') }}
          </div>
          <div
            class="border-b border-[#D9D9D9]/50 p-2 leading-4 text-[#D9D9D9]/50"
          >
            <span v-if="date.start">
              {{ formatDate(date.start, 'DD/MM/YYYY') }}
            </span>
            <span v-else>
              {{ $t('course.select.placeholder') }}
            </span>
          </div>
          <div class="text-base font-medium">
            {{ $t('course.select.to') }}
          </div>
          <div
            class="border-b border-[#D9D9D9]/50 p-2 leading-4 text-[#D9D9D9]/50"
          >
            <span v-if="date.end">
              {{ formatDate(date.end, 'DD/MM/YYYY') }}
            </span>
            <span v-else>{{ $t('course.select.placeholder') }}</span>
          </div>
        </div>
        <BaseDatePicker
          v-model="date"
          mode="daterange"
          @change="onDateChange"
        />
      </div>
    </div>
    <div class="flex items-center gap-3">
      <BaseButton
        type="secondary"
        class="px-4"
        label="$t:base.upload.cancel"
        data-cy="939dffa6a1175fa7"
        @click="$emit('close')"
      />
      <BaseButton
        icon="fa-solid fa-circle-check"
        class="px-4"
        label="$t:base.upload.apply"
      />
    </div>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  data() {
    return {
      type: null,
      times: [
        {
          type: 1,
          name: 'filter.period.year',
        },
        {
          type: 2,
          name: 'filter.period.month',
        },
        {
          type: 3,
          name: 'filter.period.week',
        },
      ],
      disabledDates: [{ start: null, end: dayjs().subtract(1, 'day') }],
      date: {
        start: null,
        end: null,
      },
    };
  },
  methods: {
    onClick(type) {
      this.type = type;
      switch (type) {
        case 1:
          this.date = {
            start: dayjs().subtract(1, 'year').toDate(),
            end: dayjs().subtract(1, 'day').toDate(),
          };
          break;
        case 2:
          this.date = {
            start: dayjs().subtract(1, 'month').toDate(),
            end: dayjs().subtract(1, 'day').toDate(),
          };
          break;
        case 3:
          this.date = {
            start: dayjs().subtract(1, 'week').toDate(),
            end: dayjs().subtract(1, 'day').toDate(),
          };
          break;
      }
    },
    onDateChange() {},
  },
};
</script>

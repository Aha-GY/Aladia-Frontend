<template>
  <div
    class="flex cursor-pointer items-center justify-between gap-5 rounded-md p-1.5 text-center transition-all hover:bg-white/5"
  >
    <div class="flex w-0 flex-1 items-center gap-2">
      <BaseCourseThumbnail class="h-5 w-8 shrink-0" :url="item.signedUrl" />
      <div class="truncate text-sm">{{ item.title }}</div>
    </div>
    <div class="w-1/3 text-xs text-[#707070]">{{ item.day }}</div>

    <div class="w-10 text-xs text-[#88C359]">
      ${{ moneyFormat(item.totalAmount, 0) }}
    </div>
  </div>
</template>

<script>
import dayJS from 'dayjs';

import locales from '~/constant/en';

const dayjs = dayJS.tz;

const labels = locales.labels;
export default {
  props: {
    item: Object,
  },
  methods: {
    getDate(date) {
      const dayjsDate = dayjs(date);
      return `${dayjsDate.date()} ${labels.monthsLong[dayjsDate.month()]} ${dayjsDate.year()}`;
    },
  },
};
</script>

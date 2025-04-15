<template>
  <div class="px-4" :class="isBefore ? 'pointer-events-none opacity-40' : ''">
    <div class="flex h-6 items-center justify-between">
      <div class="text-xs text-white">
        {{ dateList[2] }} {{ monthLabel }} {{ dateList[0] }}
      </div>
      <div v-if="isToday" class="text-xs font-semibold text-[#E4B53D]">
        OGGI
      </div>
    </div>
    <div
      class="flex gap-1 border-b pb-2"
      :class="isToday ? 'border-[#E4B53D]' : 'border-[#707070]'"
    >
      <div class="h-6 w-6 rounded-md bg-white" />
      <div
        class="group/item relative flex h-6 cursor-pointer items-center justify-between gap-1 overflow-hidden rounded-md border border-transparent px-1"
        :style="{ 'border-color': item.color }"
        data-cy="2a5ed203f20723e9"
        @click.stop="onView(item)"
      >
        <div
          class="absolute left-0 top-0 h-full w-full opacity-30 group-hover/item:opacity-100"
          :style="{ 'background-color': item.color }"
        />
        <div class="z-10 truncate text-sm font-semibold text-[#f1f1f1]">
          {{ item.title }}
        </div>
        <div class="z-10 shrink-0 text-xs text-[#B2B1B1]">
          {{ formatDate(item.startDate, 'HH:mm') }} -
          {{ formatDate(item.endDate, 'HH:mm') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import locales from '~/constant/en';

const labels = locales.labels;
export default {
  props: {
    item: Object,
  },
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore };
  },
  computed: {
    dateList() {
      return this.item.date.split('-');
    },
    nowYear() {
      return new Date().getFullYear();
    },
    nowMonth() {
      return new Date().getMonth();
    },
    nowDay() {
      return new Date().getDate();
    },
    isToday() {
      return (
        this.dateList[0] === this.nowYear &&
        this.dateList[1] === this.nowMonth &&
        this.dateList[2] === this.nowDay
      );
    },
    isBefore() {
      return this.isToday
        ? false
        : new Date(this.dateList[0], this.dateList[1], this.dateList[2]) <
            new Date();
    },
    monthLabel() {
      return labels.monthsLong[this.dateList[1]];
    },
  },
  methods: {
    onView(entry) {
      this.hubCalendarStore.create(entry);
    },
  },
};
</script>

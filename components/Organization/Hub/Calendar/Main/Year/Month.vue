<template>
  <div class="flex flex-col items-center justify-center gap-1 py-1.5">
    <div
      class="group relative flex h-8 w-[15.875rem] cursor-pointer items-center justify-center p-1 text-lg"
      :class="isSameMonth(month) ? 'text-[#e4b53d]' : 'text-white'"
      data-cy="aecc7ad281db8961"
      @click="onOpenMonth(month)"
    >
      {{ getMonthLabel(month) }}
      <div
        class="bg-gradient-top absolute bottom-0 left-1/2 h-[1px] w-1/3 -translate-x-1/2 opacity-0 transition-all group-hover:opacity-100"
      />
    </div>
    <div class="flex items-center justify-center gap-1.5">
      <div
        v-for="item in weekList"
        :key="item"
        class="flex h-4 w-7 items-center justify-center rounded-md text-13 font-semibold leading-none text-[#707070]"
      >
        {{ $t(item) }}
      </div>
    </div>
    <div class="mx-auto grid max-w-[15rem] grid-cols-7 grid-rows-6 gap-1.5">
      <OrganizationHubCalendarMainYearItem
        v-for="(item, index) in dayList"
        :key="index"
        :item="item"
        :month="month"
      />
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
    month: Number,
  },
  setup() {
    const main = ref(null);
    const { width } = useElementSize(main);
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore, main, width };
  },
  data() {
    return {
      weekList: [
        'index.week.short.sun',
        'index.week.short.mon',
        'index.week.short.tue',
        'index.week.short.wed',
        'index.week.short.thu',
        'index.week.short.fri',
        'index.week.short.sat',
      ],
      dayList: [],
    };
  },
  computed: {
    initDate() {
      return this.hubCalendarStore.initDate;
    },
    entryDataList() {
      return this.hubCalendarStore.filterEntryDataList;
    },
  },
  watch: {
    initDate() {
      this.daysInMonth(this.month);
    },
  },
  mounted() {
    this.daysInMonth(this.month);
  },
  methods: {
    isSameMonth(month) {
      return dayjs(this.initDate).month() === month;
    },
    getMonthLabel(month) {
      return dayjs().month(month).format('MMMM');
    },
    daysInMonth(oldMonth) {
      const date = dayjs(this.initDate).set('month', oldMonth);
      const dayList = getDaysInMonth(date);
      const len = dayList.length;
      const List = [];
      const entryObj = this.getEntryListObj();
      const entryKeys = Object.keys(entryObj);
      for (let i = 0; i < len; i++) {
        const dateString = formatDate(dayList[i], 'YYYY-MM-DD');
        List.push({
          date: dayList[i],
          entry: entryKeys.includes(dateString) ? entryObj[dateString] : [],
        });
      }
      this.dayList = List;
    },
    getEntryListObj() {
      const obj = {};
      this.entryDataList.forEach((entry) => {
        const dateList = generateDateArray(
          entry.dates.startDate,
          entry.dates.endDate,
        );
        if (dateList) {
          const diff = dayjs(entry.endDate).diff(
            dayjs(entry.startDate),
            'minute',
          );

          entry.isAll = diff % 1440 === 0;
          dateList.forEach((date) => {
            if (!obj[date]) {
              obj[date] = [];
            }
            obj[date].push(entry);
          });
        }
      });

      return obj;
    },
    onOpenMonth(month) {
      this.hubCalendarStore.dateTypeIndex = 2;
      this.hubCalendarStore.initDate = dayjs(this.initDate)
        .set('month', month)
        .toDate();
    },
  },
};
</script>

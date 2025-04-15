<template>
  <div
    ref="main"
    class="transition--left flex h-full w-full flex-col gap-2 overflow-y-auto rounded-md p-2"
  >
    <div
      v-for="(item, index) in daysInMonth"
      :key="index"
      class="flex items-start gap-8"
      :class="item.isShow ? 'border-t border-[#212121] pt-2' : ''"
    >
      <div class="w-16 py-2 text-center text-white">
        <div
          class="cursor-pointer text-lg font-bold leading-none"
          data-cy="6f08856464ead2d1"
          @click="onOpenDay(item.date)"
        >
          {{ formatDate(item.date, 'DD') }}
        </div>
        <div class="text-base">{{ formatDate(item.date, 'MMM') }}</div>
      </div>
      <div class="flex w-0 flex-1 flex-col gap-2">
        <OrganizationHubCalendarMainListItem
          v-for="entry in item.entry"
          :key="entry.id"
          :entry="entry"
          data-cy="8550fed91be8c8d0"
          @click.stop="onView(entry)"
        />
      </div>
    </div>
    <div
      v-if="!daysInMonth.length"
      class="flex items-start border-b border-[#212121]"
    >
      <div class="w-16 py-2 text-center text-white">
        <div
          class="cursor-pointer text-lg font-bold leading-none"
          data-cy="7ab0754400936798"
          @click="onOpenDay(initDate)"
        >
          {{ formatDate(initDate, 'DD') }}
        </div>
        <div class="text-base">{{ formatDate(initDate, 'MMM') }}</div>
      </div>
    </div>
    <div
      v-if="!daysInMonth.length"
      class="flex h-full flex-col items-center justify-center gap-5"
    >
      <BaseSvgEmpty v-if="!daysInMonth.length" />
      <div class="text-base text-[#555]">
        {{ $t('org.hub.analytics.event.none') }} `
        <span class="text-[#9C802D]">
          {{ formatDate(initDate, 'DD') }},
          {{ formatDate(initDate, 'MMMM') }}
        </span>
        `.
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
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore };
  },
  computed: {
    initDate() {
      return this.hubCalendarStore.initDate;
    },
    entryDataList() {
      return this.hubCalendarStore.filterEntryDataList;
    },
    daysInMonth() {
      const dayList = [];
      let date = dayjs(this.initDate).startOf('month');
      while (date.month() === dayjs(this.initDate).month()) {
        dayList.push(date.toDate());
        date = date.add(1, 'day');
      }
      const len = dayList.length;
      const List = [];
      let month = dayjs(dayList[0]).month();
      const entryObj = this.getEntryListObj();
      const entryKeys = Object.keys(entryObj);
      for (let i = 0; i < len; i++) {
        const dateString = formatDate(dayList[i], 'YYYY-MM-DD');
        const entryList = entryKeys.includes(dateString)
          ? entryObj[dateString]
          : [];
        if (entryList.length) {
          List.push({
            date: dayList[i],
            entry: entryList,
            isShow: month !== dayjs(dayList[i]).month(),
          });
          if (month !== dayjs(dayList[i]).month()) {
            month = dayjs(dayList[i]).month();
          }
        }
      }
      return List;
    },
  },
  watch: {
    initDate() {
      this.onLoad();
    },
  },
  mounted() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.hubCalendarStore.startDateTime = dayjs(this.initDate)
        .startOf('year')
        .toISOString();
      this.hubCalendarStore.endDateTime = dayjs(this.initDate)
        .endOf('year')
        .toISOString();
    },
    onOpenDay(date) {
      this.hubCalendarStore.dateTypeIndex = 0;
      this.hubCalendarStore.initDate = new Date(date);
    },
    onView(entry) {
      if (entry.id === 'create') {
        return;
      }
      if (entry.isPersonal) {
        return;
      }
      this.hubCalendarStore.create(entry);
    },
    getEntryList(date) {
      const events = [];
      const len = this.entryDataList.length;
      for (let i = 0; i < len; i++) {
        const entry = this.entryDataList[i];
        if (
          dayjs(date).isBetween(
            dayjs(entry.startDate).startOf('day'),
            dayjs(entry.endDate),
            null,
            '[]',
          )
        ) {
          const diff = dayjs(entry.endDate).diff(
            dayjs(entry.startDate),
            'minute',
          );
          if (diff >= 23 * 60 + 45) {
            entry.isAll = true;
          }
          events.push(entry);
        }
      }
      return events;
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
    isSameMonth(date) {
      return dayjs(this.initDate).isSame(dayjs(date), 'month');
    },
  },
};
</script>

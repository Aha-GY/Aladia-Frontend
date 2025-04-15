<template>
  <div class="transition--left flex h-full w-full flex-col">
    <OrganizationHubCalendarMainWeekContent :events="allList" />
    <div
      ref="main"
      class="hide-scrollbar w-full flex-1 overflow-y-auto overscroll-none"
    >
      <div class="flex h-3 w-full">
        <div class="w-12" />
        <div class="flex-1 bg-[#181a1b]" />
      </div>
      <div class="flex">
        <div class="h-[75rem] w-12">
          <div
            v-for="(item, index) in times"
            :key="index"
            class="h-[3.125rem] text-center text-xs text-[#707070]"
            :class="index === 0 ? '-translate-y-1.5' : '-translate-y-3'"
          >
            {{ item }}
          </div>
        </div>
        <div
          class="bg-line relative grid h-[75rem] flex-1 grid-cols-7 bg-[#181a1b]"
        >
          <OrganizationHubCalendarMainWeekEvents
            v-for="(item, index) in 7"
            :key="item"
            :data-column-index="index"
            :data="weekEntrys[index]"
            :calendars="calendarList[index]"
            :schedules="scheduleList[index]"
            :unavailable="unavailables.includes(index)"
            :week-list="weekList"
            :scroll-top="scrollTop"
            @on-move="onMove"
          />
          <OrganizationHubCalendarMainNow />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayJS from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayJS.extend(customParseFormat);
const dayjs = dayJS.tz;

export default {
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCalendarStore, hubSidebar };
  },
  data() {
    return {
      scrollTop: 0,
      moveKey: false,
      timer: null,
      allList: [],
      entryList: [],
      weekEntrys: [[], [], [], [], [], [], []],
      weeks: [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ],
    };
  },
  computed: {
    initDate() {
      return this.hubCalendarStore.initDate;
    },
    times() {
      return getTimesInDay();
    },
    entryDataList() {
      return this.hubCalendarStore.filterEntryDataList;
    },
    unavailables() {
      const detail = cloneDeep(this.hubSidebar?.calendar?.data || {});
      const list = [];
      for (const key in detail.scheduling) {
        if (!detail.scheduling[key][0]) {
          list.push(this.weeks.indexOf(key));
        }
      }
      return list;
    },
    scheduleList() {
      const List = [[], [], [], [], [], [], []];
      const detail = cloneDeep(this.hubSidebar?.calendar?.data || {});
      for (const key in detail.scheduling) {
        if (!detail.scheduling[key][0]) {
          continue;
        }

        const { listPrev, list, listNext } = this.onHandleScheduleList(
          detail.scheduling[key],
          detail.timezone,
        );
        if (listPrev.length) {
          const index = this.weeks.indexOf(key) - 1;
          List[index < 0 ? 6 : index].push(...listPrev);
        }
        if (listNext.length) {
          const index = this.weeks.indexOf(key) + 1;
          List[index > 6 ? 0 : index].push(...listNext);
        }
        List[this.weeks.indexOf(key)].push(...list);
      }
      return List;
    },
    calendarList() {
      const CalendarList = cloneDeep(
        this.hubCalendarStore.selectedCalendars,
      ).filter((r) => !r.entity && r.schedule);
      const List = [[], [], [], [], [], [], []];
      CalendarList.map((r) => {
        for (const key in r.schedule) {
          if (!r.schedule[key][0]) {
            continue;
          }
          const { listPrev, list, listNext } = this.onHandleScheduleList(
            r.schedule[key],
            r.timezone,
          );
          if (listPrev.length) {
            const index = this.weeks.indexOf(key) - 1;
            const prevR = cloneDeep(r);
            prevR.dates = listPrev;
            List[index < 0 ? 6 : index].push(prevR);
          }
          if (listNext.length) {
            const index = this.weeks.indexOf(key) + 1;
            const nextR = cloneDeep(r);
            nextR.dates = listNext;
            List[index > 6 ? 0 : index].push(nextR);
          }
          // r.dates = r.schedule[key];
          r.dates = list;
          if (r.dates) {
            List[this.weeks.indexOf(key)].push(cloneDeep(r));
          }
        }
        return r;
      });
      return List;
    },
    weekList() {
      return getWeekArray(this.initDate);
    },
  },
  watch: {
    initDate() {
      this.onLoad();
    },
    entryDataList: {
      handler() {
        this.getEntryList();
      },
      deep: true,
      immediate: true,
    },
    'hubCalendarStore.dateRange': {
      handler() {
        this.getEntryList();
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.onLoad();
    this.onInit();
    this.$refs.main.addEventListener('scroll', this.onScroll);
  },
  beforeUnmount() {
    this.$refs.main.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onLoad() {
      this.hubCalendarStore.startDateTime = dayjs(
        this.weekList[0],
      ).toISOString();
      this.hubCalendarStore.endDateTime = dayjs(this.weekList[6]).toISOString();
    },
    onInit() {
      const startTimeList = this.entryList.map((r) =>
        dayjs(r.startDate).hour(),
      );
      startTimeList.sort((a, b) => a - b);
      const Num = startTimeList[0];
      if (Num) {
        this.$refs.main.scrollTo({
          top: (Num - 1) * 50,
          behavior: `instant`,
        });
      }
    },
    getEntryList() {
      this.entryList = [];
      this.allList = [];
      this.entryDataList.map((entry) => {
        if (
          dayjs(entry.startDate) <= dayjs(this.weekList[6]) &&
          dayjs(this.weekList[0]) <= dayjs(entry.endDate)
        ) {
          // const diff = dayjs(entry.endDate).diff(
          //   dayjs(entry.startDate),
          //   'minute',
          // );
          // const startDate = formatDate(entry.startDate, 'YYYY-MM-DD');
          // const endDate = formatDate(entry.endDate, 'YYYY-MM-DD');
          const diff = dayjs(entry.endDate).diff(
            dayjs(entry.startDate),
            'minute',
          );
          // const diffDay = dayjs(entry.endDate).diff(
          //   dayjs(entry.startDate),
          //   'day',
          // );
          if (diff % 1440 === 0 || diff > 1440) {
            entry.isAll = diff % 1440 === 0;
            this.allList.push(entry);
          } else {
            this.entryList.push(entry);
          }
        }
      });
      this.weekEntrys = [[], [], [], [], [], [], []];
      this.entryList.map((r) => {
        // const index = dayjs(r.startDate).day();
        const dateList = generateDateArray(r.dates.startDate, r.dates.endDate);
        dateList.map((date) => {
          if (dayjs(date).startOf('day').isSame(dayjs(r.endDate), 'minute')) {
            return;
          }
          const index = dayjs(date).day();
          if (this.weekEntrys[index]) {
            this.weekEntrys[index].push(r);
          } else {
            this.weekEntrys[index] = [r];
          }
        });
      });
    },
    onScroll(e) {
      this.scrollTop = e.target.scrollTop;
    },
    onMove(clientY) {
      if (!clientY) {
        this.timer && clearTimeout(this.timer);
        this.moveKey = false;
        return;
      }
      const main = this.$refs.main.getBoundingClientRect();
      const scrollTop = this.$refs.main.scrollTop;
      if (clientY < main.top + 20 && scrollTop > 0) {
        if (!this.moveKey) {
          this.moveKey = true;
          this.timer && clearTimeout(this.timer);
          let spaceNum = 0;
          this.timer = setInterval(() => {
            const nowScrollTop = this.$refs.main.scrollTop;
            spaceNum += 50;
            let top = nowScrollTop - spaceNum;
            if (top > 1212 - main.height) {
              this.timer && clearTimeout(this.timer);
              this.moveKey = false;
              top = 0;
            }
            this.$refs.main.scrollTo({
              top,
              behavior: `smooth`,
            });
          }, 100);
        }
      } else if (
        clientY > main.top + main.height - 20 &&
        scrollTop < 1212 - main.height
      ) {
        if (!this.moveKey) {
          this.moveKey = true;
          this.timer && clearTimeout(this.timer);
          let spaceNum = 0;
          this.timer = setInterval(() => {
            const nowScrollTop = this.$refs.main.scrollTop;
            spaceNum += 50;
            let top = nowScrollTop + spaceNum;
            if (top > 1212 - main.height) {
              this.timer && clearTimeout(this.timer);
              this.moveKey = false;
              top = 1212 - main.height;
            }

            this.$refs.main.scrollTo({
              top,
              behavior: `smooth`,
            });
          }, 100);
        }
      } else {
        this.timer && clearTimeout(this.timer);
        this.moveKey = false;
      }
    },
    onCalendarList(index) {
      return cloneDeep(this.calendarAndschedules)
        .map((r) => {
          r.dates = r[index];
          return r;
        })
        .filter((r) => r.dates);
    },
    onHandleScheduleList(array, timezone) {
      let diffHour = 0;
      if (timezone) {
        const myTimezone = timezone?.trim()?.match(/^([\w/]+)/);
        diffHour =
          getTimeZoneDifference(myTimezone ? myTimezone[0] : null) / 60;
      }
      const listPrev = [];
      const listNext = [];
      const list = [];
      array.map((obj) => {
        if (diffHour < 0) {
          const startTime = dayJS(obj.startTime, 'HH:mm')
            .add(Math.abs(diffHour), 'hour')
            .format('HH:mm');
          const endTime = dayJS(obj.endTime, 'HH:mm')
            .add(Math.abs(diffHour), 'hour')
            .format('HH:mm');
          if (endTime < startTime) {
            list.push({
              startTime,
              endTime: '23:59',
              color: obj.color,
            });
            listNext.push({
              startTime: '00:00',
              endTime,
              color: obj.color,
            });
          } else {
            list.push({
              startTime,
              endTime,
              color: obj.color,
            });
          }
        } else {
          const startTime = dayJS(obj.startTime, 'HH:mm')
            .subtract(diffHour, 'hour')
            .format('HH:mm');
          const endTime = dayJS(obj.endTime, 'HH:mm')
            .subtract(diffHour, 'hour')
            .format('HH:mm');
          if (endTime < startTime) {
            listPrev.push({
              startTime,
              endTime: '23:59',
              color: obj.color,
            });
            list.push({
              startTime: '00:00',
              endTime,
              color: obj.color,
            });
          } else {
            list.push({
              startTime,
              endTime,
              color: obj.color,
            });
          }
        }
      });
      return {
        listPrev,
        list,
        listNext,
      };
    },
  },
};
</script>
<style scoped>
.bg-line {
  background-size: calc(100% / 7) 4.166%;
  background-image: linear-gradient(
    to bottom,
    #393d41 0.0625rem,
    transparent 0.0625rem
  );
}
</style>

<template>
  <div ref="main" class="transition--left flex h-full w-full flex-col">
    <div class="relative flex rounded-t-md bg-[#060606]">
      <div
        v-for="item in weekList"
        :key="item"
        class="flex h-8 flex-1 items-center justify-center text-sm font-semibold text-white"
      >
        {{ $t(item) }}
      </div>
      <div class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-full" />
    </div>

    <div
      ref="box"
      class="hide-scrollbar -ml-4 flex flex-1 shrink-0 flex-col overflow-y-auto overscroll-none pl-4"
    >
      <div
        v-for="(rowIndex, row) in 6"
        :key="rowIndex"
        class="relative h-0 min-h-[9.875rem] flex-1"
      >
        <div class="absolute inset-0 grid h-full grid-cols-7">
          <div
            v-for="(item, index) in daysInMonth.slice(row * 7, 7 * rowIndex)"
            :key="index"
            class="month--day group flex select-none flex-col border-b border-l border-[#565656] transition-all hover:bg-[#181a1b]/50"
            :class="isSameMonth(item.date) ? 'bg-[#181a1b]' : 'bg-[#181a1b]/60'"
            :data-date="dataDateFormat(item.date)"
            :data-cy="`${dataDateFormat(item.date)}-selected-date`"
            @click.stop="onCreate($event, item, index)"
          >
            <div
              class="flex h-5 cursor-pointer items-center justify-center text-xs transition-all hover:bg-[#424242] hover:font-semibold hover:text-white active:scale-95"
              :class="[
                isToday(item.date)
                  ? 'text-[#e4b53d]'
                  : isSameday(item.date)
                    ? 'bg-[#424242] font-semibold text-white'
                    : 'text-[#BABABA]',
                isSameMonth(item.date) ? '' : 'opacity-60',
              ]"
              data-cy="c66157fd9a0470d0"
              @click.stop="onOpenDay(item.date)"
            >
              {{ dayFormat(item.date) }}
            </div>
            <OrganizationHubCalendarMainMonthBox
              :data="item.entry"
              :date="item.date"
              :data-column-index="index"
              @on-move="onMove"
            />
            <div
              v-if="
                hubCalendarStore.isDarg &&
                hubCalendarStore.dargItems.dataDate ===
                  dataDateFormat(item.date)
              "
              class="absolute top-0 h-full bg-black/20 px-1 pt-6"
              :style="{
                width: `${100 / 7}%`,
                left: `${(100 * index) / 7}%`,
              }"
            />
          </div>
        </div>
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
    const { width } = useWindowSize();
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore, width };
  },
  data() {
    return {
      weekList: [
        'index.week.sun',
        'index.week.mon',
        'index.week.tue',
        'index.week.wed',
        'index.week.thu',
        'index.week.fri',
        'index.week.sat',
      ],
      moveKey: false,
      timer: null,
    };
  },
  computed: {
    initDate() {
      return this.hubCalendarStore.initDate;
    },
    entryDataList() {
      const list = cloneDeep(this.hubCalendarStore.filterEntryDataList);

      list.sort(
        (a, b) =>
          b.endDate.getTime() -
          b.startDate.getTime() -
          (a.endDate.getTime() - a.startDate.getTime()),
      );

      list.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

      list.map((r) => {
        r.level = null;
      });
      return list;
    },
    daysInMonth() {
      const dayList = getDaysInMonth(this.initDate);
      const len = dayList.length;
      const List = [];
      const entryObj = this.getEntryListObj();
      const entryKeys = Object.keys(entryObj);
      for (let i = 0; i < len; i++) {
        // const entryList = this.getEntryList2(dayList[i]);
        const dateString = formatDate(dayList[i], 'YYYY-MM-DD');
        List.push({
          date: dayList[i],
          entry: this.onEventsStyle(
            cloneDeep(
              entryKeys.includes(dateString) ? entryObj[dateString] : [],
            ),
            dayList[i],
          ),
        });
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
      this.hubCalendarStore.startDateTime = dayjs(
        this.daysInMonth[0].date,
      ).toISOString();
      this.hubCalendarStore.endDateTime = dayjs(
        this.daysInMonth[41].date,
      ).toISOString();
    },
    onMove(clientY) {
      if (!clientY) {
        this.timer && clearTimeout(this.timer);
        this.moveKey = false;
        return;
      }
      const box = this.$refs.box.getBoundingClientRect();
      const scrollTop = this.$refs.box.scrollTop;
      if (clientY < box.top + 20 && scrollTop > 0) {
        if (!this.moveKey) {
          this.moveKey = true;
          this.timer && clearTimeout(this.timer);
          let spaceNum = 0;
          this.timer = setInterval(() => {
            const nowScrollTop = this.$refs.box.scrollTop;
            spaceNum += 50;
            let top = nowScrollTop - spaceNum;
            if (top > 1212 - box.height) {
              this.timer && clearTimeout(this.timer);
              this.moveKey = false;
              top = 0;
            }
            this.$refs.box.scrollTo({
              top,
              behavior: `smooth`,
            });
          }, 100);
        }
      } else if (
        clientY > box.top + box.height - 20 &&
        scrollTop < 1212 - box.height
      ) {
        if (!this.moveKey) {
          this.moveKey = true;
          this.timer && clearTimeout(this.timer);
          let spaceNum = 0;
          this.timer = setInterval(() => {
            const nowScrollTop = this.$refs.box.scrollTop;
            spaceNum += 50;
            let top = nowScrollTop + spaceNum;
            if (top > 1212 - box.height) {
              this.timer && clearTimeout(this.timer);
              this.moveKey = false;
              top = 1212 - box.height;
            }

            this.$refs.box.scrollTo({
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
    onOpenDay(date) {
      this.hubCalendarStore.dateTypeIndex = 0;
      this.hubCalendarStore.initDate = new Date(date);
    },
    onCreate(event, item, index) {
      const rect = event.target.getBoundingClientRect();
      let x = 0;
      if (event.pageX > this.width / 2) {
        x = rect.left - 448 - 10;
      } else {
        x = rect.left + rect.width + 10;
      }
      const clientX = rect.left - rect.width * index;
      this.onCreateStyle(x, event.pageY, rect.width, clientX, index);

      this.hubCalendarStore.createDate = dayjs(item.date)
        .set('hour', dayjs().hour())
        .set('minute', dayjs().minute())
        .toDate();

      this.hubCalendarStore.create();
    },
    onCreateStyle(x, y, width, clientX, index) {
      this.hubCalendarStore.createStyle.left = x;
      this.hubCalendarStore.createStyle.top = y;
      this.hubCalendarStore.createStyle.width = width;
      this.hubCalendarStore.createStyle.clientX = clientX;
      this.hubCalendarStore.createStyle.index = index;
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
          dateList.forEach((date, index) => {
            if (diff < 1440 && index === 1) {
              return;
            }
            if (!obj[date]) {
              obj[date] = [];
            }
            const levels = obj[date].map((r) => r.level);
            if (!entry.level) {
              let level = 0;
              while (levels.includes(level) && level < 6) {
                level++;
              }
              entry.level = level;
            }
            obj[date].push(entry);
          });
        }
      });

      return cloneDeep(obj);
    },
    onEventsStyle(events, date) {
      return events.map((event) => {
        const dayOfWeek = dayjs(date).day();
        const diff = dayjs(event.endDate).diff(
          dayjs(event.startDate),
          'minute',
        );
        event.isAll = diff % 1440 === 0;

        let widthIndex = 0;
        if (dayOfWeek === 0 && event.isAll) {
          widthIndex =
            dayjs(event.endDate).startOf('day').diff(dayjs(date), 'day') + 1;
        } else {
          widthIndex =
            dayjs(event.endDate).diff(dayjs(event.startDate), 'day') + 1;
        }

        if (widthIndex + dayOfWeek > 7) {
          widthIndex = 7 - dayOfWeek;
        }
        const isSameDay = dayjs(event.startDate)
          .startOf('day')
          .isSame(dayjs(date).startOf('day'));
        if (isSameDay || (dayOfWeek === 0 && event.isAll)) {
          event.isShow = true;
          if (dayjs(event.startDate).isBefore(dayjs(date)) && dayOfWeek === 0) {
            event.leftRounded = true;
          }

          if (
            dayjs(event.endDate).isAfter(dayjs(date).add(7 - dayOfWeek, 'day'))
          ) {
            event.rightRounded = true;
          }
        } else {
          event.isShow = false;
          widthIndex = 1;
        }

        event.widthIndex = widthIndex;
        event.leftIndex = dayOfWeek;
        return event;
      });
    },
    isToday(date) {
      return dayjs().isSame(dayjs(date), 'day');
    },
    isSameday(date) {
      return dayjs(this.initDate).isSame(dayjs(date), 'day');
    },
    isSameMonth(date) {
      return dayjs(this.initDate).isSame(dayjs(date), 'month');
    },
    dataDateFormat(date) {
      return formatDate(date, 'YYYY-MM-DD');
    },
    dayFormat(date) {
      const day = dayjs(date).date();
      return day === 1 ? formatDate(date, 'MMM DD') : formatDate(date, 'DD');
    },
    titleFormat(date) {
      return formatDate(date, 'DD MMMM');
    },
  },
};
</script>

<template>
  <div
    ref="main"
    class="relative flex h-full border-l border-[#393d41]"
    :class="isDay ? 'pr-5' : 'pr-2.5'"
    data-cy="3f729037bded4e6e"
    @click="onCreate"
  >
    <OrganizationHubCalendarMainWeekScheduleItem
      v-for="(item, index) in filterScheduleList"
      :key="index"
      :item="item"
      :is-hide="isHideIndexes.includes(index)"
    />
    <div
      v-for="(item, index) in unavailableList"
      :key="index"
      class="absolute left-0 top-0 w-full bg-black/40"
      :style="{
        top: item.top + 'px',
        height: item.height + 'px',
      }"
    />
    <div class="relative z-10 h-full w-full">
      <div
        v-for="(item, index) in list"
        :key="item.id"
        class="relative"
        :style="{
          marginLeft: `${item._left}px`,
          width: `calc(100% - ${item._left}px)`,
        }"
      >
        <div
          :ref="
            (el) => {
              if (el) itemRefs[index] = el;
            }
          "
          class="group/item absolute z-10 flex cursor-pointer select-none overflow-hidden rounded-md border border-[#212121] transition-all hover:brightness-75"
          :class="[
            checkedId === item.id
              ? '!z-[5000] shadow-[0px_6px_10px_0px_rgba(0,0,0,.14),0px_1px_18px_0px_rgba(0,0,0,.12),0px_3px_5px_-1px_rgba(0,0,0,.2)] brightness-75'
              : '',
            dargWeekEntry.id === item.id ? 'opacity-50' : '',
            personalMembersClass(item),
            filterMembersClass(item),
          ]"
          :style="{
            top: item.top + 'px',
            height: item.height + 'px',
            left: `calc(100% * ${item.left})`,
            width: `calc((100%) * ${item.width})`,
            'background-color': item.color,
            'z-index': item.Zindex,
          }"
          @click.stop="onView($event, item)"
          @mousedown="onDragMousedown($event, item)"
          @touchstart.stop="onTouchstart($event, item)"
          @touchmove.stop="onTouchmove"
          @touchend.stop="onMouseup"
        >
          <OrganizationHubCalendarMainWeekItem
            :max-width="maxWidth"
            :entry="item"
          />
          <div
            v-if="item.isEndSameDay"
            class="absolute bottom-0 left-0 z-10 h-1/2 max-h-2 w-full cursor-s-resize"
            @mousedown="onRisizeMousedown($event, item)"
          />
        </div>
      </div>
    </div>
    <div
      v-if="isSameId && hubCalendarStore.isMove"
      class="absolute left-0 z-[99] flex w-full select-none overflow-hidden rounded-md shadow-[0px_6px_10px_0px_rgba(0,0,0,.14),0px_1px_18px_0px_rgba(0,0,0,.12),0px_3px_5px_-1px_rgba(0,0,0,.2)]"
      :class="[
        isDrag ? 'cursor-move' : 'cursor-s-resize',
        dargEntry.translateX + dataColumnIndex < 0 ||
        dargEntry.translateX + dataColumnIndex > 6
          ? 'opacity-0'
          : '',
      ]"
      :style="{
        top: dargEntry.top + 'px',
        height: dargEntry.height + 'px',
        'background-color': dargEntry.color,
        transform: `translateX(${
          dargEntry.translateX ? dargEntry.translateX * 100 : 0
        }%)`,
      }"
    >
      <OrganizationHubCalendarMainWeekItem
        :entry="dargEntry"
        :max-width="maxWidth"
      />
    </div>
  </div>
</template>
<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    data: Array,
    schedules: Array,
    calendars: Array,
    weekList: Array,
    dataColumnIndex: Number,
    isDay: Boolean,
    scrollTop: [Number, String],
    unavailable: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    const hubEventStore = useHubEventStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCalendarStore, hubEventStore, hubSidebar };
  },
  data() {
    return {
      checkedId: null,
      entry: {},
      initEntry: {},
      entryId: null,
      timer: null,
      isMouse: false,
      isMove: false,
      isResizeDrag: false,
      isDrag: false,
      point: {},
      maxWidth: 0,
      itemRefs: [],
      eventObj: null,
      isHideIndexes: [],
    };
  },
  computed: {
    filterEventIds() {
      return this.hubCalendarStore.filterEvents.map((r) => r.id);
    },
    members() {
      return this.hubCalendarStore.members;
    },
    isEditCalendar() {
      return this.hubSidebar.calendar?.data?.id;
    },
    scheduleList() {
      return this.schedules.map((r) => {
        const Today = dayjs().format('YYYY-MM-DD');
        const startDate = dayjs(`${Today} ${r.startTime}`);
        const endDate = dayjs(`${Today} ${r.endTime}`);
        r.start =
          (Number(startDate.hour()) + Number(startDate.minute() / 60)) * 50;
        r.end = (Number(endDate.hour()) + Number(endDate.minute() / 60)) * 50;
        r.height = r.end - r.start;
        r.top = r.start;
        r.color = this.hubSidebar?.calendar?.data.color;
        return r;
      });
    },
    calendarList() {
      const calendars = this.calendars.map((item) => {
        item.dates = item.dates.map((r) => {
          const Today = dayjs().format('YYYY-MM-DD');
          const startDate = dayjs(`${Today} ${r.startTime}`);
          const endDate = dayjs(`${Today} ${r.endTime}`);
          r.start =
            (Number(startDate.hour()) + Number(startDate.minute() / 60)) * 50;
          r.end = (Number(endDate.hour()) + Number(endDate.minute() / 60)) * 50;
          r.height = r.end - r.start;
          r.top = r.start;
          r.color = item.color;
          r.name = item.name;
          r.time = formatDate(startDate, 'h:mma');
          return r;
        });
        return item.dates;
      });
      return this.hubSidebar?.calendar?.data?.id
        ? []
        : calendars.flat().sort((a, b) => a.start - b.start);
    },
    filterScheduleList() {
      const scheduleList = this.isEditCalendar
        ? this.scheduleList
        : this.calendarList;
      scheduleList.forEach((item, index) => {
        const items = scheduleList.slice(0, index);
        let num = 0;
        let _index = null;
        items.forEach((res) => {
          const isStart = res.start <= item.start && res.end > item.start;
          const isEnd = res.start <= item.end && res.end >= item.end;

          if (isStart || isEnd) {
            num++;
          } else if (_index === null) {
            _index = res.left / 20;
          }
          if (res.start + 25 > item.start) {
            res.isAlHide = true;
          }
        });
        if (_index !== null) {
          item.left = 20 * _index;
          this.isHideIndexes.push(index);
        } else {
          item.left = 20 * num;
        }
      });
      return scheduleList;
    },
    unavailableList() {
      const list = [];
      const totalHeight = 1200;
      let previousBottom = 0;

      this.filterScheduleList.forEach((item) => {
        if (item.top > previousBottom) {
          list.push({
            top: previousBottom,
            height: item.top - previousBottom,
          });
        }
        previousBottom = item.top + item.height;
      });

      if ((previousBottom < totalHeight && list.length) || this.unavailable) {
        list.push({
          top: previousBottom,
          height: totalHeight - previousBottom,
        });
      }
      return this.isEditCalendar ? list : [];
    },
    dataList() {
      return cloneDeep(this.data);
    },
    list() {
      const List = this.dataList.map((entry) => {
        const isStartSameDay =
          dayjs(entry.startDate).day() === this.dataColumnIndex;
        const isEndSameDay =
          dayjs(entry.endDate).day() === this.dataColumnIndex;

        const startDate = isStartSameDay
          ? dayjs(entry.startDate)
          : dayjs().startOf('day');
        const endDate = isEndSameDay
          ? dayjs(entry.endDate)
          : dayjs().endOf('day');

        entry.isEndSameDay = isEndSameDay;

        entry.start =
          (Number(startDate.hour()) + Number(startDate.minute() / 60)) * 50;
        entry.end =
          (Number(endDate.hour()) + Number(endDate.minute() / 60)) * 50;

        entry.height = entry.end - entry.start;
        entry.left = 0;
        entry.width = 1;
        entry.Zindex = 4;
        entry.top = entry.start;
        entry._left = 0;
        this.handleAddLeft(entry);
        // this.calendarList.map((item) => {
        //   this.handleAddLeft(item.dates, entry);
        // });
        entry.startDateTime = entry.startDate.getTime();
        entry.endDateTime = entry.endDate.getTime();
        return entry;
      });
      List.sort(
        (a, b) => a.start - b.start || (a.start === b.start && b.end - a.end),
      );
      return getStyledEvents(List, 12.5);
    },
    dargWeekEntry() {
      return this.hubCalendarStore.dargWeekEntry;
    },
    dargEntry() {
      const entry = cloneDeep(this.dargWeekEntry);
      if (!entry.id) {
        return {};
      }
      let startDateDayjs = dayjs(entry.startDate);
      let endDateDayjs = dayjs(entry.endDate);
      if (entry.offset > 0) {
        startDateDayjs = startDateDayjs.add(entry.offset, 'minute');
        endDateDayjs = endDateDayjs.add(entry.offset, 'minute');
      } else if (entry.offset < 0) {
        startDateDayjs = startDateDayjs.subtract(
          Math.abs(entry.offset),
          'minute',
        );
        endDateDayjs = endDateDayjs.subtract(Math.abs(entry.offset), 'minute');
      }
      if (entry.addOffset > 0) {
        endDateDayjs = endDateDayjs.add(entry.addOffset, 'minute');
      } else if (entry.addOffset < 0) {
        endDateDayjs = endDateDayjs.subtract(
          Math.abs(entry.addOffset),
          'minute',
        );
      }

      const isSameDay = dayjs(entry.startDate).isSame(
        dayjs(entry.endDate),
        'day',
      );

      const isStartSameDay =
        dayjs(startDateDayjs).day() === this.dataColumnIndex;
      const isEndSameDay = dayjs(endDateDayjs).day() === this.dataColumnIndex;

      const startDate = isStartSameDay
        ? dayjs(startDateDayjs)
        : dayjs().startOf('day');
      const endDate = isEndSameDay ? dayjs(endDateDayjs) : dayjs().endOf('day');
      entry.start =
        !isSameDay && isStartSameDay === isEndSameDay && !isEndSameDay
          ? 0
          : (Number(startDate.hour()) + Number(startDate.minute() / 60)) * 50;
      entry.end = (Number(endDate.hour()) + Number(endDate.minute() / 60)) * 50;
      entry.height =
        !isSameDay && isStartSameDay === isEndSameDay && !isEndSameDay
          ? 0
          : entry.end - entry.start;
      entry.top = entry.start;

      return entry;
    },
    isSameId() {
      const ids = this.dataList.map((r) => r.id);
      return ids.includes(this.dargWeekEntry.id);
    },
  },
  watch: {
    'hubCalendarStore.createOpen'(key) {
      if (!key) {
        this.checkedId = null;
      }
    },
    scrollTop() {
      const base = (15 / 60) * 50;
      if (this.isResizeDrag) {
        const scrollY = this.scrollTop - this.point.scrollTop;
        // 15 min = 1 step;
        const step = Math.ceil((this.point.movedY + scrollY) / base);
        const height = this.initEntry.height + step * base;
        if (height < base || height + this.initEntry.top > 1187.5) {
          return;
        }

        this.dargWeekEntry.addOffset = step * 15; // 结束时间新增偏移分钟数
        this.entry.addOffset = step * 15;
      }
      if (this.isDrag) {
        const scrollY = this.scrollTop - this.point.scrollTop;
        // 15 min = 1 step;
        const step = Math.ceil((this.point.movedY + scrollY) / base);
        const top = this.initEntry.top + this.initEntry.height + step * base;

        if (top < 12.5 || this.initEntry.top + step * base > 1187.5) {
          return;
        }

        this.dargWeekEntry.offset = step * 15; // 偏移分钟数
        this.entry.offset = step * 15;
      }
    },
    dataList() {
      this.isHideIndexes = [];
    },
  },
  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
    document.addEventListener('mousemove', this.onMousemove);
    document.addEventListener('mouseup', this.onMouseup);
    // this.$nextTick(() => {
    //   this.init();
    // });
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.onMousemove);
    document.removeEventListener('mouseup', this.onMouseup);
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    async onResize() {
      if (!this.$refs.main) {
        return;
      }
      const main = this.$refs.main.getBoundingClientRect();
      this.maxWidth = main.width;
      if (this.eventObj) {
        let x = 0;
        if (this.dataColumnIndex > 2) {
          x = main.left - 448 - 10;
        } else {
          x = main.left + main.width + 10;
        }
        const clientX = main.left - main.width * this.dataColumnIndex;
        this.onCreateStyle(x, this.eventObj.clientY, main.width, clientX);
      }
    },
    init() {
      this.list.forEach((item, index) => {
        const el = this.itemRefs[index];
        if (el) {
          useDraggable(el, {
            onStart: (position, event) => {
              this.onDragMousedown(event, item);
            },
            onMove: (position, event) => {
              this.onMousemove(event);
            },
            onEnd: () => {
              this.onMouseup();
            },
          });
        }
      });
    },
    isPast(entry) {
      if (entry.entityType === 'course') {
        return true;
      }
      return entry.id === 'create'
        ? false
        : dayjs().isAfter(entry.endDate || new Date(entry?.dates?.endDate));
    },
    onTouchstart(e, entry) {
      const event = e.touches[0];
      this.onDragMousedown(event, entry);
    },
    onDragMousedown(e, entry) {
      if (entry.isPersonal) {
        return;
      }
      if (this.isResizeDrag) {
        return;
      }
      this.isDrag = true;
      this.entry = Object.assign({}, entry);
      this.hubCalendarStore.dargWeekEntry = Object.assign({}, entry);
      this.initEntry = Object.assign({}, entry);
      this.point = {
        x: e.clientX,
        y: e.clientY,
        movedY: 0,
        scrollTop: this.scrollTop,
      };

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isMouse = true;
        // this.entryId = this.initEntry.id;
      }, 1000);
    },
    onRisizeMousedown(e, entry) {
      if (entry.isPersonal) {
        return;
      }
      this.isResizeDrag = true;
      this.entry = Object.assign({}, entry);
      this.hubCalendarStore.dargWeekEntry = Object.assign({}, entry);
      this.initEntry = Object.assign({}, entry);

      this.point = {
        x: e.clientX,
        y: e.clientY,
        movedY: 0,
        scrollTop: this.scrollTop,
      };

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isMouse = true;
        // this.entryId = this.initEntry.id;
      }, 1000);
    },
    onTouchmove(e) {
      e.preventDefault();
      const event = e.touches[0];
      this.onMousemove(event);
    },
    async onMousemove(e) {
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (this.isResizeDrag) {
        this.$emit('onMove', clientY);
        // this.entryId = this.initEntry.id;
        this.isMouse = true;
        const movedY = parseInt(clientY - this.point.y);
        if (Math.abs(movedY) > 10) {
          this.isMove = true;
          this.hubCalendarStore.isMove = true;
        }
        this.point.movedY = movedY;
        const base = (15 / 60) * 50;
        const scrollY = this.scrollTop - this.point.scrollTop;
        // 15 min = 1 step;
        const step = Math.ceil((movedY + scrollY) / base);
        const height = this.initEntry.height + step * base;
        if (height < base || height + this.initEntry.top > 1187.5) {
          return;
        }

        this.dargWeekEntry.addOffset = step * 15; // 结束时间新增偏移分钟数
        this.entry.addOffset = step * 15;

        if (
          this.isPast(this.dargWeekEntry) &&
          this.dargWeekEntry.id !== 'create'
        ) {
          this.dargWeekEntry.isDisabled = true;
          return;
        }

        let endDate = dayjs(this.dargWeekEntry.endDate);
        if (this.dargWeekEntry.addOffset > 0) {
          endDate = endDate.add(this.dargWeekEntry.addOffset, 'minute');
        } else if (this.dargWeekEntry.addOffset < 0) {
          endDate = endDate.subtract(
            Math.abs(this.dargWeekEntry.addOffset),
            'minute',
          );
        }

        this.dargWeekEntry.isDisabled =
          this.isPast({ endDate }) && this.dargWeekEntry.id !== 'create';
      }
      if (this.isDrag) {
        this.$emit('onMove', clientY);

        // this.entryId = this.initEntry.id;
        // this.hubCalendarStore.dargWeekEntry = Object.assign({}, this.initEntry);
        this.isMouse = true;
        if (!this.isDay) {
          const main = this.$refs.main.getBoundingClientRect();
          const maxX = 6 - this.dataColumnIndex;
          let translateX = Math.floor((e.clientX - main.left) / main.width);
          if (translateX > maxX) {
            translateX = maxX;
          }
          if (translateX < -this.dataColumnIndex) {
            translateX = -this.dataColumnIndex;
          }

          this.dargWeekEntry.translateX = translateX;
          this.entry.translateX = translateX;
        }
        const movedX = Math.abs(clientX - this.point.x);
        const movedY = parseInt(clientY - this.point.y);
        if (movedX > 10 || Math.abs(movedY) > 10) {
          this.isMove = true;
          this.hubCalendarStore.isMove = true;
          this.hubCalendarStore.createOpen = false;
        }
        this.point.movedY = movedY;
        const base = (15 / 60) * 50;
        const scrollY = this.scrollTop - this.point.scrollTop;
        // 15 min = 1 step;
        const step = Math.ceil((movedY + scrollY) / base);
        const top = this.initEntry.top + this.initEntry.height + step * base;

        if (top < 12.5 || this.initEntry.top + step * base > 1187.5) {
          return;
        }

        this.dargWeekEntry.offset = step * 15; // 偏移分钟数
        this.entry.offset = step * 15;

        if (
          this.isPast(this.dargWeekEntry) &&
          this.dargWeekEntry.id !== 'create'
        ) {
          this.dargWeekEntry.isDisabled = true;
          return;
        }

        let endDate = dayjs(this.dargWeekEntry.endDate);
        if (this.dargWeekEntry.translateX > 0) {
          endDate = endDate.add(this.dargWeekEntry.translateX, 'day');
        } else {
          endDate = endDate.subtract(
            Math.abs(this.dargWeekEntry.translateX),
            'day',
          );
        }
        if (this.dargWeekEntry.offset > 0) {
          endDate = endDate.add(this.dargWeekEntry.offset, 'minute');
        } else if (this.dargWeekEntry.offset < 0) {
          endDate = endDate.subtract(
            Math.abs(this.dargWeekEntry.offset),
            'minute',
          );
        }

        this.dargWeekEntry.isDisabled =
          this.isPast({ endDate }) && this.dargWeekEntry.id !== 'create';
      }
    },
    async onMouseup(e) {
      this.$emit('onMove', null);
      const isPast = this.isPast(this.entry);
      if (isPast && this.isMove) {
        this.$toast.error('This event cannot be moved on another date');
      }
      if (this.isResizeDrag && this.isMove && !isPast) {
        if (this.entry.id !== this.hubCalendarStore.entryId) {
          this.hubEventStore.setEvent(this.entry, false);
          this.hubCalendarStore.createOpen = false;
        }

        const data =
          this.entry.id === 'create'
            ? this.hubEventStore.getEvent(this.hubEventStore.event)
            : this.hubEventStore.getEvent(this.entry);

        let endDate = dayjs(new Date(data.dates.endDate));
        if (this.entry.addOffset > 0) {
          endDate = endDate.add(this.entry.addOffset, 'minute');
        } else if (this.entry.addOffset < 0) {
          endDate = endDate.subtract(Math.abs(this.entry.addOffset), 'minute');
        }

        data.dates.endDate = endDate.toISOString();

        if (!this.isPast(data) || this.entry.id === 'create') {
          this.hubEventStore.event.dates = data.dates;
          if (this.entry?.isShared || this.entry?.hasFrequency) {
            this.hubEventStore.setEvent(data, false);
            if (this.entry?.isShared) {
              this.hubCalendarStore.shareOpen = true;
            }
            if (this.entry?.hasFrequency) {
              this.hubCalendarStore.frequencyOpen = true;
            }
          } else {
            this.hubCalendarStore.entryDataList =
              this.hubCalendarStore.entryDataList.map((r) => {
                if (r.id === this.entry.id) {
                  r.endDate = new Date(data.dates.endDate);
                  r.dates.startDate = data.dates.startDate;
                  r.dates.endDate = data.dates.endDate;
                  this.hubEventStore.event.dates.startDate =
                    data.dates.startDate;
                  this.hubEventStore.event.dates.endDate = data.dates.endDate;
                }
                return r;
              });
            this.onNotify(this.entry, data);
          }
        } else {
          this.$toast.error('This event cannot be moved in a past date');
        }
      }
      if (this.isDrag && this.isMove && !isPast) {
        if (this.entry.id !== this.hubCalendarStore.entryId) {
          this.hubEventStore.setEvent(this.entry, false);
          this.hubCalendarStore.createOpen = false;
        }

        const data =
          this.entry.id === 'create'
            ? this.hubEventStore.getEvent(this.hubEventStore.event)
            : this.hubEventStore.getEvent(this.entry);

        let startDate = dayjs(new Date(data.dates.startDate));
        let endDate = dayjs(new Date(data.dates.endDate));
        if (this.entry.translateX > 0) {
          startDate = startDate.add(this.entry.translateX, 'day');
          endDate = endDate.add(this.entry.translateX, 'day');
        } else if (this.entry.translateX < 0) {
          startDate = startDate.subtract(
            Math.abs(this.entry.translateX),
            'day',
          );
          endDate = endDate.subtract(Math.abs(this.entry.translateX), 'day');
        }
        if (this.entry.offset > 0) {
          startDate = startDate.add(this.entry.offset, 'minute');
          endDate = endDate.add(this.entry.offset, 'minute');
        } else if (this.entry.offset < 0) {
          startDate = startDate.subtract(Math.abs(this.entry.offset), 'minute');
          endDate = endDate.subtract(Math.abs(this.entry.offset), 'minute');
        }

        data.dates.startDate = startDate.toISOString();
        data.dates.endDate = endDate.toISOString();

        if (!this.isPast(data) || this.entry.id === 'create') {
          if (this.entry?.isShared || this.entry?.hasFrequency) {
            this.hubEventStore.setEvent(data, false);
            if (this.entry?.isShared) {
              this.hubCalendarStore.shareOpen = true;
            }
            if (this.entry?.hasFrequency) {
              this.hubCalendarStore.frequencyOpen = true;
            }
          } else {
            this.hubCalendarStore.entryDataList =
              this.hubCalendarStore.entryDataList.map((r) => {
                if (r.id === this.entry.id) {
                  r.startDate = new Date(data.dates.startDate);
                  r.endDate = new Date(data.dates.endDate);
                  r.dates.startDate = data.dates.startDate;
                  r.dates.endDate = data.dates.endDate;
                  this.hubEventStore.event.dates.startDate =
                    data.dates.startDate;
                  this.hubEventStore.event.dates.endDate = data.dates.endDate;
                }
                return r;
              });
            if (this.entry.id === 'create') {
              this.eventObj = e;
              const main = this.$refs.main.getBoundingClientRect();
              const dataColumnIndex =
                this.entry.translateX + this.dataColumnIndex;
              const left = main.left + main.width * this.entry.translateX;
              if (this.eventObj) {
                let x = 0;
                if (dataColumnIndex > 2) {
                  x = left - 448 - 10;
                } else {
                  x = left + main.width + 10;
                }
                const clientX = left - main.width * dataColumnIndex;
                this.onCreateStyle(
                  x,
                  this.eventObj.clientY,
                  main.width,
                  clientX,
                  dataColumnIndex,
                );
              }
              this.hubCalendarStore.createOpen = true;
            }
            this.onNotify(this.entry, data);
          }
        } else {
          this.$toast.error('This event cannot be moved in a past date');
        }
      }

      this.isResizeDrag = false;
      this.isDrag = false;
      this.entry = {};
      this.initEntry = {};
      this.isMove = false;
      // this.entryId = null;
      this.hubCalendarStore.isMove = false;
      this.hubCalendarStore.dargWeekEntry = {};
      clearTimeout(this.timer);
      await sleep(300);
      if (this.entry.id !== 'create' && !this.hubCalendarStore.createOpen) {
        this.hubCalendarStore.entryDataList =
          this.hubCalendarStore.entryDataList.filter((r) => r.id !== 'create');
      }
      this.isMouse = false;
    },
    transferTime(number) {
      const hours = parseInt(number / 50);
      const minute = parseInt((number / 50 - hours) * 60);
      return `${hours}:${minute > 10 ? minute : `0${minute}`}`;
    },
    async onNotify(beforeData, data) {
      if (beforeData.id === 'create') {
        return;
      }
      this.hubCalendarStore.beforeEntryData = Object.assign({}, beforeData);
      this.hubCalendarStore.notifyShow = true;
      this.hubCalendarStore.isUndo = false;
      await this.hubCalendarStore.updateEvent(data);
      this.hubCalendarStore.notifyShow = false;
      await sleep(100);
      this.hubCalendarStore.notifyShow = true;
      this.hubCalendarStore.isUndo = true;
    },
    onCreate(event) {
      if (this.isMouse) {
        return;
      }
      if (!this.isDay) {
        this.eventObj = event;
        this.onResize();
        // const main = this.$refs.main.getBoundingClientRect();
        // let x = 0;
        // if (this.dataColumnIndex > 2) {
        //   x = main.left - 448 - 10;
        // } else {
        //   x = main.left + main.width + 10;
        // }
        // const clientX = main.left - main.width * this.dataColumnIndex;
        // this.onCreateStyle(x, event.clientY, main.width, clientX);
      }

      const offsetY = event.offsetY;
      let hours = parseInt(offsetY / 50);
      let minute = parseInt((offsetY / 50 - hours) * 4) * 15;
      if (hours >= 23 && minute > 15) {
        hours = 23;
        minute = 15;
      }
      const now = this.weekList[this.isDay ? 0 : this.dataColumnIndex];
      this.hubCalendarStore.createDate = dayjs(now)
        .set('hour', hours)
        .set('minute', minute)
        .toDate();

      this.hubCalendarStore.create();
    },
    onView(event, entry) {
      if (entry.id === 'create') {
        return;
      }
      if (entry.isPersonal) {
        return;
      }
      if (this.isMouse) {
        return;
      }
      if (!this.isDay) {
        this.eventObj = event;
        this.onResize();
        // const main = this.$refs.main.getBoundingClientRect();
        // let x = 0;
        // if (this.dataColumnIndex > 2) {
        //   x = main.left - 448 - 10;
        // } else {
        //   x = main.left + main.width + 10;
        // }
        // const clientX = main.left - main.width * this.dataColumnIndex;
        // this.onCreateStyle(x, event.clientY, main.width, clientX);
      }
      this.checkedId = entry.id;

      this.hubCalendarStore.create(entry);
    },
    onCreateStyle(x, y, width, clientX, index) {
      this.hubCalendarStore.createStyle.left = x;
      this.hubCalendarStore.createStyle.top = y;
      this.hubCalendarStore.createStyle.width = width;
      this.hubCalendarStore.createStyle.clientX = clientX;
      this.hubCalendarStore.createStyle.index = index || this.dataColumnIndex;
    },
    filterMembersClass(entry) {
      let isExist = true;
      // this.members.forEach((member) => {
      //   if (!entry?.membersIds.includes(member.id)) {
      //     isExist = false;
      //   }
      // });
      if (!this.filterEventIds.includes(entry.id)) {
        isExist = false;
      }
      return isExist
        ? 'shadow-[0px_4px_4px_rgba(0,0,0,0.4)]'
        : this.members.length && !entry.isPersonal
          ? 'opacity-40'
          : '';
    },
    personalMembersClass(entry) {
      return entry.isPersonal ? '!shadow-[0px_4px_4px_rgba(0,0,0,0.4)]' : '';
    },
    handleAddLeft(entry) {
      this.filterScheduleList.forEach((item, index) => {
        if (!(entry.end <= item.start || entry.start >= item.end)) {
          const isStart =
            entry.start < item.start + 25 && entry.start >= item.start;
          const isEnd = entry.start < item.start && entry.end > item.start;
          if (isStart || isEnd) {
            this.isHideIndexes.push(index);
          }
          if (entry._left < item.left + 20) {
            entry._left = item.left + 20;
          }
        }
      });
    },
  },
};
</script>

<template>
  <div class="relative z-10 shadow-[0_8px_12px_rgba(0,0,0,0.8)]">
    <div class="flex h-8 rounded-t-md bg-[#060606]">
      <div class="flex h-full w-12 items-center justify-center rounded-tl-md">
        <i class="fa-light fa-clock select-none text-xl text-white/80" />
      </div>
      <div
        class="relative grid h-full flex-1 grid-cols-7 border-l border-[#2d2d2d]"
      >
        <div
          v-for="item in weekEventsList"
          :key="item.key"
          class="flex items-center justify-center gap-1 border-b border-transparent leading-none transition-all hover:border-white hover:bg-white/10 md:gap-2.5"
          :class="
            isToday(item.date)
              ? 'border-[#e4b53d] text-[#e4b53d]'
              : isSameday(item.date)
                ? 'text-[#4a4a4a]'
                : 'text-white'
          "
        >
          <div class="text-10 font-medium md:text-13">{{ $t(item.name) }}</div>
          <div
            class="cursor-pointer text-sm font-semibold transition-all active:scale-95 md:text-xl"
            data-cy="d67b810d1c93eec7"
            @click="onOpenDay(item.date)"
          >
            {{ dayFormat(item.date) }}
          </div>
        </div>
        <div class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-full" />
      </div>
    </div>
    <div class="flex rounded-t-md">
      <div
        class="flex w-12 items-center justify-center rounded-tl-md text-11 text-[#707070]"
      >
        {{ currentTimezone }}
      </div>
      <div ref="box" class="relative flex-1">
        <div
          class="relative grid min-h-4 w-full grid-cols-7"
          :style="{ height: `${maxLen * 26 + 10}px` }"
        >
          <div
            v-for="item in weekEventsList"
            :key="item.key"
            class="flex items-center justify-center overflow-hidden bg-[#181a1b] px-1 hover:bg-[#181a1b]/60"
            data-cy="bc26d8a32bb6fdc9"
            @click="onCreate(item)"
          >
            <div
              v-for="entry in item.entry"
              :key="entry.id"
              class="absolute z-10 flex h-6 items-center px-2"
              :style="{
                width: `calc(${(100 * entry.widthIndex) / 7}% - ${
                  entry.rightRounded ? 20 : 0
                }px - ${entry.leftRounded ? 20 : 0}px)`,
                top: `${entry.level * 26 + 6}px`,
                left: `calc(${(100 * entry.leftIndex) / 7}% + ${
                  entry.leftRounded ? 20 : 0
                }px)`,
              }"
              :class="entry.isShow ? '' : 'pointer-events-none opacity-0'"
            >
              <OrganizationHubCalendarMainMonthItem
                :entry="entry"
                data-cy="0f0cbea797b78e2c"
                @click.stop="onView($event, entry)"
                @mousedown="onDragMousedown($event, entry)"
              />
            </div>
          </div>
        </div>
        <div
          class="pointer-events-none absolute left-0 top-0 grid h-full w-full grid-cols-7"
        >
          <div v-for="(item, index) in weekList" :key="index" class="relative">
            <div
              v-if="index !== 0"
              class="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent to-[#4A4A4A]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    events: Array,
  },
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    const hubEventStore = useHubEventStore();
    const profileStore = useProfileStore();
    return { hubCalendarStore, hubEventStore, profileStore };
  },
  data() {
    return {
      maxLen: 1,
      isDrag: false,
      nowEntry: {},
      moveEntryId: null,
      point: {},
      currentTimezone: dayjs().format('z'),
    };
  },
  computed: {
    initDate() {
      return this.hubCalendarStore.initDate;
    },
    entryDataList() {
      const list = cloneDeep(this.events);
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
    weekList() {
      return getWeekArray(this.initDate);
    },
    weekEventsList() {
      const week = [
        'index.week.sun',
        'index.week.mon',
        'index.week.tue',
        'index.week.wed',
        'index.week.thu',
        'index.week.fri',
        'index.week.sat',
      ];
      const weekKey = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const len = this.weekList.length;
      const List = [];
      for (let i = 0; i < len; i++) {
        const entryList = this.getEntryList(this.weekList[i]);
        List.push({
          key: weekKey[i],
          name: week[i],
          date: this.weekList[i],
          entry: this.onEventsStyle(entryList, this.weekList[i]),
        });
      }
      return List;
    },
    timezone() {
      return this.profileStore?.myProfileDetail?.timezone;
    },
  },
  watch: {
    initDate() {
      this.maxLen = 1;
    },
    timezone() {
      this.init();
    },
  },
  mounted() {
    this.init();
    document.addEventListener('mousemove', this.onMousemove);
    document.addEventListener('mouseup', this.onMouseup);
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.onMousemove);
    document.removeEventListener('mouseup', this.onMouseup);
  },
  methods: {
    init() {
      this.currentTimezone = dayjs().format('z');
    },
    isPast(entry) {
      if (entry.entityType === 'course') {
        return true;
      }
      return entry.id === 'create'
        ? false
        : dayjs().isAfter(entry.endDate || new Date(entry?.dates?.endDate));
    },
    onDragMousedown(e, entry) {
      if (entry.isPersonal) {
        return;
      }
      const box = this.$refs.box.getBoundingClientRect();
      const _width = box.width / 7;
      const _left = e.clientX - box.left;
      const index = Math.floor(_left / _width);

      this.isDrag = true;
      this.nowEntry = Object.assign({}, entry);

      this.point = {
        x: e.clientX,
        y: e.clientY,
        index,
      };
    },
    async onMousemove(e) {
      if (this.isDrag) {
        const box = this.$refs.box.getBoundingClientRect();
        const _width = box.width / 7;
        const _left = e.clientX - box.left;
        const index = Math.floor(_left / _width);

        const movedX = Math.abs(e.clientX - this.point.x);
        const movedY = Math.abs(e.clientY - this.point.y);
        if (movedX > 10 || movedY > 10) {
          this.hubCalendarStore.isDarg = true;
          this.moveEntryId = this.nowEntry.id;
          this.point.endIndex = index;
          this.hubCalendarStore.createOpen = false;
        }
        this.hubCalendarStore.dargItems = {
          ...this.nowEntry,
          clientX: e.clientX,
          clientY: e.clientY,
          width: _width,
        };
        if (this.isPast(this.nowEntry) && this.nowEntry.id !== 'create') {
          this.hubCalendarStore.dargItems.isDisabled = true;
          return;
        }
        const nowDate = this.weekList[this.point.endIndex];
        const diffInDays = dayjs(new Date(this.nowEntry.dates.startDate))
          .startOf('day')
          .diff(dayjs(nowDate).startOf('day'), 'day');
        if (diffInDays > 0) {
          const endDate = dayjs(new Date(this.nowEntry.dates.endDate)).subtract(
            Math.abs(diffInDays),
            'day',
          );
          if (this.isPast({ endDate }) && this.nowEntry.id !== 'create') {
            this.hubCalendarStore.dargItems.isDisabled = true;
          }
        }
      }
    },
    async onMouseup() {
      if (this.isDrag) {
        const isPast = this.isPast(this.nowEntry);
        if (isPast && this.hubCalendarStore.isDarg) {
          this.$toast.error('This event cannot be moved on another date');
        }
        if (
          this.point.endIndex !== undefined &&
          this.point.endIndex !== this.point.index &&
          !isPast
        ) {
          if (this.nowEntry.id !== this.hubCalendarStore.entryId) {
            this.hubEventStore.setEvent(this.nowEntry, false);
            this.hubCalendarStore.createOpen = false;
            // this.hubCalendarStore.create(this.entry);
          }

          const data =
            this.nowEntry.id === 'create'
              ? this.hubEventStore.getEvent(this.hubEventStore.event)
              : this.hubEventStore.getEvent(this.nowEntry);

          const nowDate = this.weekList[this.point.endIndex];
          const diffInDays = dayjs(new Date(data.dates.startDate))
            .startOf('day')
            .diff(dayjs(nowDate).startOf('day'), 'day');
          if (diffInDays > 0) {
            data.dates.startDate = dayjs(new Date(data.dates.startDate))
              .subtract(Math.abs(diffInDays), 'day')
              .toISOString();
            data.dates.endDate = dayjs(new Date(data.dates.endDate))
              .subtract(Math.abs(diffInDays), 'day')
              .toISOString();
          } else {
            data.dates.startDate = dayjs(new Date(data.dates.startDate))
              .add(Math.abs(diffInDays), 'day')
              .toISOString();
            data.dates.endDate = dayjs(new Date(data.dates.endDate))
              .add(Math.abs(diffInDays), 'day')
              .toISOString();
          }
          if (!this.isPast(data) || this.nowEntry.id === 'create') {
            if (this.nowEntry?.isShared || this.nowEntry?.hasFrequency) {
              this.hubEventStore.setEvent(data, false);
              if (this.nowEntry?.isShared) {
                this.hubCalendarStore.shareOpen = true;
              }
              if (this.nowEntry?.hasFrequency) {
                this.hubCalendarStore.frequencyOpen = true;
              }
            } else {
              this.hubCalendarStore.entryDataList =
                this.hubCalendarStore.entryDataList.map((r) => {
                  if (r.id === this.moveEntryId) {
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
              if (this.nowEntry.id === 'create') {
                this.hubCalendarStore.createOpen = true;
              }
              this.onNotify(this.nowEntry, data);
            }
          } else {
            this.$toast.error('This event cannot be moved in a past date');
          }
        }
        this.nowEntry = {};
        this.point = {};
        this.hubCalendarStore.isDarg = false;
      }
      this.isDrag = false;
      await sleep(300);
      this.moveEntryId = null;
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
    onOpenDay(date) {
      this.hubCalendarStore.dateTypeIndex = 0;
      this.hubCalendarStore.initDate = new Date(date);
    },
    onCreate(item) {
      if (this.moveEntryId) {
        return;
      }

      this.hubCalendarStore.createDate = dayjs(item.date)
        .set('hour', dayjs().hour())
        .set('minute', dayjs().minute())
        .toDate();
      this.hubCalendarStore.create({}, true);
    },
    onView(event, entry) {
      if (entry.id === 'create') {
        return;
      }
      if (entry.isPersonal) {
        return;
      }
      if (this.moveEntryId) {
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
            dayjs(entry.endDate).endOf('day'),
            null,
            '[]',
          )
        ) {
          if (!entry.level) {
            let number = null;
            for (let j = 0; j < events.length; j++) {
              if (events[j].level > j) {
                number = j;
                break;
              }
            }

            entry.level = number === null ? events.length : number;
          }
          events.push(Object.assign({}, entry));
          events.sort((a, b) => a.level - b.level);
        }
      }
      if (events.length > this.maxLen) {
        this.maxLen = events.length;
      }
      return events;
    },
    onEventsStyle(events, date) {
      return events.map((event) => {
        const dayOfWeek = dayjs(date).day();
        let widthIndex = 0;
        if (dayOfWeek === 0) {
          widthIndex =
            dayjs(event.endDate).startOf('day').diff(dayjs(date), 'day') + 1;
        } else {
          widthIndex =
            dayjs(event.endDate)
              .startOf('day')
              .diff(dayjs(event.startDate).startOf('day'), 'day') + 1;
        }

        if (widthIndex + dayOfWeek > 7) {
          widthIndex = 7 - dayOfWeek;
        }
        const isSameDay = dayjs(event.startDate)
          .startOf('day')
          .isSame(dayjs(date).startOf('day'));

        if (isSameDay || dayOfWeek === 0) {
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
    dayFormat(date) {
      return formatDate(date, 'DD');
    },
  },
};
</script>

<template>
  <div ref="box" class="flex h-full flex-col gap-0.5">
    <div
      v-for="entry in data.slice(0, 4)"
      :key="entry.id"
      :data-cy="`${entry.id}-month-id`"
      class="absolute z-10 cursor-pointer px-1.5"
      :style="{
        width: `calc(${(100 * entry.widthIndex) / 7}% - ${
          entry.rightRounded ? 20 : 0
        }px - ${entry.leftRounded ? 20 : 0}px)`,
        top: `${entry.level * 26 + 24}px`,
        left: `calc(${(100 * entry.leftIndex) / 7}% + ${
          entry.leftRounded ? 20 : 0
        }px)`,
      }"
      :class="[
        entry.isShow ? '' : 'pointer-events-none opacity-0',
        entry.id === moveEntryId ? 'opacity-50' : '',
      ]"
    >
      <OrganizationHubCalendarMainMonthItem
        :is-offset="true"
        :entry="entry"
        :data-cy="`${entry.id}-month-id`"
        @click.stop="onView($event, entry)"
        @mousedown="onMousedown($event, entry)"
      />
    </div>
    <div
      class="absolute bottom-0 flex items-center justify-center"
      :style="{
        width: `${100 / 7}%`,
        left: `${(100 * dataColumnIndex) / 7}%`,
      }"
    >
      <div
        v-if="data.length > 4"
        ref="more"
        class="flex h-6 w-full cursor-pointer items-center justify-center gap-1 px-2 transition-all active:scale-95"
        :class="
          isHaveMore
            ? 'text-xs font-bold text-white/90 hover:text-sm'
            : 'text-11 font-semibold text-[#565656]/70 hover:text-white'
        "
        @click.stop="moreShow = true"
      >
        <div
          v-if="isHaveMore"
          class="h-2 w-2 rounded-full"
          :style="{ backgroundColor: moreItems[0].color }"
        />
        <i v-if="$device.isMobile" class="fa-light fa-ellipsis text-white/90" />
        <div v-else class="max-w-full truncate text-8 md:text-xs">
          {{ $t('calendar.viewAll', { length: data.slice(4).length }) }}
        </div>
      </div>
    </div>
    <el-popover
      :show-arrow="false"
      :width="324"
      popper-class="more-popper"
      :virtual-ref="more"
      :visible="moreShow"
      virtual-triggering
      :persistent="false"
    >
      <div class="flex select-none flex-col gap-1.5 p-2">
        <div class="flex items-center px-1.5">
          <div class="flex w-0 flex-1 items-center gap-2">
            <div
              class="cursor-pointer rounded-md p-1.5 text-sm font-semibold leading-none text-[#D9D9D9] transition-all hover:bg-white/5 active:scale-95"
              data-cy="792c09e08ba61600"
              @click="onOpenDay"
            >
              {{ formatDate(date, 'DD MMM') }}
            </div>
            <div
              class="flex h-7 w-7 items-center justify-center rounded-5 bg-white/5"
            >
              {{ data.length }}
            </div>
          </div>
          <BaseIconClose
            data-cy="2aaf93e40ac34189"
            @click.stop="moreShow = false"
          />
        </div>
        <div
          class="hide-scrollbar flex max-h-64 flex-col gap-1 overflow-y-auto"
        >
          <OrganizationHubCalendarMainListItem
            v-for="entry in data"
            :key="entry.id"
            :entry="entry"
            data-cy="3d801e853c58b58e"
            @click.stop="onView($event, entry)"
            @mousedown="onMousedown($event, entry)"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    data: Array,
    date: Date,
    dataColumnIndex: [String, Number],
  },
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    const hubEventStore = useHubEventStore();
    const more = ref();
    const moreShow = ref(false);
    onClickOutside(
      more,
      () => {
        moreShow.value = false;
      },
      {
        ignore: ['.more-popper'],
      },
    );
    const { width } = useWindowSize();
    return { more, moreShow, hubCalendarStore, hubEventStore, width };
  },
  data() {
    return {
      isMouseDown: false,
      startcursorx: null,
      startcursory: null,
      nowEntry: null,
      moveEntryId: null,
      eventObj: null,
    };
  },
  computed: {
    moreItems() {
      return this.data
        .slice(4)
        .filter((r) => !r.id && r.name === 'Not Available');
    },
    isHaveMore() {
      return !!this.moreItems.length;
    },
  },
  mounted() {
    document.addEventListener('mousemove', this.onMousemove);
    document.addEventListener('mouseup', this.onMouseup);
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('mousemove', this.onMousemove);
    document.removeEventListener('mouseup', this.onMouseup);
  },
  methods: {
    handleResize() {
      if (this.eventObj) {
        const rect = this.$refs.box.getBoundingClientRect();
        let x = 0;
        if (this.eventObj.pageX > this.width / 2) {
          x = rect.left - 448 - 10;
        } else {
          x = rect.left + rect.width + 10;
        }
        const clientX = rect.left - rect.width * this.dataColumnIndex;
        this.onCreateStyle(x, this.eventObj.pageY, rect.width, clientX);
      }
    },
    onView(event, entry) {
      if (entry.id === 'create') {
        return;
      }
      if (entry.isPersonal) {
        return;
      }
      this.eventObj = event;
      this.handleResize();
      // const rect = this.$refs.box.getBoundingClientRect();
      // let x = 0;
      // if (event.pageX > this.width / 2) {
      //   x = rect.left - 448 - 10;
      // } else {
      //   x = rect.left + rect.width + 10;
      // }
      // const clientX = rect.left - rect.width * this.dataColumnIndex;
      // this.onCreateStyle(x, event.pageY, rect.width, clientX);

      this.moreShow = false;
      this.hubCalendarStore.create(entry);
    },
    onOpenDay() {
      this.hubCalendarStore.dateTypeIndex = 0;
      this.hubCalendarStore.initDate = dayjs(this.date).toDate();
    },
    onCreateStyle(x, y, width, clientX, index) {
      this.hubCalendarStore.createStyle.left = x;
      this.hubCalendarStore.createStyle.top = y;
      this.hubCalendarStore.createStyle.width = width;
      this.hubCalendarStore.createStyle.clientX = clientX;
      this.hubCalendarStore.createStyle.index = index || this.dataColumnIndex;
    },
    isPast(entry) {
      if (entry.entityType === 'course') {
        return true;
      }
      return entry.id === 'create'
        ? false
        : dayjs().isAfter(entry.endDate || new Date(entry?.dates?.endDate));
    },
    // onTouchStart(e, entry) {
    //   e.preventDefault();
    //   const event = e.touches[0];
    //   this.onMousedown(event, entry);
    // },
    onMousedown(e, entry) {
      if (entry.isPersonal) {
        return;
      }
      this.isMouseDown = true;
      this.startcursorx = e.clientX;
      this.startcursory = e.clientY;
      this.nowEntry = entry;
    },
    // onTouchMove(e) {
    //   e.preventDefault();
    //   const event = e.touches[0];
    //   this.onMousemove(event);
    // },
    onMousemove(e) {
      if (this.isMouseDown) {
        this.$emit('onMove', e.clientY);
        const rect = this.$refs.box.getBoundingClientRect();

        const movedX = Math.abs(e.clientX - this.startcursorx);
        const movedY = Math.abs(e.clientY - this.startcursory);
        if (movedX > 10 || movedY > 10) {
          this.hubCalendarStore.isDarg = true;
          this.moveEntryId = this.nowEntry.id;
          this.moreShow = false;
          this.hubCalendarStore.createOpen = false;
        }
        this.hubCalendarStore.dargItems = {
          ...this.nowEntry,
          clientX: e.clientX,
          clientY: e.clientY,
          width: rect.width,
        };
        const dom = e.target.closest('.month--day');
        if (dom) {
          const dataDate = dom.getAttribute('data-date');
          if (dataDate) {
            this.hubCalendarStore.dargItems.dataDate = dataDate;
            if (this.isPast(this.nowEntry) && this.nowEntry.id !== 'create') {
              this.hubCalendarStore.dargItems.isDisabled = true;
              return;
            }
            const diffInDays = dayjs(new Date(this.nowEntry.dates.startDate))
              .startOf('day')
              .diff(dayjs(dataDate), 'day');
            if (diffInDays > 0) {
              const endDate = dayjs(
                new Date(this.nowEntry.dates.endDate),
              ).subtract(Math.abs(diffInDays), 'day');
              if (this.isPast({ endDate }) && this.nowEntry.id !== 'create') {
                this.hubCalendarStore.dargItems.isDisabled = true;
              }
            }
          }
        }
      }
    },
    onMouseup(e) {
      this.$emit('onMove', null);
      if (this.isMouseDown) {
        const dataDate = this.hubCalendarStore.dargItems.dataDate;
        const isPast = this.isPast(this.nowEntry);
        if (isPast && this.moveEntryId) {
          this.$toast.error(this.$t('org.events.date.change.error.next'));
        }
        if (dataDate && this.moveEntryId && !isPast) {
          if (formatDate(this.nowEntry.startDate, 'YYYY-MM-DD') !== dataDate) {
            if (this.nowEntry.id !== this.hubCalendarStore.entryId) {
              this.hubEventStore.setEvent(this.nowEntry, false);
              this.hubCalendarStore.createOpen = false;
              // this.hubCalendarStore.create(this.entry);
            }

            const data =
              this.nowEntry.id === 'create'
                ? this.hubEventStore.getEvent(this.hubEventStore.event)
                : this.hubEventStore.getEvent(this.nowEntry);

            const diffInDays = dayjs(new Date(data.dates.startDate))
              .startOf('day')
              .diff(dayjs(dataDate), 'day');

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
                      this.hubEventStore.event.dates.endDate =
                        data.dates.endDate;
                    }
                    return r;
                  });
                if (this.nowEntry.id === 'create') {
                  this.eventObj = e;
                  const rect = this.$refs.box.getBoundingClientRect();
                  const dataColumnIndex = dayjs(data.dates.startDate).day();
                  const left =
                    rect.left +
                    rect.width * (dataColumnIndex - this.dataColumnIndex);

                  if (this.eventObj) {
                    let x = 0;
                    if (this.eventObj.pageX > this.width / 2) {
                      x = left - 448 - 10;
                    } else {
                      x = left + rect.width + 10;
                    }
                    const clientX = left - rect.width * dataColumnIndex;

                    this.onCreateStyle(
                      x,
                      this.eventObj.pageY,
                      rect.width,
                      clientX,
                      dataColumnIndex,
                    );
                  }
                  this.hubCalendarStore.createOpen = true;
                }
                this.onNotify(this.nowEntry, data);
              }
            } else {
              this.$toast.error(this.$t('org.events.date.change.error.past'));
            }
          }
        }

        this.isMouseDown = false;
        this.hubCalendarStore.isDarg = false;
        this.startcursorx = null;
        this.startcursory = null;
        this.nowEntry = null;
        this.moveEntryId = null;
      }
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
  },
};
</script>

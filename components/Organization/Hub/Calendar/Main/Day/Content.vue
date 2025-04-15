<template>
  <div class="relative z-10 shadow-[0_8px_12px_rgba(0,0,0,0.8)]">
    <div class="flex h-8 rounded-t-md bg-[#060606]">
      <div class="flex h-full w-12 items-center justify-center rounded-tl-md">
        <i class="fa-light fa-clock select-none text-xl text-white/80" />
      </div>
      <div class="relative h-full flex-1 border-l border-[#2d2d2d]">
        <div
          class="flex h-full items-center gap-2.5 pl-5 leading-none"
          :class="isToday ? 'text-[#e4b53d]' : 'text-[#f1f1f1]'"
        >
          <div class="text-13 font-medium">{{ weekName }}</div>
          <div
            class="text-xl font-semibold"
            :class="{ 'transition--left': dayAnimate }"
          >
            {{ day }}
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
      <div
        class="relative min-h-9 flex-1 bg-[#181a1b] py-1.5"
        data-cy="de51f4b475a1b0e2"
        @click="onCreate"
      >
        <div class="flex flex-col gap-0.5 px-1">
          <div
            v-for="item in events"
            :key="item.id"
            class="group/item relative flex h-6 w-full items-center px-2"
            :style="{
              width: `calc(100% - ${item.rightRounded ? 20 : 0}px - ${
                item.leftRounded ? 20 : 0
              }px)`,
              'margin-left': `${item.leftRounded ? 20 : 0}px`,
            }"
          >
            <OrganizationHubCalendarMainMonthItem
              :entry="item"
              data-cy="d37021fca0d2e9d7"
              @click.stop="onView($event, item)"
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
    const profileStore = useProfileStore();
    return { hubCalendarStore, profileStore };
  },
  data() {
    return {
      dayAnimate: true,
      currentTimezone: dayjs().format('z'),
    };
  },
  computed: {
    initDate() {
      return this.hubCalendarStore.initDate;
    },
    day() {
      return formatDate(this.initDate, 'DD');
    },
    weekName() {
      return formatDate(this.initDate, 'dddd');
    },
    isToday() {
      return dayjs().isSame(dayjs(this.initDate), 'day');
    },
    timezone() {
      return this.profileStore?.myProfileDetail?.timezone;
    },
  },
  watch: {
    initDate() {
      this.dayAnimate = true;
      setTimeout(() => {
        this.dayAnimate = false;
      }, 300);
    },
    timezone() {
      this.init();
    },
  },
  mounted() {
    this.init();
    setTimeout(() => {
      this.dayAnimate = false;
    }, 300);
  },
  methods: {
    init() {
      this.currentTimezone = dayjs().format('z');
    },
    onCreate() {
      this.hubCalendarStore.createDate = dayjs(this.hubCalendarStore.initDate)
        .startOf('day')
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

      this.hubCalendarStore.entryData = entry;
      this.hubCalendarStore.create(entry);
    },
  },
};
</script>

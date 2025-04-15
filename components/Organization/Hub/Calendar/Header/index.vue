<template>
  <div
    ref="main"
    class="relative z-20 mb-2.5 flex h-8 w-full items-center justify-between transition-all"
    :class="!hubCalendarStore.sidebarOpen ? 'md:w-[calc(100%-15rem)]' : ''"
  >
    <div
      v-if="!hubCalendarStore.sidebarOpen && !$device.isMobile"
      class="absolute left-0 top-0 flex h-8 w-12 items-center justify-center"
      :class="!hubCalendarStore.sidebarOpen ? 'md:translate-x-[-15rem]' : ''"
    >
      <div
        class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
        data-cy="b4c5c2da0329cfb1"
        @click="toggleSidebar"
      >
        <i class="fa-light fa-sidebar text-base text-[#f1f1f1]" />
      </div>
    </div>
    <div
      v-if="!$device.isMobile"
      class="relative flex h-full items-center overflow-hidden rounded-md"
    >
      <div
        class="bg-gradient-top absolute bottom-0 left-0 z-10 h-[1px] w-16 transition-all duration-300"
        :style="{
          transform: `translateX(${dateTypeIndex * 4}rem)`,
        }"
      />
      <div
        v-for="(item, index) in dateList"
        :key="item.type"
        :data-type="item.type"
        class="hover-light flex h-8 w-16 cursor-pointer select-none items-center justify-center bg-[#060606] text-xs transition-all hover:font-semibold hover:text-white active:scale-95"
        :class="
          dateTypeIndex === index
            ? 'font-semibold text-white'
            : 'text-[#707070]'
        "
        data-cy="e14a23ba75479b5c"
        @click="hubCalendarStore.dateTypeIndex = index"
      >
        {{ $t(item.name) }}
      </div>
    </div>
    <div
      v-if="$device.isMobile"
      class="flex h-6 w-6 items-center justify-center"
      data-cy="34f873d50121cf20"
      @click="toggleSidebar"
    >
      <i class="fa-light fa-filter-list" />
    </div>

    <!-- <client-only>
      <OrganizationHubCalendarSetting />
    </client-only> -->
    <el-select
      v-if="$device.isMobile"
      v-model="hubCalendarStore.dateTypeIndex"
      class="ml-2 !w-20"
      size="small"
    >
      <el-option
        v-for="(item, index) in dateList"
        :key="item.type"
        :label="$t(item.name)"
        :value="index"
      />
    </el-select>

    <OrganizationHubCalendarHeaderDate />

    <div
      v-if="$device.isMobile"
      class="relative"
      data-cy="9ae8369f76261de2"
      @click="hubCalendarStore.initDate = new Date()"
    >
      <i class="fa-light fa-calendar text-lg" />
      <div class="absolute left-1/2 top-2 -translate-x-1/2 text-8">
        {{ formatDate(new Date(), 'DD') }}
      </div>
    </div>

    <BaseButton
      v-if="!$device.isMobile && !hubCalendarStore.courseId"
      type="outline"
      data-cy="new-calendar-icon"
      size="large"
      class="shrink-0 text-xs"
      @click="onCreate"
    >
      <span class="group-hover/btn:hidden">
        <i class="fa-light fa-plus" />
      </span>
      <span class="hidden group-hover/btn:flex">
        <i class="fa-solid fa-plus" />
      </span>
      {{ $t('event.new') }}
    </BaseButton>

    <div v-if="!$device.isMobile" class="flex h-full items-center gap-8">
      <el-tooltip effect="light" :content="todayName" placement="bottom">
        <div
          class="flex h-full cursor-pointer select-none items-center justify-center rounded border border-transparent bg-[#060606] px-9 text-xs font-semibold text-white transition-all hover:border-white active:scale-95"
          data-cy="24a3a0a998e98d2e"
          @click="hubCalendarStore.initDate = new Date()"
        >
          {{ $t('org.hub.date.today') }}
        </div>
      </el-tooltip>
      <!-- <OrganizationHubCalendarHeaderSearch /> -->
    </div>
  </div>
</template>
<script>
import dayJS from 'dayjs';

import locales from '~/constant/en';

const dayjs = dayJS.tz;

export default {
  setup() {
    const { width } = useWindowSize();
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore, width };
  },
  data() {
    return {
      dateList: [
        {
          name: 'org.hub.date.day',
          type: 'day',
        },
        {
          name: 'org.hub.date.week',
          type: 'week',
        },
        {
          name: 'org.hub.date.month',
          type: 'month',
        },
        {
          name: 'org.hub.date.year',
          type: 'year',
        },
        {
          name: 'org.hub.date.list',
          type: 'list',
        },
      ],
    };
  },
  computed: {
    todayName() {
      const temp = new Date();
      return `${locales.labels.weekdaysLong[temp.getDay()]}, ${
        locales.labels.monthsLong[temp.getMonth()]
      } ${temp.getDate()}`;
    },
    dateTypeIndex() {
      return this.hubCalendarStore.dateTypeIndex;
    },
  },
  methods: {
    onCreate() {
      const date = new Date(this.hubCalendarStore.initDate);

      const rect = this.$refs.main.getBoundingClientRect();
      const leftSpace = this.hubCalendarStore.dateTypeIndex === 1 ? 48 : 0;
      const _width = (rect.width - leftSpace) / 7;
      const index = dayjs(date).day();
      const rectLeft = _width * index + rect.left + leftSpace;
      let x = 0;

      if (rectLeft > this.width / 2) {
        x = rectLeft - 448 - 10;
      } else {
        x = rectLeft + _width + 10;
      }
      const clientX = rect.left;
      this.onCreateStyle(x, rect.width, clientX, index);

      this.hubCalendarStore.createDate = dayjs(date)
        .set('hour', dayjs().hour())
        .set('minute', dayjs().minute())
        .toDate();

      this.hubCalendarStore.create();
    },
    toggleSidebar() {
      this.hubCalendarStore.sidebarOpen = !this.hubCalendarStore.sidebarOpen;
    },
    onCreateStyle(x, width, clientX, index) {
      this.hubCalendarStore.createStyle.left = x;
      this.hubCalendarStore.createStyle.width = width;
      this.hubCalendarStore.createStyle.clientX = clientX;
      this.hubCalendarStore.createStyle.index = index;
    },
  },
};
</script>

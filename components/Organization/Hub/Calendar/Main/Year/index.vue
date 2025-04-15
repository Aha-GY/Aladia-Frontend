<template>
  <div
    ref="main"
    class="hide-scrollbar transition--left grid h-full w-full gap-y-2 overflow-y-auto overscroll-none"
    :class="widthClass"
  >
    <OrganizationHubCalendarMainYearMonth
      v-for="(item, month) in 12"
      :key="month"
      :month="month"
    />
  </div>
</template>
<script>
import dayJS from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

const dayjs = dayJS.tz;

dayJS.extend(isBetween);
export default {
  setup() {
    const main = ref(null);
    const { width } = useElementSize(main);
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore, main, width };
  },
  data() {
    return {};
  },
  computed: {
    initDate() {
      return this.hubCalendarStore.initDate;
    },
    currentMonth() {
      return dayjs(this.initDate).month();
    },
    widthClass() {
      return this.width < 492
        ? 'grid-cols-1'
        : this.width < 735
          ? 'grid-cols-2'
          : this.width < 1000
            ? 'grid-cols-3'
            : 'grid-cols-4';
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
    onInit() {
      // if (this.currentMonth > 5) {
      //   const rect = this.$refs.main.getBoundingClientRect();
      //   this.$refs.main.scrollTo({
      //     top: rect.height,
      //     behavior: `instant`,
      //   });
      // }
    },
  },
};
</script>

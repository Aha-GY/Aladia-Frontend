<template>
  <div
    ref="main"
    class="event-main fixed z-[1999] flex w-[28rem] flex-col rounded-5 border border-white/10 bg-[#060606]"
    :style="[
      mainStyle,
      animateStyle,
      {
        height: height < 576 ? `${height / 16}rem` : '36rem',
      },
    ]"
  >
    <OrganizationHubCalendarCreateHeader />
    <OrganizationHubCalendarCreateChapterHeader v-if="event.chapterSummary" />

    <div
      class="flex flex-1 flex-col gap-4 overflow-y-auto p-3 pt-0 text-sm transition-all"
    >
      <div />
      <OrganizationHubEventTitle>
        <BaseInput
          v-model="event.name"
          :title="$t('index.title')"
          class="pl-1"
          data-cy="calendar-event-title"
        />
      </OrganizationHubEventTitle>

      <OrganizationHubEvent :type="type" :calendar-list="calendarList" />
    </div>

    <OrganizationHubCalendarCreateFooter v-if="type === 'event' || !event.id" />
  </div>
</template>
<script>
export default {
  setup() {
    const hubEventStore = useHubEventStore();
    const hubCalendarStore = useHubCalendarStore();
    const { width, height } = useWindowSize();
    const main = ref(null);
    onClickOutside(
      main,
      () => {
        hubCalendarStore.createOpen = false;
        if (!hubEventStore.event.id) {
          hubCalendarStore.entryDataList =
            hubCalendarStore.entryDataList.filter((r) => r.id !== 'create');
        }
      },
      {
        ignore: ['.calendar-main', '.el-popper', '.event-main'],
      },
    );
    return {
      hubEventStore,
      hubCalendarStore,
      width,
      height,
      main,
    };
  },
  data() {
    return {
      mainStyle: {},
      animateStyle: {},
    };
  },
  computed: {
    event() {
      return this.hubEventStore.event;
    },
    type() {
      return this.event?.entity?.type === 'course' ? 'lecture' : 'event';
    },
    calendarList() {
      return this.hubCalendarStore.calendarList;
    },
  },
  watch: {
    // 'hubCalendarStore.createDate'() {
    //   this.onSetStyle();
    // },
    'hubCalendarStore.createStyle': {
      handler() {
        this.onSetStyle();
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.onSetStyle();
    // window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // window.removeEventListener('resize', this.handleResize);
    this.hubCalendarStore.createStyle.left = null;
    this.hubCalendarStore.createStyle.top = null;
  },
  methods: {
    async onSetStyle() {
      if (!this.$refs.main) {
        return;
      }
      const rect = this.$refs.main.getBoundingClientRect();
      const top =
        this.hubCalendarStore.createStyle.top ||
        this.height / 2 - rect.height / 2 + 60;
      const maxH = Math.max(0, this.height - 620);
      this.mainStyle = {
        left: this.hubCalendarStore.createStyle.left
          ? `${this.hubCalendarStore.createStyle.left}px`
          : `50%`,
        top: top > maxH ? `${maxH}px` : `${top}px`,
      };
      const translate = this.hubCalendarStore.createStyle.left
        ? this.hubCalendarStore.createStyle.index > 2
          ? `translate(20px, 0)`
          : `translate(-20px, 0)`
        : `translate(0, 20px)`;
      this.animateStyle = {
        transform: translate,
        opacity: 0,
      };
      await sleep(300);
      this.animateStyle = {
        transform: 'none',
        transition: `all .2s ease-in-out`,
        opacity: 1,
      };
      await sleep(100);
      this.animateStyle = {
        transform: 'none',
        transition: `none`,
        opacity: 1,
      };
    },
    // handleResize() {
    //   this.onSetStyle();
    // },
  },
};
</script>

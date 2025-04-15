<template>
  <OrganizationHubSidebarWrap :open="open">
    <div
      class="mb-2 flex h-12 shrink-0 items-center justify-between rounded-t bg-white/5 px-2"
    >
      <div class="flex items-center gap-3 text-sm">
        <BaseIconClose data-cy="calendar-sidebar-close-icon" @click="onClose" />
        {{
          detail.id ? $t('calendar.name') : $t('event.schedule.calendar.new')
        }}
      </div>
    </div>

    <div
      class="hide-scrollbar flex h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
    >
      <div
        class="mb-2 flex cursor-pointer items-center gap-2 bg-white/5 px-4 py-5 hover:bg-white/10"
        data-cy="calendar-sidebar-on-add-detail-box"
        @click="onAddDetail"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-5 border border-dashed border-white/30"
          :style="{ color: detail.color }"
        >
          <i class="fa-solid fa-calendar text-xl" />
        </div>
        <div class="flex w-0 flex-1 flex-col gap-1">
          <div class="truncate text-base text-white">
            {{
              detail.name
                ? detail.name
                : $t('event.schedule.calendar.add.title')
            }}
          </div>
          <div v-if="!detail.createdAt" class="text-xs text-[#707070]">
            {{ $t('event.schedule.create.now') }}
          </div>
          <div v-else class="truncate text-xs text-[#707070]">
            {{ formatDate(detail.createdAt, 'hh:mm a DD MMM YYYY') }}
          </div>
        </div>
      </div>

      <div
        class="mb-2 flex cursor-pointer items-center gap-2 bg-white/5 px-4 py-5 hover:bg-white/10"
        data-cy="57a47ba3bc43e5b8"
        @click="onAddSchedule"
      >
        <div class="flex h-12 w-12 items-center justify-center">
          <i class="fa-regular fa-calendar-days text-xl text-[#FAFAFA]" />
        </div>
        <div class="flex w-0 flex-1 items-center gap-1">
          <div class="w-0 flex-1 text-base text-[#F1F1F1]">
            {{ $t('event.schedule.label') }}
          </div>
          <div class="flex items-center gap-0.5 text-xs font-medium">
            <div
              v-for="(item, m) in weeks"
              :key="item"
              class="flex items-center gap-0.5"
            >
              <span v-if="m > 0" class="text-[#707070]">|</span>
              <div
                :class="
                  !scheduleNotKeys.includes(item)
                    ? 'text-[d9d9d9]'
                    : 'text-[#707070]/30'
                "
              >
                {{ $t(weeksLabel[m]) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrganizationHubSidebarMember v-if="detail.id" type="calendar" />
    </div>
  </OrganizationHubSidebarWrap>
</template>
<script>
export default {
  setup() {
    const hubCalendar = useHubCalendarStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCalendar, hubSidebar };
  },
  data() {
    return {
      open: false,
      weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      weeksLabel: [
        'index.week.sun',
        'index.week.mon',
        'index.week.tue',
        'index.week.wed',
        'index.week.thu',
        'index.week.fri',
        'index.week.sat',
      ],
      kesMap: {
        sunday: 'Sun',
        monday: 'Mon',
        tuesday: 'Tue',
        wednesday: 'Wed',
        thursday: 'Thu',
        friday: 'Fri',
        saturday: 'Sat',
      },
    };
  },
  computed: {
    calendar() {
      return this.hubSidebar.calendar;
    },
    detail() {
      return this.calendar.data;
    },
    scheduling() {
      return this.detail.scheduling;
    },
    scheduleNotKeys() {
      const List = [];
      for (const key in this.scheduling) {
        if (this.scheduling[key][0] === false) {
          List.push(this.kesMap[key]);
        }
      }
      return List;
    },
  },
  watch: {
    'detail.id'() {
      this.init();
    },
  },
  mounted() {
    setTimeout(() => {
      this.open = true;
    }, 100);
    this.init();
  },
  beforeUnmount() {
    this.hubSidebar.$reset();
  },
  methods: {
    onClose() {
      this.hubSidebar.state = false;
    },
    onAddDetail() {
      this.calendar.detailState = true;
    },
    onAddSchedule() {
      if (this.detail.id) {
        this.calendar.scheduleState = true;
      } else {
        this.$toast.error(this.$t('event.schedule.error.calendar'));
      }
    },
    async init() {
      if (this.detail.id) {
        const data = await this.hubCalendar.retriveCalendar({
          id: this.detail.id,
        });
        this.calendar.data = { ...data };
        this.detail.scheduling = cloneDeep(data.schedule);
      }
    },
  },
};
</script>

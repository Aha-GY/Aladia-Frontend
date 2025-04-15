<template>
  <div
    class="relative h-6 w-full cursor-pointer transition-all hover:brightness-75"
    :class="[personalMembersClass, filterMembersClass]"
    data-cy="calendar-month-item-box"
  >
    <div
      v-if="entry?.rightRounded"
      class="absolute -right-[1.125rem] top-0 h-6 w-6 overflow-hidden"
    >
      <div
        class="h-full w-full -translate-x-2.5 rotate-45 border"
        :style="{
          'border-color': entry.color,
          'background-color': entry.color,
        }"
      />
    </div>

    <div
      v-if="entry?.leftRounded"
      class="absolute -left-[1.125rem] top-0 h-6 w-6 overflow-hidden"
    >
      <div
        class="h-full w-full translate-x-2.5 rotate-45 border"
        :style="{
          'border-color': entry.color,
          'background-color': entry.color,
        }"
      />
    </div>
    <div
      :data-cy="`calendar-event-${dataCy}-month-item-cursor-pointer`"
      class="relative flex h-full w-full cursor-pointer select-none items-center overflow-hidden rounded-5 pr-1"
      :class="[
        entry?.rightRounded ? 'rounded-r-none border-r-0' : '',
        entry?.leftRounded ? 'rounded-l-none border-l-0' : '',
      ]"
      :style="{
        'background-color': entry.color,
      }"
    >
      <div
        v-if="isShow && !isPersonal"
        :data-cy="`calendar-event-${dataCy}-month-item-isShow`"
        class="absolute left-0 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-l-5 bg-black/80"
        :class="[
          entry?.rightRounded ? 'rounded-r-none' : '',
          entry?.leftRounded ? 'rounded-l-none' : '',
        ]"
      >
        <i
          v-if="isDisabled"
          :data-cy="`calendar-event-${dataCy}-month-item-isDisabled`"
          class="fa-solid fa-ban text-xs text-[#C4362F]"
        />
        <i
          v-else-if="isPast"
          :data-cy="`calendar-event-${dataCy}-month-item-isPast`"
          class="fa-solid fa-clock-rotate-left text-xs text-[#E0B92C]"
        />
        <!-- <i
          v-else-if="isPersonal"
          class="fa-solid fa-lock-keyhole text-xs text-[#555555]"
        /> -->
        <BaseLive
          v-else-if="isLive"
          :data-cy="`calendar-event-${dataCy}-month-item-isLive`"
          class="h-6 w-6 scale-50"
        />
      </div>
      <div class="pointer-events-none relative h-6 w-6">
        <BaseAvatar
          :picture="entry?.ownerProfilePicture"
          :round="false"
          class="size-full !p-0"
        />
        <div
          v-if="memberLength || isPersonal"
          class="mask-bg absolute bottom-0 left-0 flex h-4 w-full items-center justify-center text-9 font-semibold text-[#d9d9d9]"
        >
          <div v-if="memberLength">+{{ memberLength }}</div>
          <i
            v-if="isPersonal"
            class="fa-solid fa-lock-keyhole text-[#555D9D9D9555]"
          />
        </div>
      </div>
      <div
        :data-cy="`calendar-event-${dataCy}-month-item-isCourse`"
        class="w-0 flex-1 gap-0.5 truncate pl-1 pr-0.5 text-xs text-white/80"
      >
        <i v-if="isCourse" class="fa-solid fa-book text-8" />
        {{
          entry.isPersonal
            ? $t('org.members.none')
            : entry.name || $t('org.noTitle')
        }}
      </div>
      <div
        v-if="!entry.isAll && !$device.isMobile"
        :data-cy="`calendar-event-${dataCy}-month-item-notIsAll`"
        class="shrink-0 text-11 text-white/80"
      >
        {{ formatDate(entry.startDate, 'HH:mm') }}
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
  props: {
    entry: Object,
    dataCy: {
      type: String,
      default: 'calendar-event-id',
    },
  },
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore };
  },
  data() {
    return {
      isLive: null,
      isPast: null,
      timer: null,
    };
  },
  computed: {
    members() {
      return this.hubCalendarStore.members;
    },
    memberLength() {
      return this.isCourse
        ? this.entry.courseObserverNumber +
            this.entry.courseTeacherNumber +
            this.entry.courseAttendantNumber -
            1
        : this.entry.guestNumber + this.entry.coHostNumber;
    },
    filterEventIds() {
      return this.hubCalendarStore.filterEvents.map((r) => r.id);
    },
    filterMembersClass() {
      let isExist = true;
      // this.members.forEach((member) => {
      //   if (!this.entry?.membersIds.includes(member.id)) {
      //     isExist = false;
      //   }
      // });
      if (!this.filterEventIds.includes(this.entry.id)) {
        isExist = false;
      }
      return isExist
        ? 'shadow-[0px_4px_4px_rgba(0,0,0,0.4)]'
        : this.members.length && !this.entry.isPersonal
          ? 'opacity-40'
          : '';
    },
    personalMembersClass() {
      return this.entry.isPersonal
        ? 'w-[calc(100% + 1.25rem)] -translate-x-5 shadow-[0px_4px_4px_rgba(0,0,0,0.4)]'
        : '';
    },
    isCourse() {
      return this.entry?.entityType === 'course';
    },
    live() {
      return this.entry?.roomStatus === 'live';
    },
    dates() {
      return this.entry.dates;
    },
    isPersonal() {
      return this.entry.isPersonal;
    },
    isShow() {
      return this.isLive || this.isPast || this.isDisabled;
    },
    isDisabled() {
      return this.entry.isDisabled;
    },
  },
  watch: {
    dates() {
      this.init();
    },
  },
  mounted() {
    this.init();
    this.timer = setInterval(() => {
      this.init();
    }, 50000);
  },
  unmounted() {
    clearInterval(this.timer);
  },
  methods: {
    init() {
      const diff = dayjs(this.entry.endDate).diff(
        dayjs(this.entry.startDate),
        'minute',
      );
      if (diff % 1440 === 0) {
        this.isLive =
          dayjs().isBetween(
            dayjs(this.entry.startDate).startOf('day'),
            dayjs(this.entry.endDate).endOf('day'),
            null,
            '[]',
          ) && this.live;
        this.isPast = dayjs().isAfter(dayjs(this.entry.endDate).endOf('day'));
      } else {
        this.isLive =
          dayjs().isBetween(
            dayjs(this.entry.startDate),
            dayjs(this.entry.endDate),
            null,
            '[]',
          ) && this.live;
        this.isPast = dayjs().isAfter(this.entry.endDate);
      }
    },
  },
};
</script>
<style scoped>
.mask-bg {
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.7) 57.69%,
    rgba(24, 24, 24, 0) 100%
  );
}
</style>

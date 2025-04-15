<template>
  <div
    class="relative flex shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-5 transition-all hover:bg-white/5 active:scale-95"
    :class="entryId === entry.id ? 'bg-[#E5E5E505]' : ''"
    :style="{
      border: entry.id === 'create' ? `1px solid ${entry.color}` : '',
    }"
  >
    <div class="relative h-14 w-14">
      <div
        v-if="isShow && !isPersonal"
        class="absolute left-0 top-0 z-10 flex h-14 w-14 items-center justify-center rounded-5 bg-black/80"
      >
        <i
          v-if="isPast"
          class="fa-solid fa-clock-rotate-left text-xs text-[#E0B92C]"
        />
        <BaseLive v-else-if="isLive" class="h-6 w-6 scale-50" />
      </div>
      <BaseAvatar
        :picture="entry?.ownerProfilePicture"
        :round="false"
        class="size-full"
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
    <div class="flex w-0 flex-1 flex-col gap-0.5 rounded-r-sm">
      <div class="flex items-center gap-2">
        <i
          v-if="isCourse"
          class="fa-solid fa-book text-8"
          :style="{
            color: isPersonal ? '#393939' : entry.color,
          }"
        />
        <div
          v-else
          class="h-2 w-2 rounded-sm"
          :style="{
            'background-color': isPersonal ? '#393939' : entry.color,
          }"
        />
        <div class="text-base">
          {{
            entry.isPersonal
              ? $t('org.members.none')
              : entry.name || $t('org.noTitle')
          }}
        </div>
      </div>
      <div class="text-xs font-medium text-[#707070]">
        {{
          entry.isAll
            ? $t('org.calendar.allDay')
            : `${formatDate(entry.startDate, 'HH:mm')}-${formatDate(entry.endDate, 'HH:mm')}`
        }}
      </div>
    </div>
    <div
      v-if="isLive"
      class="flex h-4 items-center gap-1 self-start rounded-bl-md rounded-tr-md bg-[#B91C1C] px-1"
    >
      <div class="h-1.5 w-1.5 rounded-full bg-white" />
      <div class="text-xs font-medium text-white">
        {{ $t('org.calendar.live') }}
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
    isCourse() {
      return this.entry?.entityType === 'course';
    },
    memberLength() {
      return this.isCourse
        ? this.entry.courseObserverNumber +
            this.entry.courseTeacherNumber +
            this.entry.courseAttendantNumber -
            1
        : this.entry.guestNumber + this.entry.coHostNumber;
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
      return this.isLive || this.isPast;
    },
    entryId() {
      return this.hubCalendarStore.createOpen
        ? this.hubCalendarStore.entryId
        : null;
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

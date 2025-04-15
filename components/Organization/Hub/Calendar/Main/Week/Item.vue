<template>
  <div
    v-if="isShow && entry.height >= 25 && nowWidth > 60 && !isPersonal"
    class="absolute left-0 top-0 z-10 flex items-center justify-center rounded-br-5 bg-black/80"
    :class="entry.height === 25 ? 'h-6 w-6' : 'h-8 w-8'"
  >
    <i v-if="isDisabled" class="fa-solid fa-ban text-xs text-[#C4362F]" />
    <i
      v-else-if="isPast"
      class="fa-solid fa-clock-rotate-left text-xs text-[#E0B92C]"
    />
    <BaseLive v-else-if="isLive" class="h-6 w-6 scale-50" />
  </div>
  <div
    v-if="entry.height >= 25 && nowWidth > 60"
    class="pointer-events-none relative overflow-hidden rounded-5 shadow-[2px_1px_4px_rgba(0,0,0,0.4)]"
    :class="entry.height === 25 ? 'h-6 w-6' : 'h-8 w-8'"
  >
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
    class="flex w-0 flex-1 pr-1"
    :class="[
      entry.height <= 25 ? 'h-full flex-row items-center' : 'h-6 items-center',
      entry.height === 25 ? 'h-6' : '',
    ]"
  >
    <div
      class="gap-0.5 truncate pl-1 text-xs text-white/80"
      :class="[entry.height <= 25 ? 'w-0 flex-1' : '']"
    >
      <i v-if="isCourse" class="fa-solid fa-book text-8" />
      {{
        entry.isPersonal
          ? $t('org.members.none')
          : entry.name || $t('org.noTitle')
      }},
    </div>
    <div class="shrink-0 pl-1 text-11 text-white/80">
      {{ formatDate(entry.startDate, 'HH:mm') }}
      <!-- -
      {{ formatDate(entry.endDate, 'hh:mma') }} -->
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
    maxWidth: [String, Number],
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
    nowWidth() {
      return this.maxWidth * this.entry.width;
    },
    memberLength() {
      return this.isCourse
        ? this.entry.courseObserverNumber +
            this.entry.courseTeacherNumber +
            this.entry.courseAttendantNumber -
            1
        : this.entry.guestNumber + this.entry.coHostNumber;
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

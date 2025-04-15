<template>
  <div v-if="frequency.type === 'custom'" class="pl-9">
    <div class="mb-4 flex items-center gap-4">
      <div class="text-xs text-white/50">
        {{ $t('course.duration.repeat.every') }}
      </div>
      <div class="group/line relative w-12 pb-1">
        <input
          v-model="frequency.counter"
          class="w-full bg-transparent text-center outline-none"
          data-cy="1ee7ecfbc66b8810"
          @focus="counterFocus = true"
          @blur="
            counterFocus = false;
            onGetavailable();
          "
          @input="frequency.counter = frequency.counter.replace(/[^0-9]/g, '')"
        />
        <BaseLine :active="counterFocus" />
      </div>
      <div
        ref="unitRef"
        class="group/line relative flex w-40 cursor-text items-center justify-between pb-1"
        data-cy="d44986196f7228cf"
        @click="unitOpen = !unitOpen"
      >
        <div v-if="!frequency.periodicity && !unitOpen" class="text-white/50">
          {{ $t('course.duration.select') }}
        </div>
        <div v-if="frequency.periodicity" class="text-white">
          {{ $t(units[frequency.periodicity]) }}
        </div>
        <i v-if="unitOpen" class="fa-light fa-angles-up-down text-white/20" />
        <BaseLine :active="unitOpen" />
      </div>
    </div>
    <div v-if="frequency.periodicity === 'week'">
      <div class="mb-2 text-xs text-white/50">
        {{ $t('course.duration.repeat.on') }}
      </div>
      <div class="flex items-center gap-1">
        <div
          v-for="(day, index) in days"
          :key="day"
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-xs capitalize"
          :class="
            frequency.days.includes(index)
              ? 'bg-[#8d4bf6] text-white'
              : 'text-white/50'
          "
          data-cy="4d6b9e00b8949a1e"
          @click="onDayClick(index)"
        >
          {{ $t(day) }}
        </div>
      </div>
    </div>
    <div v-if="frequency.periodicity === 'month'">
      <div class="mb-2 text-xs text-white/50">
        {{ $t('course.duration.repeat.on') }}
      </div>
      <div
        ref="monthRef"
        class="group/line relative flex w-64 cursor-text items-center justify-between pb-1"
        data-cy="990b96c158298d7f"
        @click="monthOpen = !monthOpen"
      >
        <div v-if="!frequency.monthlySelection" class="text-white/50">
          {{ $t('course.duration.select') }}
        </div>
        <div v-if="frequency.monthlySelection" class="text-white">
          {{ months[frequency.monthlySelection] }}
        </div>
        <i v-if="monthOpen" class="fa-light fa-angles-up-down text-white/20" />
        <BaseLine :active="monthOpen" />
      </div>
    </div>
  </div>
  <div v-if="frequency.type !== 'does-not-repeat'" class="pl-9">
    <div class="mb-2 text-xs text-white/50">
      {{ $t('course.duration.end.on') }}
    </div>
    <OrganizationHubEventEndDate />
  </div>
  <div class="relative -mb-4">
    <BasePopup
      id="create-unit"
      :open="unitOpen"
      :store="hubEvent"
      :button-ref="unitRef"
      :arrow="false"
      :offset="5"
      :width="144"
      placement="bottom-start"
      :teleported="false"
      @close="unitOpen = false"
    >
      <div class="p-1">
        <div class="mb-1 flex flex-col gap-1 text-xs font-light">
          <div
            v-for="(unit, key) in units"
            :key="key"
            class="cursor-pointer rounded px-1.5 py-1 hover:bg-white/5"
            data-cy="62b0e01df033e23d"
            @click="onPeriodicityChange(key)"
          >
            {{ $t(unit) }}
          </div>
        </div>
        <BasePopupBottom @close="unitOpen = false" />
      </div>
    </BasePopup>
    <BasePopup
      id="create-unit"
      :open="monthOpen"
      :store="hubEvent"
      :button-ref="monthRef"
      :arrow="false"
      :offset="5"
      :width="208"
      placement="bottom-start"
      @close="monthOpen = false"
    >
      <div class="p-1">
        <div class="mb-1 flex flex-col gap-1 text-xs font-light">
          <div
            v-for="(month, key) in months"
            :key="key"
            class="cursor-pointer rounded px-1.5 py-1 hover:bg-white/5"
            data-cy="448be204a4857f01"
            @click="onMonthChange(key)"
          >
            {{ month }}
          </div>
        </div>
        <BasePopupBottom @close="monthOpen = false" />
      </div>
    </BasePopup>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  setup() {
    const unitOpen = ref(false);
    const unitRef = ref(null);
    const monthRef = ref(null);
    const monthOpen = ref(false);
    const hubEvent = useHubEventStore();
    return { hubEvent, unitOpen, unitRef, monthRef, monthOpen };
  },
  data() {
    return {
      counterFocus: false,
      units: {
        day: 'course.price.timeline.day',
        week: 'course.price.timeline.week',
        month: 'course.price.timeline.month',
      },
      days: [
        'index.week.short.sun',
        'index.week.short.mon',
        'index.week.short.tue',
        'index.week.short.wed',
        'index.week.short.thu',
        'index.week.short.fri',
        'index.week.short.sat',
      ],
    };
  },
  computed: {
    course() {
      return this.hubEvent.course;
    },
    chapter() {
      return this.hubEvent.chapter;
    },
    event() {
      return this.hubEvent.event;
    },
    frequency() {
      return this.event.frequency;
    },
    months() {
      const { startDate } = this.event.dates;
      const date = startDate ? dayjs(new Date(startDate)) : dayjs();
      const day = date.date();
      const weekDay = date.day();
      const monthDay = date.format('DD');
      const weekNumber = Math.ceil(day / 7);
      const weekDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const ordinalSuffixes = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
      return {
        'specific-day-of-month': `Monthly on Day ${monthDay}`,
        'specific-weekday-of-month': `Monthly on the ${ordinalSuffixes[weekNumber - 1]} ${
          weekDays[weekDay]
        }`,
      };
    },
  },
  methods: {
    onPeriodicityChange(key) {
      this.frequency.periodicity = key;
      if (!this.frequency.days) {
        this.frequency.days = [];
      }
      this.unitOpen = false;
      this.onGetavailable();
    },
    onGetavailable() {
      if (
        this.frequency.counter &&
        this.frequency.endDate &&
        this.frequency.periodicity === 'week' &&
        this.frequency.days?.length
      ) {
        this.availableCalendar();
      }
      if (
        this.frequency.counter &&
        this.frequency.endDate &&
        this.frequency.monthlySelection &&
        this.frequency.periodicity === 'month'
      ) {
        this.availableCalendar();
      }
      if (
        this.frequency.counter &&
        this.frequency.endDate &&
        this.frequency.periodicity === 'day'
      ) {
        this.availableCalendar();
      }
    },
    onMonthChange(key) {
      this.frequency.monthlySelection = key;
      this.monthOpen = false;
      if (this.frequency.endDate && this.frequency.counter) {
        this.availableCalendar();
      }
    },
    onDayClick(index) {
      const days = this.frequency.days;
      const dayIndex = days.indexOf(index);
      if (dayIndex === -1) {
        days.push(index);
      } else {
        days.splice(dayIndex, 1);
      }
      if (this.frequency.endDate && this.frequency.counter) {
        this.availableCalendar();
      }
    },
    availableCalendar() {
      this.hubEvent.availableCalendar({
        dates: this.event.dates,
        frequency: this.event.frequency,
      });
    },
  },
};
</script>

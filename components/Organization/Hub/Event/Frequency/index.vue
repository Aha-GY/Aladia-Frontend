<template>
  <div class="relative flex items-center gap-4">
    <div class="flex w-5 justify-center">
      <i class="fa-light fa-rotate text-base text-white/20" />
    </div>
    <div class="flex-1">
      <div
        ref="buttonRef"
        class="group/line relative flex cursor-text items-center justify-between pb-1"
        data-cy="calendar-event-frequency-lable"
        @click="open = !open"
      >
        <div v-if="!type && !open" class="text-white/50">
          {{ $t('course.duration.frequency') }}
        </div>
        <div v-if="!type && open" class="text-white/50">
          {{ $t('course.duration.select') }}
        </div>
        <div v-if="type" class="text-white">
          {{ $t(types[type]) }}
        </div>
        <i v-if="open" class="fa-light fa-angles-up-down text-white/20" />
        <BaseLine :active="open" />
      </div>
    </div>
    <BasePopup
      id="create-frequency"
      :open="open"
      :store="hubEvent"
      :button-ref="buttonRef"
      :arrow="false"
      :offset="5"
      :width="388"
      placement="bottom-start"
      :teleported="false"
      @close="open = false"
    >
      <div ref="popupRef" class="p-2">
        <div class="mb-2 flex flex-col gap-1 text-xs font-light">
          <div
            v-for="(type, key) in types"
            :key="key"
            class="cursor-pointer rounded px-1.5 py-1 hover:bg-white/5"
            :data-cy="`${key}-frequency-of-the-event`"
            @click="onTypeChange(key)"
          >
            {{ $t(type) }}
          </div>
        </div>
        <BasePopupBottom @close="open = false" />
      </div>
    </BasePopup>
  </div>
  <OrganizationHubEventFrequencyCustom />
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  setup() {
    const open = ref(false);
    const buttonRef = ref(null);
    const popupRef = ref(null);
    const hubEvent = useHubEventStore();

    onClickOutside(
      buttonRef,
      () => {
        open.value = false;
      },
      {
        ignore: [popupRef],
      },
    );

    return { hubEvent, open, buttonRef, popupRef };
  },
  data() {
    return {
      types: {
        'does-not-repeat': 'course.duration.repeat.never',
        daily: 'course.duration.repeat.daily',
        weekly: 'course.duration.repeat.weekly',
        monthly: 'course.duration.repeat.monthly',
        custom: 'course.duration.repeat.custom',
      },
    };
  },
  computed: {
    event() {
      return this.hubEvent.event;
    },
    dates() {
      return this.event.dates;
    },
    frequency() {
      return this.event.frequency;
    },
    type() {
      return this.event.frequency.type;
    },
    isGetavailable() {
      if (this.type === 'does-not-repeat') {
        return true;
      } else if (this.type === 'custom') {
        if (this.frequency.periodicity === 'week') {
          return (
            !!this.frequency.days.length &&
            !!this.frequency.counter &&
            !!this.frequency.endDate
          );
        } else if (this.frequency.periodicity === 'month') {
          return (
            !!this.frequency.monthlySelection &&
            !!this.frequency.counter &&
            !!this.frequency.endDate
          );
        } else {
          return !!this.frequency.counter && !!this.frequency.endDate;
        }
      } else {
        return !!this.frequency.endDate;
      }
    },
  },
  methods: {
    onTypeChange(type) {
      this.event.frequency.type = type;
      if (type === 'custom') {
        const periodicity = this.frequency.periodicity;
        if (periodicity === 'week') {
          this.frequency.counter = 1;
          this.frequency.days = [dayjs(new Date(this.dates.startDate)).day()];
        }
      }
      this.open = false;
      if (this.isGetavailable) {
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

<template>
  <div class="relative flex items-center gap-2">
    <div class="flex w-7 shrink-0 items-center gap-0.5 pt-4">
      <div
        class="h-3"
        :style="{ background: calendarColor || '#B7B7B7' }"
        :class="
          filterCalendars.length ? 'w-1.5 rounded-l-sm' : 'ml-1 w-3 rounded-sm'
        "
      />
      <div
        v-for="item in filterCalendars.slice(0, 1)"
        :key="item.id"
        class="h-3"
        :style="{ background: item.color }"
        :data-cy="item.id"
        :class="
          filterCalendars.length > 1 ? 'w-1.5 rounded-l-sm' : 'w-3 rounded-sm'
        "
      />
      <div
        v-if="filterCalendars.length > 1"
        class="-ml-0.5 flex h-5 w-5 items-center justify-center rounded bg-white/5 text-10 text-[#D9D9D9] backdrop-blur"
      >
        +{{ filterCalendars.length - 1 }}
      </div>
    </div>
    <slot />
    <div
      v-if="logged && !disabled"
      ref="buttonRef"
      class="shrink-0 cursor-pointer items-center gap-2 rounded-md border px-1.5 py-1 transition-all"
      :class="open ? 'border-transparent bg-white/5' : 'border-white/50'"
      data-cy="calendar-event-choose-calendar-button"
      @click="openCalendar"
    >
      <div
        v-if="calendarId || courseCalendarId"
        class="text-xs font-medium text-[#B0B0B0]"
      >
        {{ sharedCalendars.length + 1 }} {{ $t('calendar.label') }}
      </div>
      <div
        v-else
        class="flex items-center gap-1.5 text-xs font-medium text-[#B0B0B0]"
      >
        {{ $t('calendar.choose') }}
        <i class="fa-solid fa-circle-exclamation text-[#FAFAFA]" />
      </div>
    </div>
  </div>
  <div
    class="pointer-events-none absolute left-0 top-[3.25rem] h-[calc(100%-3.25rem)] w-full overflow-hidden transition-all duration-300"
    :class="open ? 'z-40' : '-z-10'"
  >
    <Transition
      :name="open ? 'slide-fade-left' : 'slide-fade-right'"
      mode="out-in"
    >
      <div
        v-if="open"
        class="pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-b-5 bg-[#060606]"
      >
        <div class="flex items-center gap-1 px-2 pb-2 pt-3">
          <div
            class="flex size-8 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
            @click="open = false"
          >
            <i class="fa-light fa-arrow-left text-base text-[#FAFAFA]" />
          </div>
          <div class="text-sm">Add Event to Calendars</div>
        </div>
        <div class="h-0 flex-1 px-4 py-2">
          <OrganizationHubEventCalendar />
        </div>
        <div
          ref="footRef"
          class="flex items-center justify-between bg-[#0c0c0c] p-3"
        >
          <BaseButton
            icon="fa-arrow-turn-left"
            label="$t:base.dialog.close"
            type="red-cancel"
            data-cy="event-cancel-button"
            @click="
              open = false;
              show = false;
            "
          />
          <div
            class="flex items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 active:scale-95"
            :class="
              isSubmit
                ? 'cursor-pointer hover:bg-[#181818] hover:text-white'
                : 'cursor-not-allowed'
            "
            data-cy="event-confirm-button"
            @click="onBeforeConfirm"
          >
            <i class="fa-light fa-check text-sm" />
            {{ $t('base.upload.confirm') }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
  <el-popover
    :visible="show"
    :virtual-ref="footRef"
    :show-arrow="false"
    :offset="10"
    :width="236"
    virtual-triggering
    :persistent="false"
    popper-class="!p-0"
    placement="top"
    @close="show = false"
  >
    <OrganizationHubEventCalendarOption
      @close="show = false"
      @save="onConfirm"
    />
  </el-popover>
</template>
<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    close: Function,
    disabled: Boolean,
  },
  setup() {
    const open = ref(false);
    const show = ref(false);
    const footRef = ref(null);
    const hubEvent = useHubEventStore();
    const authStore = useAuthStore();
    const hubSpaces = useHubSpacesStore();
    return { hubEvent, open, authStore, show, footRef, hubSpaces };
  },
  computed: {
    event() {
      return this.hubEvent.event;
    },
    dates() {
      return this.event.dates;
    },
    calendarId() {
      return this.event.calendarId;
    },
    calendarColor() {
      return this.event.color || this.hubEvent.course?.color;
    },
    courseCalendarId() {
      return this.hubEvent.course?.calendarId;
    },
    sharedCalendars() {
      return this.event.sharedCalendars || [];
    },
    calendars() {
      return this.event.calendars || [];
    },
    filterCalendars() {
      return this.calendars.filter((r) => this.sharedCalendars.includes(r.id));
    },
    isSubmit() {
      return (
        !!this.calendars.length || this.calendarId || this.courseCalendarId
      );
    },
    logged() {
      return this.authStore.logged;
    },
    isEvent() {
      return this.hubEvent.type === 'event';
    },
  },
  watch: {
    dates() {
      this.availableCalendar();
    },
  },
  beforeMount() {
    this.init();
  },
  methods: {
    async init() {
      if (!this.hubEvent.calendarList.length) {
        await this.hubEvent.getCalendarList();
      }
      if (!this.hubEvent.spaces.length) {
        this.hubEvent.spaces = await this.hubSpaces.previewSpace();
      }
      this.availableCalendar();
    },
    async availableCalendar() {
      if (
        (!this.event.id || this.event.id !== this.hubEvent.eventId) &&
        this.dates.startDate &&
        this.dates.endDate
      ) {
        await this.hubEvent.availableCalendar({
          dates: this.dates,
          frequency: this.event.frequency,
        });
        // const calendars = this.event.calendars;
        // for (let i = 0; i < calendars.length; i++) {
        //   const calendar = this.hubEvent.availableList.find(
        //     (r) => r.id === calendars[i].id,
        //   );
        //   if (calendar) {
        //     calendars[i] = calendar;
        //   }
        // }
      }
    },
    onBeforeConfirm() {
      if (!this.isSubmit) {
        return;
      }
      if (
        (!this.event.id && this.calendars.length === 1) ||
        (this.event.id && !this.calendars.length)
      ) {
        this.onConfirm();
      } else {
        this.show = true;
      }
    },
    onConfirm() {
      if (!this.isSubmit) {
        return;
      }

      if (this.isEvent && !this.event.id) {
        if (this.calendars.length) {
          this.event.calendarId = this.calendars[0].id;
          this.event.color = this.calendars[0].color;
          if (this.calendars[0]?.entity?.id) {
            this.event.entity = {
              id: this.calendars[0]?.entity?.id,
              type: 'course',
            };
          }

          this.event.sharedCalendars = this.calendars.slice(1).map((r) => r.id);
        } else {
          this.event.calendarId = null;
          this.event.color = '';
          this.event.entity = null;
          this.event.sharedCalendars = [];
        }
      } else {
        this.event.sharedCalendars = this.calendars.slice(1).map((r) => r.id);
      }
      this.setEndDate();

      this.show = false;
      this.open = false;
    },
    setEndDate() {
      const dates = this.event.dates;
      const calendar =
        this.hubEvent.availableList.find(
          (r) => r.id === this.event.calendarId,
        ) || {};
      if (dates?.startDate && calendar?.eventDuration) {
        this.event.dates.endDate = dayjs(new Date(dates.startDate))
          .add(calendar?.eventDuration, 'minute')
          .toISOString();
      }
    },
    openCalendar() {
      // if (this.hubEvent.availableList.length) {
      this.open = true;
      // }
    },
  },
};
</script>

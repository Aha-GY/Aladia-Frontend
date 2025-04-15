<template>
  <div class="flex h-full flex-col gap-2">
    <BaseInput
      v-model="name"
      search
      fixed
      :placeholder="$t('org.calendar.event.add')"
    />
    <div
      class="hide-scrollbar flex h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-none"
    >
      <div
        v-for="item in calendarList"
        :key="item.id"
        class="group/item flex gap-2 rounded-md p-1 px-3 hover:bg-white/5"
      >
        <div class="flex h-6 w-6 items-center justify-center">
          <i
            v-if="!disableds.includes(item.id)"
            class="fa-solid fa-calendar text-xs"
            :style="{
              color: item.color,
            }"
          />
          <i
            v-else
            class="fa-solid fa-calendar-circle-exclamation text-xs text-[#707070]"
          />
        </div>
        <div
          class="w-0 flex-1 truncate text-base text-[#909090]"
          :class="
            !disableds.includes(item.id)
              ? 'group-hover/item:text-[#FAFAFA]'
              : 'line-through'
          "
          v-html="getName(item)"
        />
        <div class="flex h-6 w-6 items-center justify-center">
          <BaseCheckboxStyle
            :disabled="disableds.includes(item.id)"
            :state="isChecked(item) ? 'checked' : 'unchecked'"
            :data-cy="`${item.id}-selected-calendar-id`"
            @click="onChange(item)"
          />
        </div>
      </div>
      <BaseSpace
        v-for="space in spaceList"
        :key="space.id"
        :space="space"
        :is-live="true"
        :search-value="name"
        :disableds="disableds"
        :actions="actions"
        :is-one-cycle="true"
        @change="onSpaceChange"
      />
      <BaseSkeleton v-show="loading" :length="10" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubEvent = useHubEventStore();
    const hubSpaces = useHubSpacesStore();
    return { hubEvent, hubSpaces };
  },
  data() {
    return {
      name: '',
      show: false,
      loading: false,
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
    isEvent() {
      return this.hubEvent.type === 'event';
    },
    calendarId() {
      return this.event.calendarId;
    },
    courseCalendarId() {
      return this.hubEvent.course?.calendarId;
    },
    calendars() {
      return this.event.calendars || [];
    },
    spaces() {
      return this.hubEvent.spaces || [];
    },
    spaceList() {
      return this.spaces.filter((space) => {
        const folders =
          space?.rootFolder?.subFolders.filter((r) => {
            const courses = r?.courses.filter(
              (r) =>
                r &&
                r.calendarId &&
                r.title.toLowerCase().includes(this.name.toLowerCase()),
            );

            return (
              courses.length ||
              r.name.toLowerCase().includes(this.name.toLowerCase())
            );
          }) || [];
        const courses = space?.rootFolder?.courses.filter(
          (r) =>
            r &&
            r.calendarId &&
            r.title.toLowerCase().includes(this.name.toLowerCase()),
        );
        return (
          folders.length ||
          courses.length ||
          space.name.toLowerCase().includes(this.name.toLowerCase())
        );
      });
    },
    actions() {
      const ids = [...(this.event.calendars || []).map((r) => r.id)];
      // 默认已添加
      // if (this.event.id && this.calendarId) {
      //   ids.push(this.calendarId);
      // }
      // if (this.event.id && this.courseCalendarId) {
      //   ids.push(this.courseCalendarId);
      // }
      return ids;
    },
    sharedCalendars() {
      return this.event.sharedCalendars || [];
    },
    calendarList() {
      return this.hubEvent.calendarList.filter((r) =>
        r.name.toLowerCase().includes(this.name.toLowerCase()),
      );
    },
    disableds() {
      return this.hubEvent.availableList
        .filter((r) => !r.available)
        .map((r) => r.id);
    },
  },
  // watch: {
  //   dates() {
  //     this.availableCalendar();
  //   },
  // },
  // beforeMount() {
  //   this.init();
  // },
  methods: {
    // async init() {
    //   this.loading = true;

    //   if (!this.hubEvent.calendarList.length) {
    //     await this.hubEvent.getCalendarList();
    //   }
    //   if (!this.hubEvent.spaces.length) {
    //     this.hubEvent.spaces = await this.hubSpaces.previewSpace();
    //   }
    //   this.availableCalendar();

    //   this.loading = false;
    // },
    // async availableCalendar() {
    //   if (
    //     (!this.event.id || this.event.id !== this.hubEvent.eventId) &&
    //     this.dates.startDate &&
    //     this.dates.endDate
    //   ) {
    //     await this.hubEvent.availableCalendar({
    //       dates: this.dates,
    //       frequency: this.event.frequency,
    //     });
    //     const calendars = this.event.calendars;

    //     for (let i = 0; i < calendars.length; i++) {
    //       const calendar = this.hubEvent.availableList.find(
    //         (r) => r.id === calendars[i].id,
    //       );
    //       if (calendar) {
    //         calendars[i] = calendar;
    //       }
    //     }
    //   }
    // },
    isChecked(item) {
      return (
        this.calendars.find((r) => r.id === item.id) ||
        (this.event.id && this.calendarId === item.id)
      );
    },
    onChange(item) {
      if (this.disableds.includes(item.id)) {
        return;
      }
      if (this.calendars.find((r) => r.id === item.id)) {
        this.event.calendars = this.calendars.filter((r) => r.id !== item.id);
      } else {
        this.calendars.push(item);
      }
    },
    async onSpaceChange(items, type) {
      if (type === 'add') {
        this.calendars.push(
          ...items.map((item) => ({
            ...item,
            id: item.calendarId,
            entity: {
              id: item.id,
              type: 'course',
            },
          })),
        );
      } else {
        const ids = items.map((r) => r.calendarId);
        this.event.calendars = this.calendars.filter(
          (r) => !ids.includes(r.id),
        );
      }
    },
    getName(item) {
      if (this.name) {
        return highlightKeywords(item.name || '', [this.name]);
      } else {
        return item.name;
      }
    },
  },
};
</script>

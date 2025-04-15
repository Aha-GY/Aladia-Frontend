<template>
  <OrganizationHubSidebarWrap :open="open">
    <div
      class="mb-4 flex h-12 items-center justify-between rounded-t bg-white/5 px-2"
      data-cy="abbf8cea155ddb14"
      @click="onClose"
    >
      <div
        class="flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
      >
        <i class="fa-light fa-arrow-left text-sm text-[#707070]" />
      </div>
    </div>

    <div
      class="hide-scrollbar flex h-0 flex-1 flex-col gap-2 overflow-y-auto px-2"
    >
      <div
        class="flex h-9 shrink-0 items-center gap-2 rounded-5 bg-white/5 px-1.5 text-base text-[#FAFAFA]"
      >
        <div class="size-6" />
        {{ $t('category.details') }}
      </div>

      <div class="flex items-end gap-2">
        <div class="flex size-6 items-center justify-center">
          <i class="fa-light fa-text text-sm text-[#707070]" />
        </div>

        <BaseInput
          v-model="detail.name"
          :title="$t('category.form.name.label')"
          required
          data-cy="calendar-title"
        />
      </div>
      <div class="flex items-end gap-2">
        <div class="flex size-6 items-center justify-center">
          <div
            class="size-4 rounded-sm"
            :style="{ background: detail.color }"
          />
        </div>

        <el-popover trigger="click" placement="bottom-start" width="400">
          <template #reference>
            <BaseInput
              v-model="detail.color"
              :title="$t('event.schedule.color')"
              readonly
              data-cy="calendar-theme-color"
            />
          </template>
          <LazyBaseColor
            :color="detail.color"
            data-cy="calendar-theme-color-popover"
            @change="onChangeColor"
          />
        </el-popover>
      </div>
      <div class="flex items-end gap-2">
        <div class="flex size-6 items-center justify-center">
          <i class="fa-light fa-clock text-sm text-[#707070]" />
        </div>

        <el-popover
          v-model:visible="visible.duration"
          trigger="click"
          placement="bottom-start"
          width="400"
        >
          <template #reference>
            <BaseInput
              v-model="duration"
              :title="$t('event.schedule.duration')"
              readonly
              data-cy="calendar-base-event-duration"
            />
          </template>
          <BaseSelect
            :data="durations"
            @select="
              (d) => {
                visible.duration = false;
                detail.eventDuration = d.key;
              }
            "
          />
        </el-popover>
      </div>

      <div class="flex items-end gap-2">
        <div class="flex size-6 items-center justify-center">
          <i class="fa-light fa-globe-pointer text-sm text-[#707070]" />
        </div>
        <el-popover
          v-model:visible="visible.timeZone"
          trigger="click"
          placement="bottom-start"
          width="400"
        >
          <template #reference>
            <BaseInput
              v-model="detail.timezoneValue"
              :title="$t('event.schedule.timezone')"
              data-cy="calendar-time-zone"
            />
          </template>
          <BaseSelectTimeZone
            :name="detail.timezoneValue"
            @select="
              (d) => {
                visible.timeZone = false;
                detail.timezone = `${d.zone}`;
                detail.timezoneValue = `${d.zone}`;
              }
            "
          />
        </el-popover>
      </div>

      <div class="my-7 px-2">
        <div class="mb-6 text-base text-white">
          {{ $t('event.schedule.activity') }}
        </div>
        <div
          class="flex flex-col items-center justify-center gap-4 rounded-5 bg-white/5 py-10"
        >
          <div class="text-base text-white">
            {{ $t('event.schedule.noActivity') }}
          </div>
          <i class="fa-solid fa-list-timeline text-[4rem] text-white" />
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between bg-white/5 px-4 py-2">
      <div
        class="flex cursor-pointer items-center gap-2 rounded bg-[#190e0d] px-2 py-1 text-sm font-light transition-all duration-300 active:scale-95"
        data-cy="calander-cancel-button"
        @click="onClose"
      >
        <i class="fa-light fa-trash-can text-xs" />
        {{ $t('base.upload.cancel') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        data-cy="calendar-save-button"
        @click="onSave"
      >
        <i v-if="saving" class="fa-light fa-loader animate-spin text-base" />
        <i v-else class="fa-light fa-save text-sm" />
        {{ $t('base.upload.save') }}
      </div>
    </div>
  </OrganizationHubSidebarWrap>
</template>
<script>
export default {
  setup() {
    const hubCalendar = useHubCalendarStore();
    const authStore = useAuthStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCalendar, authStore, hubSidebar };
  },
  data() {
    return {
      open: false,
      durations: [
        {
          label: this.$t('course.duration.minutes', { minute: 120 }),
          key: 120,
        },
        {
          label: this.$t('course.duration.minutes', { minute: 90 }),
          key: 90,
        },
        {
          label: this.$t('course.duration.minutes', { minute: 60 }),
          key: 60,
        },
        {
          label: this.$t('course.duration.minutes', { minute: 45 }),
          key: 45,
        },
        {
          label: this.$t('course.duration.minutes', { minute: 30 }),
          key: 30,
        },
      ],
      visible: {
        duration: false,
        timeZone: false,
      },
      saving: false,
    };
  },
  computed: {
    calendar() {
      return this.hubSidebar.calendar;
    },
    detail() {
      return this.calendar.data;
    },
    duration() {
      return this.detail.eventDuration
        ? `${this.detail.eventDuration} minutes`
        : '';
    },
  },
  mounted() {
    setTimeout(() => {
      this.open = true;
    }, 100);
    this.init();
  },
  methods: {
    init() {
      if (!this.detail.timezone) {
        this.detail.timezone = this.authStore?.user?.timezone;
        this.detail.timezoneValue = this.authStore?.user?.timezone;
      } else {
        this.detail.timezoneValue = this.detail.timezone;
      }
      if (!this.detail.eventDuration) {
        this.detail.eventDuration = 60;
      }
    },
    async onClose() {
      this.open = false;
      await sleep(500);
      this.calendar.detailState = false;
    },
    async onSave() {
      if (!this.detail.name) {
        this.$toast.info(this.$t('event.schedule.error.name'));
        return;
      }
      this.saving = true;
      // const filteredSchedule = Object.keys(this.schedule)
      //   .filter((key) => this.schedule[key].length)
      //   .reduce((obj, key) => {
      //     obj[key] = this.schedule[key];
      //     return obj;
      //   }, {});

      const data = {
        name: this.detail.name,
        type: 'public',
        color: this.detail.color,
        eventDuration: this.detail.eventDuration,
        timezone: this.detail.timezone,
      };
      if (this.detail.id) {
        data.id = this.detail.id;
        await this.hubCalendar.updateCalendar(data);
      } else {
        const { id } = await this.hubCalendar.createCalendar(data);
        this.detail.id = id;
      }
      this.saving = false;
      this.onClose();
    },
    onChangeColor(color) {
      this.detail.color = color;
    },
  },
};
</script>

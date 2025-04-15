<template>
  <OrganizationHubSidebarWrap :open="open">
    <div
      class="mb-4 flex h-12 items-center justify-between rounded-t bg-white/5 px-2"
    >
      <div
        class="flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
        data-cy="2fcc1cc78a1f7411"
        @click="onClose"
      >
        <i class="fa-light fa-arrow-left text-sm text-[#707070]" />
      </div>
    </div>

    <div class="flex h-0 flex-1 flex-col gap-2 px-2">
      <div
        class="flex h-9 items-center gap-2 rounded-5 px-1.5 text-base text-[#FAFAFA]"
      >
        <div class="size-6" />
        <div class="w-0 flex-1">
          {{ $t('event.schedule.label') }}
        </div>
        <el-popover
          v-model:visible="visible"
          trigger="click"
          :show-arrow="false"
          placement="bottom-start"
          width="176"
        >
          <template #reference>
            <div
              class="flex h-full w-[11rem] cursor-pointer items-center gap-1 rounded-5 bg-white/5 px-1.5"
            >
              <div class="flex h-6 w-6 items-center justify-center">
                <i
                  class="fa-regular fa-calendar-check text-xs text-[#FAFAFA]"
                />
              </div>
              <div class="w-0 flex-1 text-xs font-medium text-[#B0B0B0]">
                {{ $t(typeName) }}
              </div>
              <div class="flex h-6 w-6 items-center justify-center">
                <i class="fa-regular fa-chevron-down text-xs text-[#FAFAFA]" />
              </div>
            </div>
          </template>
          <ul class="popupborder flex flex-col gap-1.5 bg-[#060606] p-1.5">
            <BaseMenuItem
              v-for="item in typeList"
              :key="item.value"
              @click="onChangeType(item.value)"
            >
              {{ $t(item.label) }}
            </BaseMenuItem>
            <BaseMenuItem
              icon-class="fa-regular fa-rotate-left"
              class="justify-center bg-[#450A0A] text-[#EF4444]"
              @click="onChangeType(1)"
            >
              Reset Settings
            </BaseMenuItem>
          </ul>
        </el-popover>
      </div>

      <div class="flex gap-2 px-1.5">
        <div class="flex size-6 items-center justify-center">
          <i class="fa-light fa-calendar-clock text-sm text-[#707070]" />
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm font-semibold text-[#707070]">
            {{ $t('event.schedule.title') }}
          </div>
          <div class="text-xs text-[#707070]">
            {{ $t('event.schedule.desc') }}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 rounded-5 bg-white/10 px-3 py-1.5">
        <div class="flex w-0 flex-1 flex-col gap-1">
          <div
            class="text-sm"
            :class="
              detail.isScheduleEnforced ? 'text-[#F1F1F1]' : 'text-[#555]'
            "
          >
            {{ $t('event.schedule.outsideTitle') }}
          </div>
          <div class="text-xs font-medium text-[#707070]">
            <p>{{ $t('event.schedule.outsideDesc') }}</p>
            <p>{{ $t('event.schedule.outsideDesc2') }}</p>
          </div>
        </div>
        <BaseSwitcher
          :disabled="disabled"
          :icon="loading ? `fa-loader animate-spin` : ''"
          :active="!!detail.isScheduleEnforced"
          @change="onEnforcedChange"
        />
      </div>

      <div
        class="hide-scrollbar flex h-0 flex-1 flex-col gap-3 overflow-y-auto p-1.5 px-2.5"
      >
        <OrganizationHubSidebarCalendarScheduleItem
          v-for="(times, key) in schedule"
          :key="key"
          :title="$t(kesMap[key])"
          :unavailable="typeId === 2 && ['sunday', 'saturday'].includes(key)"
          :times="times"
          @copy="onCopy($event, key)"
          @change="typeId = 3"
          @error="onError"
        />
      </div>
    </div>

    <div class="flex items-center justify-between bg-white/5 px-4 py-2">
      <div
        class="flex cursor-pointer items-center gap-2 rounded bg-[#190e0d] px-2 py-1 text-sm font-light transition-all duration-300 active:scale-95"
        data-cy="9b9572bb57ff88bd"
        @click="onClose"
      >
        <i class="fa-light fa-trash-can text-xs" />
        {{ $t('base.upload.cancel') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        data-cy="1b65aac7d4af000e"
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
    const hubSidebar = useHubSidebarStore();
    return { hubCalendar, hubSidebar };
  },
  data() {
    return {
      open: false,
      schedule: {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      },
      kesMap: {
        sunday: 'index.week.sun',
        monday: 'index.week.mon',
        tuesday: 'index.week.tue',
        wednesday: 'index.week.wed',
        thursday: 'index.week.thu',
        friday: 'index.week.fri',
        saturday: 'index.week.sat',
      },
      saving: false,
      isError: false,
      visible: false,
      typeId: 1,
      typeList: [
        { label: 'event.schedule.allWeek', value: 1 },
        { label: 'event.schedule.dayOnly', value: 2 },
        { label: 'event.schedule.custom', value: 3 },
      ],
      loading: false,
    };
  },
  computed: {
    calendar() {
      return this.hubSidebar.calendar;
    },
    detail() {
      return this.calendar.data;
    },
    typeName() {
      return this.typeList.find((r) => r.value === this.typeId).label;
    },
    disabled() {
      let disabled = true;
      for (const key in this.schedule) {
        if (this.schedule[key].length) {
          disabled = false;
          break;
        }
      }
      return disabled;
    },
  },
  watch: {
    schedule: {
      handler() {
        this.$nextTick(() => {
          if (this.isError) {
            return;
          }
          this.detail.scheduling = cloneDeep(
            Object.keys(this.schedule)
              .filter((key) => this.schedule[key].length)
              .reduce((obj, key) => {
                // const List = this.schedule[key].filter(r => r.startTime < r.endTime);
                // if (List.length !== this.schedule[key].length) {
                //   this.isError = true;
                // }
                obj[key] = this.schedule[key];
                return obj;
              }, {}),
          );
        });
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    setTimeout(() => {
      this.open = true;
    }, 100);
    this.init();
  },
  methods: {
    async onClose() {
      this.open = false;
      await sleep(500);
      this.calendar.scheduleState = false;
    },
    init() {
      if (this.detail.id) {
        this.schedule = Object.assign(
          {},
          this.schedule,
          this.detail.scheduling,
        );
        for (const key in this.schedule) {
          if (this.schedule[key].length) {
            this.typeId = 3;
            break;
          }
        }
      }
    },
    onError(error) {
      this.isError = error;
    },
    onCopy(times, nowKey) {
      for (const key in this.schedule) {
        if (this.schedule[key][0] === false) {
          continue;
        }
        if (nowKey !== key) {
          this.schedule[key] = cloneDeep(times);
        }
      }
    },
    onChangeType(id) {
      this.typeId = id;
      if (id !== 3) {
        for (const key in this.schedule) {
          if (id === 2 && ['sunday', 'saturday'].includes(key)) {
            this.schedule[key] = [false];
          } else {
            this.schedule[key] = [];
          }
        }
      }
      this.visible = false;
    },
    async onSave() {
      if (this.isError) {
        this.$toast.error('Please select the correct schedule');
        return;
      }
      this.saving = true;

      const data = {
        name: this.detail.name,
        type: 'public',
        color: this.detail.color,
        eventDuration: this.detail.eventDuration,
        schedule: this.detail.scheduling,
        isScheduleEnforced: this.detail.isScheduleEnforced,
        id: this.detail.id,
      };

      await this.hubCalendar.updateCalendar(data);
      this.detail.schedule = cloneDeep(this.detail.scheduling);
      this.saving = false;
      this.onClose();
    },
    async onEnforcedChange() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      await this.hubCalendar.updateCalendar({
        id: this.detail.id,
        isScheduleEnforced: !this.detail.isScheduleEnforced,
      });
      this.loading = false;
      this.detail.isScheduleEnforced = !this.detail.isScheduleEnforced;
    },
  },
};
</script>

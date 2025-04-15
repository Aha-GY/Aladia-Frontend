<template>
  <div
    ref="buttonRef"
    class="calendar-setting hidden cursor-pointer font-light"
    :class="open ? 'text-white' : 'text-white/50'"
    data-cy="dba2e7529a145607"
    @click="open = !open"
  >
    <i class="fa-light fa-gear" />
    <BasePopup
      id="calendar-settings"
      :open="open"
      :button-ref="buttonRef"
      placement="bottom"
      @close="open = false"
    >
      <div ref="popup">
        <div class="mb-2 border-b border-white/50 pb-1">
          {{ $t('org.calendar.setting.title') }}
        </div>
        <div class="mb-2 text-xs text-white/50">
          {{ $t('org.calendar.setting.description') }}
        </div>
        <OrganizationHubCourseEditItem
          :value="durationEvent"
          :focus="durationEventFocus"
          :title="$t('event.duration.title')"
        >
          <div
            ref="durationEventRef"
            class="relative z-0 h-8 w-0 flex-1 cursor-pointer"
            :class="
              durationEventFocus || durationEvent ? 'opacity-100' : 'opacity-0'
            "
            data-cy="bc7a29b5f73e544e"
            @click="durationEventFocus = !durationEventFocus"
          >
            <div
              v-if="durationEvent"
              class="flex h-full items-center gap-2 text-white"
            >
              {{ durationEvent }}
            </div>
            <div v-else class="flex h-full items-center text-white/50">
              {{ $t('org.calendar.setting.select.duration.label') }}
            </div>
          </div>
        </OrganizationHubCourseEditItem>
        <OrganizationHubCourseEditItem
          :value="color"
          :focus="colorFocus"
          title="Color"
        >
          <div
            ref="colorRef"
            class="relative z-0 h-8 w-0 flex-1 cursor-pointer"
            :class="colorFocus || color ? 'opacity-100' : 'opacity-0'"
            data-cy="aad0ad8db90739c0"
            @click="colorFocus = !colorFocus"
          >
            <div v-if="color" class="flex h-full items-center gap-2 text-white">
              <div
                class="h-4 w-4 rounded"
                :style="{
                  backgroundColor: color,
                }"
              />
              {{ color }}
            </div>
            <div v-else class="flex h-full items-center gap-2 text-white/50">
              <div class="h-4 w-4 rounded bg-[#707070]" />
              {{ $t('org.calendar.setting.select.color') }}
            </div>
          </div>
        </OrganizationHubCourseEditItem>
        <div
          class="my-2 flex items-center justify-between text-13 text-white/50"
        >
          <div class="flex items-center gap-2">
            <i class="fa-light fa-calendar-clock text-sm" />
            {{ $t('org.calendar.setting.schedule') }}
          </div>
          <BaseSwitcherBig
            :active="scheduleSettings"
            @change="onScheduleSettingsChange"
          />
        </div>
      </div>
    </BasePopup>
    <BasePopup
      id="duration-event"
      :open="durationEventFocus"
      :store="hubCourse"
      :button-ref="durationEventRef"
      placement="bottom"
      :width="280"
      @close="durationEventFocus = false"
    >
      <div class="mb-2 text-13">
        <div
          class="cursor-pointer rounded px-1.5 py-1 hover:bg-white/5"
          data-cy="8f404920e6d70aa6"
          @click="onDurationEventChange('45 Minutes')"
        >
          {{ $t('org.calendar.setting.select.duration.min', { min: 45 }) }}
        </div>
        <div
          class="cursor-pointer rounded px-1.5 py-1 hover:bg-white/5"
          data-cy="aa6ef91736593af2"
          @click="onDurationEventChange('1 Hour')"
        >
          {{ $t('org.calendar.setting.select.duration.hour', { hour: 1 }) }}
        </div>
        <div
          class="cursor-pointer rounded px-1.5 py-1 hover:bg-white/5"
          data-cy="66b04fab784e4f97"
          @click="onDurationEventChange('1.5 Hour')"
        >
          {{ $t('org.calendar.setting.select.duration.hour', { hour: 1.5 }) }}
        </div>
        <div
          class="cursor-pointer rounded px-1.5 py-1 hover:bg-white/5"
          data-cy="d66a17c9b9c403e6"
          @click="onDurationEventChange('2 Hours')"
        >
          {{ $t('org.calendar.setting.select.duration.hour', { hour: 2 }) }}
        </div>
      </div>
      <BasePopupBottom @close="durationEventFocus = false" />
    </BasePopup>
    <BasePopup
      id="color"
      :open="colorFocus"
      :store="hubCourse"
      :button-ref="colorRef"
      placement="bottom"
      :width="280"
      @close="colorFocus = false"
    >
      <BaseColor :color="color" @change="onColorChange" />
      <BasePopupBottom @close="colorFocus = false" />
    </BasePopup>
  </div>
</template>

<script>
export default {
  setup() {
    const open = ref(false);
    const popup = ref(null);
    const buttonRef = ref(null);
    const durationEventRef = ref(null);
    const colorRef = ref(null);
    const hubCourse = useHubCoursesStore();

    onClickOutside(
      popup,
      () => {
        open.value = false;
      },
      {
        ignore: [buttonRef, '.el-popper'],
      },
    );

    return { hubCourse, open, popup, buttonRef, durationEventRef, colorRef };
  },
  data() {
    return {
      durationEvent: '',
      durationEventFocus: false,
      color: '',
      colorFocus: false,
      scheduleSettings: false,
    };
  },
  methods: {
    onDurationEventChange(val) {
      this.durationEvent = val;
      this.durationEventFocus = false;
    },
    onColorChange(val) {
      this.color = val;
    },
    onScheduleSettingsChange(val) {
      this.scheduleSettings = val;
    },
  },
};
</script>

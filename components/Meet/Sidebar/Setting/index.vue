<template>
  <div
    class="relative flex h-full w-full flex-col gap-2 overflow-hidden rounded-5 border border-white/10 bg-[#060606]"
  >
    <MeetSidebarHeader :title="$t('meet.setting.label')" icon="fa-gear" />

    <div class="bg-[#0D0D0D] px-4 py-2">
      <div
        class="flex cursor-pointer items-center gap-2 rounded-5 p-2 text-sm hover:bg-white/5"
        @click="open = 'device'"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-light fa-computer-speaker text-[#FAFAFA]" />
        </div>
        <div class="w-0 flex-1 truncate text-[#BBB]">
          {{ $t('meet.setting.device.controls') }}
        </div>
        <div class="flex h-6 w-6 items-center justify-center">
          <i class="fa-regular fa-chevron-right text-xs text-[#FAFAFA]" />
        </div>
      </div>

      <div
        class="flex cursor-pointer items-center gap-2 rounded-5 p-2 text-sm hover:bg-white/5"
        @click="open = 'notifications'"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-light fa-bell text-[#FAFAFA]" />
        </div>
        <div class="w-0 flex-1 truncate text-[#BBB]">
          {{ $t('meet.setting.notifications') }}
        </div>
        <div class="flex h-6 w-6 items-center justify-center">
          <i class="fa-regular fa-chevron-right text-xs text-[#FAFAFA]" />
        </div>
      </div>

      <div
        class="flex cursor-pointer items-center gap-2 rounded-5 p-2 text-sm hover:bg-white/5"
        @click="open = 'layout'"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-light fa-objects-column text-[#FAFAFA]" />
        </div>
        <div class="w-0 flex-1 truncate text-[#BBB]">
          {{ $t('meet.setting.layout') }}
        </div>
        <div class="flex h-6 w-6 items-center justify-center">
          <i class="fa-regular fa-chevron-right text-xs text-[#FAFAFA]" />
        </div>
      </div>
    </div>
    <div
      class="absolute left-0 top-0 h-full w-full"
      :class="open ? 'z-10' : 'pointer-events-none'"
    >
      <Transition
        :name="open ? 'slide-fade-left' : 'slide-fade-right'"
        mode="out-in"
      >
        <MeetSidebarSettingDevice v-if="open === 'device'" @back="open = ''" />
        <MeetSidebarSettingNotifications
          v-else-if="open === 'notifications'"
          @back="open = ''"
        />
        <MeetSidebarSettingLayout
          v-else-if="open === 'layout'"
          @back="open = ''"
        />
      </Transition>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      open: '',
    };
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    this.hmsStore.settingOpen = '';
  },
  methods: {
    init() {
      this.open = this.hmsStore.settingOpen;
    },
  },
};
</script>

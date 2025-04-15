<template>
  <div
    class="flex h-full w-full flex-col gap-2 overflow-hidden rounded-5 bg-[#0C0C0C]"
  >
    <MeetSidebarHeader :title="$t('meet.setting.device.controls')">
      <template #prefix>
        <div
          class="flex h-5 w-5 cursor-pointer items-center justify-center"
          @click="onBack"
        >
          <i class="fa-regular fa-arrow-left text-lg text-[#FAFAFA]" />
        </div>
      </template>
    </MeetSidebarHeader>

    <div
      class="hide-scrollbar flex flex-col gap-4 overflow-y-auto bg-[#0D0D0D] px-6 py-2"
    >
      <div
        class="m-auto h-[9.25rem] w-[16.5rem] shrink-0 overflow-hidden rounded-5"
      >
        <MeetPeer :peer="hmsLocalPeer" :is-preview="true" />
      </div>

      <div class="flex flex-col gap-1">
        <div class="text-sm text-[#FAFAFA]">
          {{ $t('meet.setting.device.video') }}
        </div>
        <el-select
          :model-value="videoInputDeviceId"
          :fallback-placements="['bottom', 'top']"
          popper-class="px-2"
          @change="onVideoChange"
        >
          <template #prefix>
            <div class="flex h-6 w-6 items-center justify-center">
              <i class="fa-regular fa-video" />
            </div>
          </template>
          <el-option
            v-for="item in videoInput"
            :key="item.deviceId"
            :label="item.label"
            :value="item.deviceId"
          />
        </el-select>
      </div>

      <div class="flex flex-col gap-1">
        <div class="text-sm text-[#FAFAFA]">
          {{ $t('meet.setting.device.audio') }}
        </div>
        <el-select
          :model-value="audioInputDeviceId"
          :fallback-placements="['bottom', 'top']"
          popper-class="px-2"
          @change="onAudioChange"
        >
          <template #prefix>
            <div class="flex h-6 w-6 items-center justify-center">
              <i class="fa-regular fa-microphone" />
            </div>
          </template>
          <el-option
            v-for="item in audioInput"
            :key="item.deviceId"
            :label="item.label"
            :value="item.deviceId"
          />
        </el-select>
      </div>

      <div class="flex flex-col gap-1">
        <div class="text-sm text-[#FAFAFA]">
          {{ $t('meet.setting.device.speaker') }}
        </div>
        <el-select
          :model-value="audioOutputDeviceId"
          :fallback-placements="['bottom', 'top']"
          popper-class="px-2"
          @change="onAudioOutChange"
        >
          <template #prefix>
            <div class="flex h-6 w-6 items-center justify-center">
              <i class="fa-regular fa-volume" />
            </div>
          </template>
          <el-option
            v-for="item in audioOutput"
            :key="item.deviceId"
            :label="item.label"
            :value="item.deviceId"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
import { hmsActions } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    hmsDevices() {
      return this.hmsStore.hmsDevices;
    },
    videoInput() {
      return this.hmsDevices.videoInput || [];
    },
    hmsLocalMediaSettings() {
      return this.hmsStore.hmsLocalMediaSettings;
    },
    videoInputDeviceId() {
      return this.hmsLocalMediaSettings.videoInputDeviceId;
    },
    audioInput() {
      return this.hmsDevices.audioInput || [];
    },
    audioOutput() {
      return this.hmsDevices.audioOutput || [];
    },
    audioInputDeviceId() {
      return this.hmsLocalMediaSettings.audioInputDeviceId;
    },
    audioOutputDeviceId() {
      return this.hmsLocalMediaSettings.audioOutputDeviceId;
    },
  },
  methods: {
    onBack() {
      this.$emit('back');
    },
    onVideoChange(deviceId) {
      if (this.videoInputDeviceId === deviceId) {
        return;
      }
      hmsActions.setVideoSettings({ deviceId });
    },
    onAudioChange(deviceId) {
      if (this.audioInputDeviceId === deviceId) {
        return;
      }
      hmsActions.setAudioSettings({ deviceId });
    },
    onAudioOutChange(deviceId) {
      if (this.audioOutputDeviceId === deviceId) {
        return;
      }
      hmsActions.setAudioOutputDevice({ deviceId });
    },
  },
};
</script>

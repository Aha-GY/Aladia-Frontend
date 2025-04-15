<template>
  <div class="flex items-center">
    <el-tooltip
      :disabled="$device.isMobile"
      effect="light"
      :content="
        hmsStore.hmsIsLocalVideoEnabled
          ? $t('meet.camera.off')
          : $t('meet.camera.on')
      "
      placement="top"
      :hide-after="0"
    >
      <div
        class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl text-[#FAFAFA] hover:bg-white/5"
        data-cy="c8d4321b791443ca"
        @click="toggleVideo"
      >
        <i v-if="hmsStore.hmsIsLocalVideoEnabled" class="fa-regular fa-video" />
        <i v-else class="fa-regular fa-video-slash" />
      </div>
    </el-tooltip>

    <el-popover
      :visible="show"
      trigger="click"
      :show-arrow="false"
      placement="top"
      width="400"
      :teleported="false"
      :persistent="false"
    >
      <template #reference>
        <div ref="btnRef" @click="show = !show">
          <el-tooltip
            :disabled="$device.isMobile"
            effect="light"
            :content="$t('meet.setting.video')"
            placement="top"
            :hide-after="0"
          >
            <div
              class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-[#FAFAFA] hover:bg-white/5"
            >
              <i
                class="fa-regular fa-chevron-up text-xs transition-all"
                :class="show ? 'rotate-180' : ''"
              />
            </div>
          </el-tooltip>
        </div>
      </template>

      <div class="relative flex flex-col p-1.5">
        <div
          v-for="item in videoInput"
          :key="item.deviceId"
          class="flex cursor-pointer items-center gap-2 rounded p-1.5 text-xs hover:bg-white/5"
          :class="videoInputDeviceId === item.deviceId ? 'text-[#E0B92C]' : ''"
          data-cy="571e5f08e27b2479"
          @click="setVideo(item.deviceId)"
        >
          <div class="w-0 flex-1 truncate">
            {{ item.label }}
          </div>
          <div class="flex w-12 shrink-0 items-center justify-center">
            <i
              v-if="videoInputDeviceId === item.deviceId"
              class="fa-solid fa-check"
            />
          </div>
          <div class="h-[1.875rem] w-[1px] bg-[#555]" />
          <div
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-5 text-[#FAFAFA]"
            :class="
              hmsStore.openPopup === 'visual'
                ? 'bg-white/5'
                : 'hover:bg-white/5'
            "
            @click="onOpen"
          >
            <i class="fa-regular fa-wand-magic-sparkles text-base" />
          </div>
          <div
            v-if="hmsStore.hmsIsConnectedToRoom"
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-5 text-[#FAFAFA]"
            :class="
              hmsStore.openPopup === 'setting'
                ? 'bg-white/5'
                : 'hover:bg-white/5'
            "
            @click="toggleSetting"
          >
            <i class="fa-regular fa-gear text-base" />
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import { selectLocalVideoTrackID } from '@100mslive/hms-video-store';

import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    const btnRef = ref(null);
    const show = ref(false);
    onClickOutside(
      btnRef,
      () => {
        show.value = false;
      },
      { ignore: ['.el-popper'] },
    );
    return { hmsStore, btnRef, show };
  },
  data() {
    return {
      // show: false,
    };
  },
  computed: {
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
  },
  methods: {
    async toggleVideo() {
      await hmsActions.setLocalVideoEnabled(
        !this.hmsStore.hmsIsLocalVideoEnabled,
      );
    },
    async setVideo(deviceId) {
      if (this.videoInputDeviceId === deviceId) {
        return;
      }
      await hmsActions.setVideoSettings({ deviceId });
    },
    onOpen() {
      const trackId = hmsStore.getState(selectLocalVideoTrackID);
      if (!trackId) {
        this.$toast.error(this.$t('meet.error.notFound.track'));
        return;
      }
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'visual' ? '' : 'visual';
    },
    toggleSetting() {
      this.hmsStore.settingOpen = 'device';
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'setting' ? '' : 'setting';
    },
  },
};
</script>

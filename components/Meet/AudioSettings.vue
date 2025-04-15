<template>
  <div class="flex items-center">
    <el-tooltip
      effect="light"
      :disabled="$device.isMobile"
      :content="
        hmsStore.hmsIsLocalAudioEnabled
          ? $t('meet.microphone.off')
          : $t('meet.microphone.on')
      "
      placement="top"
      :hide-after="0"
    >
      <div
        class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl text-[#FAFAFA] hover:bg-white/5"
        data-cy="48b4bdda4be46e73"
        @click="toggleAudio"
      >
        <i
          v-if="hmsStore.hmsIsLocalAudioEnabled"
          class="fa-regular fa-microphone"
        />
        <i v-else class="fa-regular fa-microphone-slash" />
      </div>
    </el-tooltip>

    <el-popover
      :visible="show"
      trigger="click"
      :show-arrow="false"
      placement="top"
      width="340"
      :teleported="false"
      :persistent="false"
    >
      <template #reference>
        <div ref="btnRef" @click="show = !show">
          <el-tooltip
            :disabled="$device.isMobile"
            effect="light"
            :content="$t('meet.setting.audio')"
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

      <div class="flex flex-col gap-1.5 bg-[#060606] py-1.5">
        <div class="flex flex-col gap-1.5 bg-[#0D0D0D] px-1.5">
          <div class="flex items-center gap-2 p-1.5">
            <div class="flex w-8 items-center justify-center">
              <i class="fa-solid fa-microphone" />
            </div>
            <div class="w-0 flex-1">
              {{ $t('meet.microphone.label') }}
            </div>
            <div
              class="flex h-6 w-6 items-center justify-center rounded-full"
              :class="hmsStore.hmsIsLocalAudioEnabled ? 'bg-[#191e27]' : ''"
            >
              <div
                v-if="hmsStore.hmsIsLocalAudioEnabled"
                class="flex h-4 items-center gap-0.5 transition-all"
              >
                <div
                  class="min-h-1 w-1 rounded-full bg-white"
                  :class="levelLock ? 'waveform-bar' : ''"
                  :style="{
                    height: level ? `${(level / 4) * 2}%` : '',
                  }"
                />
                <div
                  class="min-h-1 w-1 rounded-full bg-white"
                  :class="levelLock ? 'waveform-bar' : ''"
                  :style="{
                    height: level ? `${(level / 4) * 3}% ` : '',
                  }"
                />
                <div
                  class="min-h-1 w-1 rounded-full bg-white"
                  :class="levelLock ? 'waveform-bar' : ''"
                  :style="{
                    height: level ? `${(level / 4) * 2}%` : '',
                  }"
                />
              </div>
              <i
                v-if="!hmsStore.hmsIsLocalAudioEnabled"
                class="fa-regular fa-microphone-slash text-xs text-[#FAFAFA]"
              />
            </div>
            <div
              v-if="hmsStore.hmsIsConnectedToRoom"
              class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-5"
              :class="
                hmsStore.openPopup === 'setting'
                  ? 'bg-white/5'
                  : 'text-[#FAFAFA] hover:bg-white/5'
              "
              @click="toggleSetting"
            >
              <i class="fa-regular fa-gear text-xs" />
            </div>
          </div>
          <div
            v-for="item in audioInput"
            :key="item.deviceId"
            class="flex cursor-pointer items-center gap-2 rounded p-1.5 text-xs hover:bg-white/5"
            :class="
              audioInputDeviceId === item.deviceId ? 'text-[#E0B92C]' : ''
            "
            data-cy="65fe228dd56f3ead"
            @click="setAudioInput(item.deviceId)"
          >
            <div class="flex w-8 shrink-0 items-center justify-center">
              <i
                v-if="audioInputDeviceId === item.deviceId"
                class="fa-solid fa-check"
              />
            </div>
            {{ item.label }}
          </div>
        </div>
        <div class="flex flex-col gap-1.5 bg-[#0D0D0D] px-1.5">
          <div class="flex items-center gap-2 p-1.5">
            <div class="flex w-8 items-center justify-center">
              <i class="fa-solid fa-volume" />
            </div>
            <div class="w-0 flex-1">
              {{ $t('meet.setting.device.speaker') }}
            </div>
            <div
              class="cursor-pointer text-xs text-[#E0B92C]"
              data-cy="4c129abf17717142"
              @click="onPlay"
            >
              <audio
                v-show="false"
                ref="audioRef"
                src="https://100ms.live/test-audio.wav"
              />
              {{ playing ? $t('meet.play.sound') : $t('meet.play.test') }}
            </div>
          </div>
          <div
            v-for="item in audioOutput"
            :key="item.deviceId"
            class="flex cursor-pointer items-center gap-2 rounded p-1.5 text-xs hover:bg-white/5"
            :class="
              audioOutputDeviceId === item.deviceId ? 'text-[#E0B92C]' : ''
            "
            data-cy="11940b734ed17359"
            @click="setAudioOutput(item.deviceId)"
          >
            <div class="flex w-8 shrink-0 items-center justify-center">
              <i
                v-if="audioOutputDeviceId === item.deviceId"
                class="fa-solid fa-check"
              />
            </div>
            {{ item.label }}
          </div>
        </div>
        <div class="flex items-center gap-2 bg-[#0D0D0D] p-3">
          <div class="flex w-8 items-center justify-center">
            <i class="fa-solid fa-waveform-lines" />
          </div>
          <div class="w-0 flex-1">
            {{ $t('meet.setting.device.noise') }}
          </div>
          <BaseSwitcher :active="active" @change="onNoiseChange" />
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import { HMSKrispPlugin } from '@100mslive/hms-noise-cancellation';
import {
  selectPeerAudioByID,
  selectRoom,
  selectLocalAudioTrackID,
  selectIsLocalAudioPluginPresent,
} from '@100mslive/hms-video-store';

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
      playing: false,
      unsub1: null,
      level: 0,
      levelLock: false,
      active: false,
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    hmsDevices() {
      return this.hmsStore.hmsDevices;
    },
    audioInput() {
      return this.hmsDevices.audioInput || [];
    },
    audioOutput() {
      return this.hmsDevices.audioOutput || [];
    },
    hmsLocalMediaSettings() {
      return this.hmsStore.hmsLocalMediaSettings;
    },
    audioInputDeviceId() {
      return this.hmsLocalMediaSettings.audioInputDeviceId;
    },
    audioOutputDeviceId() {
      return this.hmsLocalMediaSettings.audioOutputDeviceId;
    },
  },
  watch: {
    hmsLocalPeer() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  unmounted() {
    if (this.unsub1) {
      this.unsub1();
    }
  },
  methods: {
    init() {
      if (this.hmsLocalPeer) {
        this.unsub1 = hmsStore.subscribe((level) => {
          this.level = level;
          if (this.level) {
            this.levelLock = true;
          } else {
            setTimeout(() => {
              this.levelLock = false;
            }, 1000);
          }
        }, selectPeerAudioByID(this.hmsLocalPeer.id));
      }
    },
    async toggleAudio() {
      await hmsActions.setLocalAudioEnabled(
        !this.hmsStore.hmsIsLocalAudioEnabled,
      );
    },
    async setAudioInput(deviceId) {
      if (this.audioInputDeviceId === deviceId) {
        return;
      }
      await hmsActions.setAudioSettings({ deviceId });
    },
    async setAudioOutput(deviceId) {
      if (this.audioOutputDeviceId === deviceId) {
        return;
      }
      await hmsActions.setAudioOutputDevice(deviceId);
    },
    async onPlay() {
      if (this.playing) {
        return;
      }
      this.playing = true;
      await this.$refs.audioRef.play();
      await sleep(1000);
      this.playing = false;
    },
    toggleSetting() {
      this.hmsStore.settingOpen = 'device';
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'setting' ? '' : 'setting';
    },
    async onNoiseChange(active) {
      const plugin = new HMSKrispPlugin();
      const isNoiseCancellationEnabled =
        hmsStore.getState(selectRoom)?.isNoiseCancellationEnabled;
      const localPeerAudioTrackID = hmsStore.getState(selectLocalAudioTrackID);
      const isPluginAdded = hmsStore.getState(
        selectIsLocalAudioPluginPresent(plugin.getName()),
      );

      if (
        !plugin.isSupported() ||
        !isNoiseCancellationEnabled ||
        !localPeerAudioTrackID
      ) {
        return;
      }

      if (active && !isPluginAdded) {
        await hmsActions.addPluginToAudioTrack(plugin);
      }
      if (!active && isPluginAdded) {
        await hmsActions.removePluginFromAudioTrack(plugin);
      }
      this.active = active;
    },
  },
};
</script>
<style lang="scss" scoped>
@keyframes waveform {
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.3);
  }
  100% {
    transform: scaleY(1);
  }
}

.waveform-bar {
  transition:
    all 0.3s ease-in-out,
    all 0.5s ease-in-out;
  animation: waveform 0.6s infinite;
}
</style>

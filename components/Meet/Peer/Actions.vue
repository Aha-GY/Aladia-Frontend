<template>
  <div
    class="absolute left-0 top-0 flex h-full w-full items-center justify-center"
    :class="hover || open ? 'opacity-100' : 'opacity-0'"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="flex items-center gap-2.5 rounded-full bg-black/30 p-1">
      <el-tooltip
        :disabled="$device.isMobile"
        effect="light"
        :content="
          isHost
            ? isPin
              ? $t('meet.actions.unPin.all')
              : $t('meet.actions.pin.all')
            : isPin
              ? $t('meet.actions.unPin.myself')
              : $t('meet.actions.pin.myself')
        "
        placement="bottom"
        :hide-after="0"
        popper-class="text-[#FAFAFA]"
        popper-style="position: fixed"
        :teleported="false"
      >
        <div
          class="flex cursor-pointer items-center justify-center rounded-full bg-black/10 text-[#B0B0B0] backdrop-blur transition-all hover:bg-black/30 hover:text-[#FAFAFA]"
          :class="sizeClass"
          data-cy="a82514c00851523c"
          @click="onPin"
        >
          <i
            class="fa-regular"
            :class="isPin ? 'fa-thumbtack-slash' : 'fa-thumbtack'"
          />
        </div>
      </el-tooltip>
      <el-tooltip
        :disabled="$device.isMobile"
        effect="light"
        :content="
          isHost
            ? isSpotlight
              ? $t('meet.actions.unSpotlight.all')
              : $t('meet.actions.spotlight.all')
            : isSpotlight
              ? $t('meet.actions.unSpotlight.myself')
              : $t('meet.actions.spotlight.myself')
        "
        placement="bottom"
        :hide-after="0"
        popper-class="text-[#FAFAFA]"
        popper-style="position: fixed"
        :teleported="false"
      >
        <div
          class="flex cursor-pointer items-center justify-center rounded-full bg-black/10 text-[#B0B0B0] backdrop-blur transition-all hover:bg-black/30 hover:text-[#FAFAFA]"
          :class="sizeClass"
          data-cy="0dce71c2952a61fa"
          @click="onSpotlight"
        >
          <i class="fa-regular fa-arrows" />
        </div>
      </el-tooltip>

      <el-popover
        v-if="
          peer.id !== hmsLocalPeer.id &&
          (showVideo || showAudio || hmsPermissions?.removeOthers)
        "
        v-model:visible="open"
        trigger="click"
        :show-arrow="false"
        placement="bottom"
        :width="200"
        popper-style="position: fixed"
        :teleported="false"
        :persistent="false"
      >
        <template #reference>
          <div>
            <el-tooltip
              :disabled="$device.isMobile"
              effect="light"
              :content="$t('meet.actions.more')"
              placement="bottom"
              :hide-after="0"
              popper-class="text-[#FAFAFA]"
              popper-style="position: fixed"
              :teleported="false"
            >
              <div
                class="flex cursor-pointer items-center justify-center rounded-full bg-black/10 text-[#B0B0B0] backdrop-blur transition-all hover:bg-black/30 hover:text-[#FAFAFA]"
                :class="sizeClass"
              >
                <i class="fa-regular fa-ellipsis-vertical" />
              </div>
            </el-tooltip>
          </div>
        </template>
        <div class="flex flex-col gap-1.5 p-1.5 text-xs text-[#E5E5E5]">
          <div
            v-if="showVideo"
            class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
            data-cy="e709fa90c2ad38f8"
            @click="onVideoMute"
          >
            <div class="flex h-5 w-5 items-center justify-center">
              <i
                class="fa-solid"
                :class="isVideoEnabled ? 'fa-video-slash' : 'fa-video'"
              />
            </div>
            <div class="font-medium">
              {{
                isVideoEnabled
                  ? $t('meet.actions.video.mute')
                  : $t('meet.actions.video.unmute')
              }}
            </div>
          </div>
          <div
            v-if="showAudio"
            class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
            data-cy="c5bcda9077bd8a5a"
            @click="onAudioMute"
          >
            <div class="flex h-5 w-5 items-center justify-center">
              <i
                class="fa-solid"
                :class="
                  isAudioEnabled ? 'fa-microphone-slash' : 'fa-microphone'
                "
              />
            </div>
            <div class="font-medium">
              {{
                isAudioEnabled
                  ? $t('meet.actions.audio.mute')
                  : $t('meet.actions.audio.unmute')
              }}
            </div>
          </div>
          <div
            v-if="hmsPermissions?.removeOthers"
            class="flex cursor-pointer items-center gap-2 rounded-5 p-1 text-[#AE2B26] transition-all hover:bg-white/5"
            data-cy="a794e8d0462a10e2"
            @click="onRemove"
          >
            <div class="flex h-5 w-5 items-center justify-center">
              <i class="fa-solid fa-user-minus" />
            </div>
            <div class="font-medium">
              {{ $t('meet.actions.remove.participant') }}
            </div>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>
<script>
import { hmsActions } from '~/utils/hms';

export default {
  props: {
    peer: {
      type: Object,
    },
    pinId: [String, null],
    spotlightId: [String, null],
    isVideoEnabled: Boolean,
    isAudioEnabled: Boolean,
    scale: {
      type: Number,
      default: 1,
    },
  },
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      open: false,
      hover: false,
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    isHost() {
      const roleName = this.hmsLocalPeer.roleName;
      return roleName === 'host' || roleName === 'co-host';
    },
    hmsPermissions() {
      return this.hmsStore.hmsPermissions;
    },
    isPin() {
      return (
        this.pinId === this.peer.id || this.hmsStore.pinId === this.peer.id
      );
    },
    isSpotlight() {
      return (
        this.spotlightId === this.peer.id ||
        this.hmsStore.spotlightId === this.peer.id
      );
    },
    sizeClass() {
      return this.scale < 0.2 ? 'h-6 w-6 text-xs' : 'h-9 w-9 text-base';
    },
    showAudio() {
      return (
        (this.hmsPermissions.mute && this.isAudioEnabled) ||
        (this.hmsPermissions.unmute && !this.isAudioEnabled)
      );
    },
    showVideo() {
      return (
        (this.hmsPermissions.mute && this.isVideoEnabled) ||
        (this.hmsPermissions.unmute && !this.isVideoEnabled)
      );
    },
  },
  methods: {
    onPin() {
      if (this.isHost) {
        if (this.pinId === this.peer.id) {
          hmsActions.sessionStore.set('pinId', null);
        } else {
          hmsActions.sessionStore.set('pinId', this.peer.id);
        }
      } else {
        if (this.hmsStore.pinId === this.peer.id) {
          this.hmsStore.pinId = null;
        } else {
          this.hmsStore.pinId = this.peer.id;
        }
      }
    },
    onSpotlight() {
      if (this.isHost) {
        if (this.spotlightId === this.peer.id) {
          hmsActions.sessionStore.set('spotlightId', null);
        } else {
          hmsActions.sessionStore.set('spotlightId', this.peer.id);
        }
      } else {
        if (this.hmsStore.spotlightId === this.peer.id) {
          this.hmsStore.spotlightId = null;
        } else {
          this.hmsStore.spotlightId = this.peer.id;
        }
      }
    },
    async onVideoMute() {
      try {
        await hmsActions.setRemoteTrackEnabled(
          this.peer.videoTrack,
          !this.isVideoEnabled,
        );
        if (!this.isVideoEnabled) {
          this.$toast.success(this.$t('meet.actions.video.sent'));
        }
      } catch (error) {
        // Permission denied or invalid track ID or not connected to room
        console.error(error);
      }
      this.open = false;
    },
    async onAudioMute() {
      try {
        await hmsActions.setRemoteTrackEnabled(
          this.peer.audioTrack,
          !this.isAudioEnabled,
        );
        if (!this.isAudioEnabled) {
          this.$toast.success(this.$t('meet.actions.audio.sent'));
        }
      } catch (error) {
        // Permission denied or invalid track ID or not connected to room
        console.error(error);
      }
      this.open = false;
    },
    async onRemove() {
      try {
        const reason = 'Good Bye';
        await hmsActions.removePeer(this.peer.id, reason);
      } catch (error) {
        // Permission denied or invalid peer ID or not connected to room
        console.error(error);
      }
      this.open = false;
    },
  },
};
</script>

<template>
  <div
    class="flex items-center gap-2 rounded-5 py-1.5 pl-0.5 pr-1.5 hover:bg-white/5"
  >
    <BaseAvatarNext
      :picture="peer.picture"
      size="md"
      :online="peer.online"
      :class="isJoin ? '' : 'opacity-60'"
    />
    <div class="w-0 flex-1">
      <div
        class="truncate text-base"
        :class="isJoin ? 'text-[#F1F1F1]' : 'text-[#707070]'"
      >
        {{ peer.name || peer.fullName || peer.email }}
        <span v-if="hmsLocalPeer.id === peer.id">({{ $t('meet.you') }})</span>
      </div>
      <div class="text-xs font-medium text-[#707070]">
        {{ peer.online ? $t('base.member.online') : $t('base.member.offline') }}
      </div>
    </div>
    <div
      v-if="isJoin"
      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
      :class="isAudioEnabled ? 'bg-[#191e27]' : ''"
    >
      <!-- <i
        v-if="isAudioEnabled && level"
        class="fa-regular fa-waveform-lines text-xs text-[#0A0A0A]"
      />
      <i
        v-if="isAudioEnabled && !level"
        class="fa-regular fa-ellipsis text-sm text-[#0A0A0A]"
      /> -->
      <div
        v-if="isAudioEnabled"
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
        v-if="!isAudioEnabled"
        class="fa-regular fa-microphone-slash text-xs text-[#FAFAFA]"
      />
    </div>
    <div
      v-else
      class="flex h-6 shrink-0 items-center justify-center rounded-5 bg-[#262626] px-1 text-xs font-medium text-[#FAFAFA]"
    >
      {{ $t('meet.actions.notJoined') }}
    </div>
    <el-popover
      v-if="isJoin"
      v-model:visible="open"
      trigger="click"
      :show-arrow="false"
      :width="200"
      placement="bottom"
      :teleported="false"
      :persistent="false"
    >
      <template #reference>
        <div
          class="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
        >
          <i class="fa-regular fa-ellipsis text-xs text-[#FAFAFA]" />
        </div>
      </template>
      <div class="flex flex-col gap-1.5 p-1.5 text-xs text-[#E5E5E5]">
        <div
          v-for="option in options"
          :key="option.type"
          class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
          data-cy="c3154e26386cd7d9"
          @click="onChange(option.type)"
        >
          <div class="flex h-5 w-5 items-center justify-center">
            <i class="fa-regular" :class="option.icon" />
          </div>
          {{ $t(option.name) }}
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import {
  selectIsPeerAudioEnabled,
  selectIsPeerVideoEnabled,
  selectPeerAudioByID,
  selectSessionStore,
} from '@100mslive/hms-video-store';

import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  props: {
    peer: Object,
    isJoin: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      isAudioEnabled: false,
      isVideoEnabled: false,
      unsub1: null,
      unsub2: null,
      unsub3: null,
      unsub4: null,
      level: 0,
      levelLock: false,
      open: false,
      pinId: null,
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
    isPin() {
      return (
        this.pinId === this.peer.id || this.hmsStore.pinId === this.peer.id
      );
    },
    hmsPermissions() {
      return this.hmsStore.hmsPermissions;
    },
    options() {
      const options = [
        {
          name: this.isPin ? 'meet.options.unPin' : 'meet.options.pin',
          icon: this.isPin ? 'fa-thumbtack-slash' : 'fa-thumbtack',
          type: 'pin',
        },
      ];
      if (this.peer.id !== this.hmsLocalPeer.id) {
        if (
          (this.hmsPermissions.mute && this.isAudioEnabled) ||
          (this.hmsPermissions.unmute && !this.isAudioEnabled)
        ) {
          options.push({
            name: this.isAudioEnabled
              ? 'meet.actions.audio.mute'
              : 'meet.actions.audio.unmute',
            icon: this.isAudioEnabled ? 'fa-microphone-slash' : 'fa-microphone',
            type: 'audio',
          });
        }
        if (
          (this.hmsPermissions.mute && this.isVideoEnabled) ||
          (this.hmsPermissions.unmute && !this.isVideoEnabled)
        ) {
          options.push({
            name: this.isVideoEnabled
              ? 'meet.actions.video.mute'
              : 'meet.actions.video.unmute',
            icon: this.isVideoEnabled ? 'fa-video-slash' : 'fa-video',
            type: 'video',
          });
        }
      }
      if (
        this.hmsPermissions?.removeOthers &&
        this.peer.id !== this.hmsLocalPeer.id
      ) {
        options.push({
          name: 'meet.actions.remove.call',
          icon: 'fa-user-minus',
          type: 'remove',
        });
      }

      if (this.peer.roleName === 'host') {
        return [
          {
            name: this.isHost
              ? this.isPin
                ? 'meet.actions.unPin.screen.all'
                : 'meet.actions.pin.screen.all'
              : this.isPin
                ? 'meet.actions.unPin.screen.myself'
                : 'meet.actions.pin.screen.myself',
            icon: this.isPin ? 'fa-thumbtack-slash' : 'fa-thumbtack',
            type: 'pin',
          },
        ];
      } else if (this.peer.roleName === 'co-host') {
        if (
          this.hmsPermissions?.changeRole &&
          this.peer.id !== this.hmsLocalPeer.id
        ) {
          options.push({
            name: 'meet.actions.remove.coHost',
            icon: 'fa-circle-minus',
            type: 'changeRole',
          });
        }
        return [
          ...options,
          {
            name: 'meet.actions.write.report.abuse',
            icon: 'fa-circle-exclamation',
            type: 'report',
          },
        ];
      } else {
        return [
          ...options,
          {
            name: 'meet.actions.write.report.abuse',
            icon: 'fa-circle-exclamation',
            type: 'report',
          },
        ];
      }
    },
  },
  mounted() {
    if (this.isJoin) {
      this.init();
    }
  },
  unmounted() {
    this.unAll();
  },
  methods: {
    init() {
      this.unsub1 = hmsStore.subscribe((enabled) => {
        this.isAudioEnabled = enabled;
      }, selectIsPeerAudioEnabled(this.peer.id));

      this.unsub3 = hmsStore.subscribe((enabled) => {
        this.isVideoEnabled = enabled;
      }, selectIsPeerVideoEnabled(this.peer.id));

      this.unsub2 = hmsStore.subscribe((level) => {
        this.level = level;
        if (this.level) {
          this.levelLock = true;
        } else {
          setTimeout(() => {
            this.levelLock = false;
          }, 1000);
        }
      }, selectPeerAudioByID(this.peer.id));

      this.unsub4 = hmsStore.subscribe((id) => {
        this.pinId = id;
      }, selectSessionStore('pinId'));
    },
    unAll() {
      if (this.unsub1) {
        this.unsub1();
      }
      if (this.unsub2) {
        this.unsub2();
      }
      if (this.unsub3) {
        this.unsub3();
      }
      if (this.unsub4) {
        this.unsub4();
      }
    },
    async onChange(type) {
      switch (type) {
        case 'pin':
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
          break;
        case 'audio':
          try {
            await hmsActions.setRemoteTrackEnabled(
              this.peer.audioTrack,
              !this.isAudioEnabled,
            );
          } catch (error) {
            // Permission denied or invalid track ID or not connected to room
            console.error(error);
          }
          break;
        case 'video':
          try {
            await hmsActions.setRemoteTrackEnabled(
              this.peer.videoTrack,
              !this.isVideoEnabled,
            );
          } catch (error) {
            // Permission denied or invalid track ID or not connected to room
            console.error(error);
          }
          break;
        case 'remove':
          try {
            const reason = 'Good Bye';
            await hmsActions.removePeer(this.peer.id, reason);
          } catch (error) {
            // Permission denied or invalid peer ID or not connected to room
            console.error(error);
          }
          break;
        case 'changeRole':
          try {
            await hmsActions.changeRoleOfPeer(this.peer.id, 'guest', true);
          } catch (error) {
            // Permission denied or invalid peer ID or not connected to room
            console.error(error);
          }
          break;
        case 'report':
          break;
        default:
          break;
      }
      this.open = false;
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

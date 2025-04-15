<template>
  <div
    class="flex items-center gap-2 rounded-5 py-1.5 pl-0.5 pr-1.5 hover:bg-white/5"
  >
    <BaseAvatarNext :picture="peer.picture" size="md" :online="peer.online" />
    <div class="w-0 flex-1">
      <div class="text-base text-[#F1F1F1]">
        {{ peer.name || peer.fullName || peer.email }}
        <span v-if="hmsLocalPeer.id === peer.id">({{ $t('meet.you') }})</span>
      </div>
      <div class="text-xs font-medium text-[#707070]">
        <span v-if="hmsLocalPeer.id === peer.id">
          {{ $t('meet.actions.your') }}
        </span>
        {{ $t('meet.actions.presentation.label') }}
      </div>
    </div>
    <div
      v-if="pinId === peer.id || hmsStore.pinId === peer.id"
      class="flex h-6 w-6 items-center justify-center rounded-5"
    >
      <i class="fa-regular fa-thumbtack text-xs text-[#FAFAFA]" />
    </div>
    <el-popover
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
          class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
        >
          <i class="fa-regular fa-ellipsis text-xs text-[#FAFAFA]" />
        </div>
      </template>
      <div class="flex flex-col gap-1.5 p-1.5 text-xs text-[#E5E5E5]">
        <div
          class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
          @click="onChange('pin')"
        >
          <div class="flex h-5 w-5 items-center justify-center">
            <i
              class="fa-solid"
              :class="
                pinId === peer.id || hmsStore.pinId === peer.id
                  ? 'fa-thumbtack-slash'
                  : 'fa-thumbtack'
              "
            />
          </div>
          {{
            pinId === peer.id || hmsStore.pinId === peer.id
              ? $t('meet.actions.presentation.unPin')
              : $t('meet.actions.presentation.pin')
          }}
        </div>
        <div
          v-if="peer.id !== hmsLocalPeer.id"
          class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
          @click="onChange('watch')"
        >
          <div class="flex h-5 w-5 items-center justify-center">
            <i
              class="fa-solid"
              :class="isWatch ? 'fa-video' : 'fa-video-slash'"
            />
          </div>
          {{
            isWatch
              ? $t('meet.actions.presentation.watch.start')
              : $t('meet.actions.presentation.watch.stop')
          }}
        </div>
        <div
          v-if="peer.id === hmsLocalPeer.id"
          class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
          @click="onChange('stop')"
        >
          <div class="flex h-5 w-5 items-center justify-center">
            <i class="fa-solid fa-square-xmark" />
          </div>
          {{ $t('meet.actions.presentation.stop') }}
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { selectSessionStore } from '@100mslive/hms-video-store';

import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  props: {
    peer: Object,
  },
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      unsub1: null,
      pinId: null,
      open: false,
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
    isWatch() {
      const screenTrackId = this.peer?.auxiliaryTracks[0];
      return this.hmsStore.screenTrackId === screenTrackId;
    },
  },
  mounted() {
    this.init();
  },
  unmounted() {
    this.unAll();
  },
  methods: {
    init() {
      this.unsub1 = hmsStore.subscribe((id) => {
        this.pinId = id;
      }, selectSessionStore('pinId'));
    },
    unAll() {
      if (this.unsub1) {
        this.unsub1();
      }
    },
    async onChange(type) {
      const screenTrackId = this.peer?.auxiliaryTracks[0];
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
        case 'watch':
          if (this.hmsStore.screenTrackId === screenTrackId) {
            this.hmsStore.screenTrackId = null;
          } else {
            this.hmsStore.screenTrackId = screenTrackId;
          }
          break;
        case 'stop':
          if (this.hmsLocalPeer.id === this.peer.id) {
            await hmsActions.setScreenShareEnabled(false);
          } else {
            // const track = await hmsStore.getState(
            //   selectScreenShareByPeerID(this.peer.id),
            // );
            // console.log(track);
            // (this.peer.auxiliaryTracks || []).forEach((trackId) => {
            //   hmsActions.setRemoteTrackEnabled(trackId, false);
            // });
          }
          break;
        default:
          break;
      }
      this.open = false;
    },
  },
};
</script>

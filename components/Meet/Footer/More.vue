<template>
  <el-popover
    :visible="show"
    trigger="click"
    :show-arrow="false"
    placement="top"
    :width="248"
    :teleported="false"
    :persistent="false"
  >
    <template #reference>
      <div ref="btnRef" class="flex items-center" @click="show = !show">
        <el-tooltip
          :disabled="$device.isMobile"
          effect="light"
          :content="$t('meet.option.more')"
          placement="top"
          :hide-after="0"
        >
          <div
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl text-[#FAFAFA]"
            :class="
              show || hmsStore.dialog.hls ? 'bg-white/5' : 'hover:bg-white/5'
            "
          >
            <i class="fa-regular fa-ellipsis-vertical" />
          </div>
        </el-tooltip>
      </div>
    </template>

    <div class="flex flex-col gap-2.5 p-1.5 text-sm text-[#E5E5E5]">
      <div
        v-if="isHost"
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        data-cy="0b594d4b316029ad"
        @click="toggleRecording"
      >
        <div v-if="isRunning" class="flex h-5 w-5 items-center justify-center">
          <div class="h-3 w-3 rounded-sm bg-[#ED3C28]" />
        </div>
        <BaseLive v-else class="h-5 w-5 scale-50" />
        {{ isRunning ? $t('meet.recording.stop') : $t('meet.recording.start') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        data-cy="e2c1b355e81e6f9b"
        @click="
          layoutOpen = true;
          show = false;
        "
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-solid fa-objects-column" />
        </div>
        {{ $t('meet.layout.change') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        data-cy="9a82ff32a6ace197"
        @click="toggleFullscreen"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i
            class="fa-solid"
            :class="isFullscreen ? 'fa-compress-wide' : 'fa-expand-wide'"
          />
        </div>
        {{
          isFullscreen
            ? $t('meet.layout.fScreen.quit')
            : $t('meet.layout.fScreen.label')
        }}
      </div>
      <div
        v-if="!$device.isMobile && isSupported"
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        data-cy="2939df6a2cbf8c73"
        @click="togglePIP"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-solid fa-square-arrow-up-right" />
        </div>
        {{
          hmsStore.showPIP
            ? $t('meet.layout.pip.disable')
            : $t('meet.layout.pip.enable')
        }}
      </div>
      <div
        v-if="hmsIsLocalVideoEnabled"
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        data-cy="ccea2781aaa061ad"
        @click="onVisual"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-solid fa-wand-magic-sparkles" />
        </div>
        {{ $t('meet.layout.apply.visual') }}
      </div>
    </div>
  </el-popover>
  <client-only>
    <el-dialog
      v-model="layoutOpen"
      :show-close="false"
      align-center
      destroy-on-close
      width="342px"
      class="!rounded-5"
    >
      <div
        class="flex items-center justify-between gap-5 rounded-t-5 bg-[#0C0C0C] p-4"
      >
        <i class="fa-regular fa-objects-column text-sm text-[#B0B0B0]" />
        <div class="text-base text-[#B0B0B0]">
          {{ $t('meet.layout.change') }}
        </div>
        <BaseIconClose
          data-cy="bb5b5ef1eb961834"
          @click.stop="layoutOpen = false"
        />
      </div>
      <div class="flex flex-col gap-2 rounded-b-5 p-2">
        <div class="text-xs font-medium text-[#707070]">
          {{ $t('meet.layout.save') }}
        </div>
        <BaseCheckboxList
          v-for="item in layouts"
          :key="item.key"
          :icon="item.icon"
          :name="item.name"
          class="text-[#FAFAFA]"
          :active="item.key === layout.view"
          @change="layout.view = item.key"
        />

        <div class="flex flex-col gap-1.5 p-1.5">
          <div class="text-sm text-[#F1F1F1]">
            {{ $t('meet.layout.tile.label') }}
          </div>
          <div class="text-xs font-medium text-[#707070]">
            {{ $t('meet.layout.tile.max') }}
          </div>
        </div>

        <div class="flex items-center gap-5 p-1.5">
          <div class="flex h-4 w-4 items-center justify-center">
            <i class="fa-regular fa-grid-2" />
          </div>
          <div class="relative w-full pr-2">
            <el-slider
              v-model="layout.maxTileCount"
              :max="49"
              :min="1"
              :show-tooltip="false"
            />
            <div
              class="absolute -bottom-1.5 -ml-1.5 -translate-x-1/2 text-xs font-medium text-[#FAFAFA]"
              :style="{ left: `${(layout.maxTileCount / 49) * 100}%` }"
            >
              {{ layout.maxTileCount }}
            </div>
          </div>
          <div class="flex h-4 w-4 items-center justify-center">
            <i class="fa-regular fa-grid" />
          </div>
        </div>
        <div class="py-1.5">
          <BaseSwitcherList
            class="text-[#FAFAFA]"
            :name="$t('meet.layout.tile.hide')"
            :active="layout.hideWithoutVideo"
            :change="() => (layout.hideWithoutVideo = !layout.hideWithoutVideo)"
          />
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
import { selectLocalVideoTrackID } from '@100mslive/hms-video-store';

import { hmsStore } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    const globalStore = useGlobalStore();
    const btnRef = ref(null);
    const show = ref(false);
    onClickOutside(
      btnRef,
      () => {
        show.value = false;
      },
      { ignore: ['.el-popper'] },
    );
    return { hmsStore, globalStore, btnRef, show };
  },
  data() {
    return {
      // show: false,
      layoutOpen: false,
      layouts: [
        {
          name: 'meet.layout.tiled',
          key: 'Tiled',
          icon: 'fa-grid-horizontal',
        },
        {
          name: 'meet.layout.sidebar',
          key: 'Sidebar',
          icon: 'fa-sidebar fa-regular',
        },
      ],
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    hmsIsLocalVideoEnabled() {
      return this.hmsStore.hmsIsLocalVideoEnabled;
    },
    isHost() {
      const roleName = this.hmsLocalPeer.roleName;
      return roleName === 'host' || roleName === 'co-host';
    },
    layout() {
      return this.hmsStore.layout;
    },
    hmsPeers() {
      if (this.layout.hideLocalVideo) {
        return this.hmsStore.hmsPeers
          .filter((peer) => !peer.isLocal)
          .slice(0, this.layout.maxTileCount);
      }
      return this.hmsStore.hmsPeers.slice(0, this.layout.maxTileCount);
    },
    hmsHLSState() {
      return this.hmsStore.hmsHLSState;
    },
    isRunning() {
      return this.hmsHLSState?.running;
    },
    isFullscreen() {
      return document.fullscreenElement;
    },
    routePath() {
      return this.globalStore.routePath;
    },
    isSupported() {
      return 'documentPictureInPicture' in window;
    },
  },
  watch: {
    async routePath() {
      if (!this.hmsStore.showPIP && this.isSupported) {
        this.togglePIP();
      }
    },
  },
  methods: {
    toggleRecording() {
      if (this.isRunning) {
        this.hmsStore.dialog.stophls = true;
      } else {
        this.hmsStore.dialog.hls = true;
      }
      this.show = false;
    },
    toggleFullscreen() {
      const element = document.getElementById('meet-container');
      if (!document.fullscreenElement) {
        element.requestFullscreen().catch((err) => {
          console.error(
            `${this.$t('meet.layout.fScreen.tile.error')} ${err.message} (${err.name})`,
          );
        });
      } else {
        document.exitFullscreen();
      }
      this.show = false;
    },
    togglePIP() {
      if (!this.isSupported) {
        this.$toast.error(this.$t('meet.layout.pip.error'));
        return;
      }
      if (this.hmsStore.showPIP) {
        this.hmsStore.showPIP = false;
      } else {
        this.hmsStore.showPIP = true;
      }
      this.show = false;
    },
    // startPIP() {
    //   PictureInPicture.start(hmsActions, (isOn) => {
    //     this.isPIP = isOn;
    //     if (isOn) {
    //       const tracksMap = hmsStore.getState(selectTracksMap);
    //       PictureInPicture.updatePeersAndTracks(this.hmsPeers, tracksMap).catch(
    //         (err) => {
    //           console.error('error in updating pip', err);
    //         },
    //       );
    //     } else {
    //       this.$router.push(this.$route.fullPath);
    //     }
    //   }).catch((err) => console.error('error in starting pip', err));
    //   MediaSession.setup(hmsActions, hmsStore);
    // },
    // stopPIP() {
    //   PictureInPicture.stop()
    //     .then(() => {
    //       this.isPIP = false;
    //     })
    //     .catch((err) => console.error('error in stopping pip', err));
    // },
    onVisual() {
      const trackId = hmsStore.getState(selectLocalVideoTrackID);
      if (!trackId) {
        this.$toast.error('Local video track not found');
        return;
      }
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'visual' ? '' : 'visual';
    },
  },
};
</script>

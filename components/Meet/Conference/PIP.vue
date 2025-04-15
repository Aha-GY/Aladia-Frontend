<template>
  <div :class="showPIP && !pdfConfig ? 'h-full w-full' : ''">
    <div
      id="video-container"
      class="pointer-events-none absolute h-0 opacity-0"
    >
      <div
        id="video-pip"
        ref="pip"
        class="relative flex h-full w-full flex-col p-2"
      >
        <div
          class="transtions-all flex h-0 w-full flex-1 items-center justify-center gap-1"
          :class="isRight ? '' : 'flex-col'"
        >
          <MeetConferenceWhiteboard
            v-if="hmsWhiteboard?.open"
            class="relative shrink-0"
            :style="shareStyle"
          />
          <div
            v-for="peer in hmsPeersScreenSharing"
            :key="peer.id"
            class="relative shrink-0"
            :style="shareStyle"
          >
            <MeetPeer
              :is-share="true"
              :peer="peer"
              :pin-id="pinId"
              :share-ids="shareIds"
              :spotlight-id="spotlightId"
            />
          </div>
          <div
            class="flex max-h-full max-w-full flex-wrap items-center justify-center gap-1"
            :class="allPeers.length > 1 ? '' : 'h-full w-full'"
          >
            <template v-for="peer in showFilterPeers" :key="peer.id">
              <div
                v-if="sharingIds.includes(peer.id)"
                class="relative max-h-full max-w-full"
                :style="peerStyle"
              >
                <MeetPeer
                  :is-share="true"
                  :peer="peer"
                  :pin-id="pinId"
                  :share-ids="shareIds"
                  :spotlight-id="spotlightId"
                />
              </div>
              <div
                class="relative max-h-full max-w-full rounded-5 border-2 transition-[border] duration-300"
                :class="
                  hmsSpeakerIds.includes(peer.id)
                    ? 'border-[#FFD700]'
                    : 'border-transparent'
                "
                :style="peerStyle"
              >
                <MeetPeer
                  :peer="peer"
                  :pin-id="pinId"
                  :share-ids="shareIds"
                  :spotlight-id="spotlightId"
                />
              </div>
            </template>
            <MeetPeerBox
              v-if="hideFilterPeers.length && !hideVideoPeer"
              class="relative max-h-full max-w-full gap-1"
              :style="peerStyle"
              :peers="hideFilterPeers"
            />
            <div
              v-else-if="hideVideoPeer"
              :style="peerStyle"
              class="relative max-h-full max-w-full rounded-5 border-2 transition-[border] duration-300"
              :class="
                hmsSpeakerIds.includes(hideVideoPeer.id)
                  ? 'border-[#FFD700]'
                  : 'border-transparent'
              "
            >
              <MeetPeer
                :peer="hideVideoPeer"
                :pin-id="pinId"
                :share-ids="shareIds"
                :spotlight-id="spotlightId"
              />
            </div>
          </div>
        </div>
        <div class="z-30 flex shrink-0 items-center justify-center gap-2 py-2">
          <el-tooltip
            effect="light"
            :content="
              hmsStore.hmsIsLocalAudioEnabled
                ? $t('meet.microphone.off')
                : $t('meet.microphone.on')
            "
            popper-class="text-[#FAFAFA]"
            :hide-after="0"
            placement="top"
            :teleported="false"
          >
            <div
              ref="audio"
              class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-[#FAFAFA] hover:bg-white/5"
              @click="toggleAudio"
            >
              <i
                class="fa-regular text-xl"
                :class="
                  !hmsStore.hmsIsLocalAudioEnabled
                    ? 'fa-microphone-slash'
                    : 'fa-microphone'
                "
              />
            </div>
          </el-tooltip>
          <el-tooltip
            effect="light"
            :content="
              hmsStore.hmsIsLocalVideoEnabled
                ? $t('meet.camera.off')
                : $t('meet.camera.on')
            "
            popper-class="text-[#FAFAFA]"
            :hide-after="0"
            placement="top"
            :teleported="false"
          >
            <div
              class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-[#FAFAFA] hover:bg-white/5"
              @click="toggleVideo"
            >
              <i
                class="fa-regular text-xl"
                :class="
                  !hmsStore.hmsIsLocalVideoEnabled
                    ? 'fa-video-slash'
                    : 'fa-video'
                "
              />
            </div>
          </el-tooltip>
          <MeetFooterShare v-if="!$device.isMobile" :is-pip="true" />

          <MeetFooterEmoji v-if="pipWidth >= 296" />
          <MeetFooterHand />
          <MeetFooterLeave />
        </div>
        <MeetFlyingEmoji />
      </div>
    </div>

    <div
      v-if="showPIP && !pdfConfig"
      class="hide-scrollbar flex h-full w-full flex-col items-center justify-center overflow-y-auto"
    >
      <img src="~/assets/meet/pip.svg" alt="" />
      <div class="mt-5 text-xl text-[#FAFAFA]">
        {{ $t('meet.pip.title') }}
      </div>
      <div class="mb-6 text-sm text-[#FAFAFA]">
        {{ $t('meet.pip.description') }}
      </div>
      <BaseButton label="$t:meet.pip.button" @click="stopPIP" />
    </div>
  </div>
</template>
<script>
import {
  selectIsPeerVideoEnabled,
  selectIsPeerAudioEnabled,
} from '@100mslive/hms-video-store';

import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  props: {
    shareIds: {
      type: Array,
      default: () => [],
    },
    pinId: [String, null],
    spotlightId: {
      type: [String, null],
      default: null,
    },
  },
  setup() {
    const hmsStore = useHmsStore();
    const visibility = useDocumentVisibility();
    return { hmsStore, visibility };
  },
  data() {
    return {
      pipWindow: null,
      pipWidth: 296,
      shareStyle: {
        width: '100%',
        height: '100%',
      },
      peerStyle: {
        width: '100%',
        height: '100%',
      },
      isRight: false,
      timer: null,
      showFilterPeers: [],
      hideFilterPeers: [],
      hideVideoPeer: null,
    };
  },
  computed: {
    meet() {
      return this.hmsStore.meet;
    },
    isSupported() {
      return 'documentPictureInPicture' in window;
    },
    layout() {
      return this.hmsStore.layout;
    },
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    hmsIsSomeoneScreenSharing() {
      return this.hmsStore.hmsIsSomeoneScreenSharing;
    },
    pdfConfig() {
      return this.hmsStore.pdfConfig;
    },
    hmsWhiteboard() {
      return this.hmsStore.hmsWhiteboard;
    },
    sharingId() {
      const ids = this.hmsStore.hmsPeers.map((r) => r.id);
      const shareIds = this.shareIds.filter((r) => ids.includes(r));
      let id = shareIds[shareIds.length - 1];
      if (ids.includes(this.pinId || this.hmsStore.pinId)) {
        id = this.pinId || this.hmsStore.pinId;
      }

      if (this.hmsWhiteboard?.open) {
        id = null;
      }
      // 如果本人有分享PDF，那么分享者一定是本人
      if (this.pdfConfig) {
        id = this.hmsLocalPeer.id;
      }

      return id;
    },
    sharingIds() {
      const ids = this.hmsStore.hmsPeersScreenSharing.map((r) => r.id);
      const isMore = ids.length > 1 || this.hmsWhiteboard?.open;
      return isMore ? ids.filter((r) => r !== this.sharingId) : [];
    },
    hmsPeersScreenSharing() {
      return this.hmsStore.hmsPeersScreenSharing.filter(
        (peer) => peer.id === this.sharingId,
      );
    },
    hmsSpeakers() {
      return this.hmsStore.hmsSpeakers;
    },
    hmsSpeakerIds() {
      const speakIds = [];
      for (const key in this.hmsSpeakers) {
        if (!speakIds.includes(this.hmsSpeakers[key]?.peerID)) {
          speakIds.unshift(this.hmsSpeakers[key]?.peerID);
        }
      }
      return speakIds;
    },
    hmsPeers() {
      const hmsPeers = [];
      const pinPeers = [];
      const pinLocalPeers = [];
      const sharePeers = [];
      // const speakPeers = [];
      const hostPeers = [];
      const coHostPeers = [];
      const uniqPeers = this.hmsStore.hmsPeers;
      for (let i = 0; i < uniqPeers.length; i++) {
        if (uniqPeers[i].id === this.pinId) {
          pinPeers.push(uniqPeers[i]);
        } else if (uniqPeers[i].id === this.hmsStore.pinId) {
          pinLocalPeers.push(uniqPeers[i]);
        } else if (this.shareIds.includes(uniqPeers[i].id)) {
          sharePeers.push(uniqPeers[i]);
        } else if (uniqPeers[i].roleName === 'host') {
          hostPeers.push(uniqPeers[i]);
        } else if (uniqPeers[i].roleName === 'co-host') {
          coHostPeers.push(uniqPeers[i]);
        } else {
          hmsPeers.push(uniqPeers[i]);
        }
      }
      const reversedShareIds = [...this.shareIds].reverse();
      // 根据 shareIds倒序 对 sharePeers 进行排序
      sharePeers.sort(
        (a, b) =>
          reversedShareIds.indexOf(a.id) - reversedShareIds.indexOf(b.id),
      );

      const allPeers = [
        ...pinPeers,
        ...pinLocalPeers,
        ...sharePeers,
        // ...speakPeers,
        ...hostPeers,
        ...coHostPeers,
        ...hmsPeers,
      ];

      if (this.layout.hideLocalVideo) {
        return allPeers.filter((peer) => !peer.isLocal);
      }
      // if (this.layout.hideWithoutVideo) {
      //   return allPeers.filter((peer) =>
      //     hmsStore.getState(selectIsPeerVideoEnabled(peer.id)),
      //   );
      // }
      return allPeers;
    },
    allPeers() {
      const list = [
        ...this.hmsStore.hmsPeersScreenSharing,
        ...this.showFilterPeers,
      ];
      if (this.layout.hideWithoutVideo && this.hideFilterPeers.length) {
        list.push(this.hideFilterPeers[0]);
      }
      return list;
      // return [...this.hmsStore.hmsPeersScreenSharing, ...this.hmsPeers];
    },
    showPIP() {
      return this.hmsStore.showPIP;
    },
  },
  watch: {
    showPIP(val) {
      if (val) {
        this.togglePictureInPicture();
      } else {
        this.stopPIP();
      }
    },
    hmsPeers() {
      this.getFilterPeers();
    },
    allPeers() {
      this.handleResize();
    },
    'layout.hideWithoutVideo'() {
      this.hideVideoPeer = null;
      if (this.layout.hideWithoutVideo) {
        this.onInterval();
      } else {
        this.timer && clearInterval(this.timer);
      }
      this.getFilterPeers();
    },
    'showFilterPeers.length'() {
      this.handleResize();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.getFilterPeers();
      // const constraints = { video: true, audio: true };
      // await navigator.mediaDevices.getUserMedia(constraints);

      try {
        navigator.mediaSession.setActionHandler(
          'enterpictureinpicture',
          this.togglePictureInPicture,
        );
      } catch (error) {
        console.log(error);
      }
    },
    onInterval() {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.getFilterPeers();
      }, 100);
    },
    getFilterPeers() {
      if (this.layout.hideWithoutVideo) {
        this.showFilterPeers = this.hmsPeers.filter(
          (peer) =>
            peer.isLocal ||
            hmsStore.getState(selectIsPeerVideoEnabled(peer.id)),
        );
        this.hideFilterPeers = this.hmsPeers
          .filter(
            (peer) =>
              !peer.isLocal &&
              !hmsStore.getState(selectIsPeerVideoEnabled(peer.id)),
          )
          .map((peer) => ({
            ...peer,
            isAudioEnabled: hmsStore.getState(
              selectIsPeerAudioEnabled(peer.id),
            ),
          }));
        this.hideVideoPeer = this.hideFilterPeers.find(
          (peer) => peer.isAudioEnabled,
        );
      } else {
        this.hideVideoPeer = null;
        this.showFilterPeers = this.hmsPeers;
        this.hideFilterPeers = [];
      }
    },
    async stopPIP() {
      if (this.pipWindow) {
        this.pipWindow.removeEventListener('resize', this.handleResize);
        this.pipWindow.close();
        this.pipWindow = null;
      }
    },
    async togglePictureInPicture() {
      if (!this.isSupported) {
        return;
      }
      if (this.pipWindow || !this.hmsStore.hmsIsConnectedToRoom) {
        return;
      }
      const videoContainer = document.querySelector('#video-container');
      const videoPip = document.querySelector('#video-pip');
      // Close Picture-in-Picture window if any.
      // if (documentPictureInPicture.window) {
      //   this.hmsStore.showPIP = false;
      //   documentPictureInPicture.window.close();
      //   return;
      // }

      // Open a Picture-in-Picture window.
      this.pipWindow = await documentPictureInPicture.requestWindow({
        width: 296,
        height: 484,
      });

      this.copyStyle(this.pipWindow);
      this.pipWindow.document.body.append(videoPip);
      this.handleResize();
      this.pipWindow.addEventListener('resize', this.handleResize);
      // the Picture-in-Picture window closes.
      this.pipWindow.addEventListener('pagehide', () => {
        videoContainer.append(videoPip);
        this.hmsStore.showPIP = false;
        this.pipWindow = null;
      });
      this.pipWindow.addEventListener('visibilitychange', () => {
        this.$router.replace(this.meet.link);
      });
    },
    copyStyle(pipWindow) {
      // Copy all style sheets.
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules]
            .map((rule) => rule.cssText)
            .join('');
          const style = document.createElement('style');

          style.textContent = cssRules;
          pipWindow.document.head.appendChild(style);
        } catch (e) {
          const link = document.createElement('link');

          link.rel = 'stylesheet';
          link.type = styleSheet.type;
          link.media = styleSheet.media;
          link.href = styleSheet.href;
          pipWindow.document.head.appendChild(link);
        }
      });
    },
    handleResize() {
      if (!this.pipWindow) {
        return;
      }
      this.pipWidth = this.pipWindow.innerWidth;
      const _height = this.pipWindow.innerHeight - 16 - 56 - 4;
      const _width = this.pipWindow.innerWidth - 16 - 4;
      if (this.allPeers.length > 1 || this.hmsWhiteboard?.open) {
        const size = this.otherSpace(_width, _height);

        // const shareW = _height * (16 / 9);
        if (this.hmsPeersScreenSharing.length || this.hmsWhiteboard?.open) {
          const shareH = _width * (9 / 16);
          if (shareH + size.bottom.height + 4 > _height) {
            this.isRight = true;
            // const minShareW = _width - size.right.width - 4;
            const minShareW = _width - _width * 0.25 - 4;
            const maxShareW = _height * (16 / 9);

            this.shareStyle = {
              width: `${minShareW}px`,
              height: `${minShareW * (9 / 16)}px`,
              maxWidth: `${maxShareW}px`,
              maxHeight: `${_height}px`,
            };
            if (minShareW > maxShareW) {
              this.onPeerStyle(_width - maxShareW - 4, _height);
            } else {
              this.onPeerStyle(_width - minShareW - 4, _height);
            }
          } else {
            this.isRight = false;
            // const minShareH = _height - size.bottom.height - 4;
            const minShareH = _height - _height * 0.25 - 4;
            const maxShareH = _width * (9 / 16);
            this.shareStyle = {
              width: `${minShareH * (16 / 9)}px`,
              height: `${minShareH}px`,
              maxWidth: `${_width}px`,
              maxHeight: `${maxShareH}px`,
            };
            if (minShareH > maxShareH) {
              this.onPeerStyle(_width, _height - maxShareH - 4);
            } else {
              this.onPeerStyle(_width, _height - minShareH - 4);
            }
          }
        } else {
          this.onPeerStyle(_width, _height);
        }
      } else {
        this.onPeerStyle(_width, _height);
        // this.peerStyle = {
        //   width: `100%`,
        //   height: `100%`,
        // };
      }
    },
    otherSpace(_width, _height) {
      const Len = this.allPeers.length - 1;
      const rightH = (_height - (Len - 1) * 4) / Len;
      const bottomW = (_width - (Len - 1) * 4) / Len;
      return {
        right: {
          height: rightH,
          width: rightH * (16 / 9),
        },
        bottom: {
          height: bottomW * (9 / 16),
          width: bottomW,
        },
      };
    },
    onPeerStyle(containerWidth, containerHeight) {
      const Len = this.allPeers.length - this.hmsPeersScreenSharing.length;
      const { width, height } = this.calculateBlockSize(
        containerWidth - 2,
        containerHeight - 2,
        Len,
        16,
        9,
        4,
      );
      this.peerStyle = {
        width: `${width}px`,
        height: `${height}px`,
      };
    },
    calculateBlockSize(
      containerWidth,
      containerHeight,
      blockCount,
      aspectRatioWidth,
      aspectRatioHeight,
      spacing,
    ) {
      let bestWidth = 0;
      let bestHeight = 0;
      let minUnusedArea = Infinity;

      for (let rows = 1; rows <= blockCount; rows++) {
        const cols = Math.ceil(blockCount / rows);
        const totalSpacingWidth = (cols - 1) * spacing;
        const totalSpacingHeight = (rows - 1) * spacing;
        let blockWidth = (containerWidth - totalSpacingWidth) / cols;
        let blockHeight = blockWidth * (aspectRatioHeight / aspectRatioWidth);

        if (blockHeight > containerHeight) {
          blockHeight = containerHeight;
          blockWidth = blockHeight * (aspectRatioWidth / aspectRatioHeight);
        }

        if (blockHeight * rows + totalSpacingHeight <= containerHeight) {
          const unusedArea =
            containerWidth * containerHeight -
            (blockWidth * blockHeight * blockCount +
              totalSpacingWidth * totalSpacingHeight);
          if (unusedArea < minUnusedArea) {
            minUnusedArea = unusedArea;
            bestWidth = blockWidth;
            bestHeight = blockHeight;
          }
        }
      }
      return {
        width: bestWidth,
        height: bestHeight,
      };
    },
    async toggleAudio() {
      await hmsActions.setLocalAudioEnabled(
        !this.hmsStore.hmsIsLocalAudioEnabled,
      );
    },
    async toggleVideo() {
      await hmsActions.setLocalVideoEnabled(
        !this.hmsStore.hmsIsLocalVideoEnabled,
      );
    },
  },
};
</script>

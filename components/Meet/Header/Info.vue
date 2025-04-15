<template>
  <div
    v-if="hmsIsSomeoneScreenSharing || hmsWhiteboard?.open"
    class="mb-2 flex items-center gap-2"
  >
    <div class="text-sm text-[#FAFAFA]">
      {{
        isLocal
          ? $t('meet.presenter.you')
          : $t('meet.presenter.others', { name: name })
      }}
    </div>

    <div
      v-if="isLocal"
      class="flex cursor-pointer items-center justify-center gap-2 rounded-5 p-1 hover:bg-white/5"
      data-cy="236960f78e9d59a6"
      @click="onStop"
    >
      <div class="flex h-5 w-5 items-center justify-center">
        <i class="fa-solid fa-square-xmark" />
      </div>

      {{ $t('meet.screen.stop.present') }}
    </div>
  </div>
</template>
<script>
import { selectSessionStore } from '@100mslive/hms-video-store';

import { hmsStore, hmsActions } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      shareIds: [],
      unsub: null,
      unsub1: null,
      pinId: null,
    };
  },
  computed: {
    hmsPeers() {
      return this.hmsStore.hmsPeers;
    },
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    pdfConfig() {
      return this.hmsStore.pdfConfig;
    },
    peer() {
      const ids = this.hmsStore.hmsPeers.map((r) => r.id);
      const shareIds = this.shareIds.filter((r) => ids.includes(r));
      let id = shareIds[shareIds.length - 1];
      if (ids.includes(this.pinId || this.hmsStore.pinId)) {
        id = this.pinId || this.hmsStore.pinId;
      }
      // 如果本人有分享PDF，那么分享者一定是本人
      if (this.pdfConfig) {
        id = this.hmsLocalPeer.id;
      }
      return (
        this.hmsStore.hmsPeersScreenSharing.find((peer) => peer.id === id) || {}
      );
    },
    isLocal() {
      return (
        this.hmsLocalPeer.id === this.peer?.id ||
        this.hmsLocalPeer.customerUserId === this.hmsWhiteboard?.owner
      );
    },
    hmsWhiteboard() {
      return this.hmsStore.hmsWhiteboard;
    },
    isOwner() {
      return this.hmsLocalPeer.customerUserId === this.hmsWhiteboard?.owner;
    },
    hmsIsSomeoneScreenSharing() {
      return this.hmsStore.hmsIsSomeoneScreenSharing;
    },
    name() {
      let name = '';
      if (this.hmsWhiteboard?.open) {
        this.hmsPeers.forEach((peer) => {
          if (peer.customerUserId === this.hmsWhiteboard?.owner) {
            name = peer.name;
          }
        });
      }
      if (this.hmsIsSomeoneScreenSharing) {
        name = this.peer.name;
      }
      return name;
    },
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    if (this.unsub) {
      this.unsub();
    }
    if (this.unsub1) {
      this.unsub1();
    }
  },
  methods: {
    init() {
      this.unsub = hmsStore.subscribe((ids) => {
        this.shareIds = ids || [];
      }, selectSessionStore('shareIds'));
      this.unsub1 = hmsStore.subscribe((id) => {
        this.pinId = id;
      }, selectSessionStore('pinId'));
    },
    async onStop() {
      if (this.hmsWhiteboard?.open && this.isOwner) {
        await hmsActions.interactivityCenter.whiteboard.close(
          this.hmsWhiteboard?.id,
        );
      }
      if (this.hmsStore.hmsIsLocalScreenShared) {
        await hmsActions.setScreenShareEnabled(false);
      }
      hmsActions.sessionStore.set(
        'shareIds',
        this.shareIds.filter((id) => id !== this.hmsLocalPeer.id),
      );
    },
  },
};
</script>

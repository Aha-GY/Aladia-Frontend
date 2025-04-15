<template>
  <client-only>
    <el-dialog
      v-model="hmsStore.dialog.share"
      :show-close="false"
      align-center
      destroy-on-close
      width="338px"
      class="!rounded-5"
    >
      <div
        class="flex items-center justify-between rounded-t-5 bg-[#0C0C0C] px-4 py-3"
      >
        <div class="text-base text-[#B0B0B0]">
          {{ $t('meet.present.now') }}
        </div>
        <BaseIconClose @click.stop="hmsStore.dialog.share = false" />
      </div>
      <div class="p-6 px-4">
        <div class="my-0.5 text-xs text-[#B0B0B0]">
          {{
            $t('meet.present.takeOver', {
              name: nowPeer?.name,
            })
          }}
        </div>
      </div>
      <div class="flex items-center justify-end gap-5 rounded-b-5 p-4">
        <BaseButton
          label="$t:base.upload.cancel"
          type="secondary"
          @click="hmsStore.dialog.share = false"
        />
        <BaseButton label="$t:flux.meet.shareNow" @click="onShare" />
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
import { selectSessionStore } from '@100mslive/hms-video-store';

import { hmsStore } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      unsub: null,
      unsub1: null,
      shareIds: [],
      pinId: null,
    };
  },
  computed: {
    open() {
      return this.hmsStore.dialog.share;
    },
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    nowPeer() {
      const ids = this.hmsStore.hmsPeers.map((r) => r.id);
      const shareIds = this.shareIds.filter((r) => ids.includes(r));
      let id = shareIds[shareIds.length - 1];
      if (ids.includes(this.pinId || this.hmsStore.pinId)) {
        id = this.pinId || this.hmsStore.pinId;
      }
      return (
        this.hmsStore.hmsPeersScreenSharing.find((peer) => peer.id === id) || {}
      );
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
    async onShare() {
      await hmsActions.setScreenShareEnabled(true);
      this.hmsStore.dialog.share = false;
      if (!this.shareIds.includes(this.hmsLocalPeer.id)) {
        hmsActions.sessionStore.set('shareIds', [
          ...this.shareIds,
          this.hmsLocalPeer.id,
        ]);
      }
    },
  },
};
</script>

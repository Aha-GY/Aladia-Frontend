<template>
  <el-tooltip
    :disabled="$device.isMobile"
    effect="light"
    :content="
      hmsLocalPeer?.isHandRaised
        ? $t('meet.footer.emoji.hand.lower')
        : $t('meet.footer.emoji.hand.raise')
    "
    placement="top"
    :hide-after="0"
    popper-class="text-[#FAFAFA]"
    :teleported="false"
  >
    <div
      class="flex cursor-pointer items-center justify-center rounded-5 text-[#FAFAFA]"
      :class="[
        sizeClass,
        hmsLocalPeer?.isHandRaised ? 'bg-white/5' : 'hover:bg-white/5',
      ]"
      @click="toggleRaiseHand"
    >
      <i class="fa-regular fa-hand" />
    </div>
  </el-tooltip>
</template>
<script>
import { selectSessionStore } from '@100mslive/hms-video-store';

import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  props: {
    size: {
      type: String,
      default: 'md',
    },
  },
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    sizeClass() {
      return this.size === 'md' ? 'h-10 w-10 text-xl' : 'h-6 w-6 text-sm';
    },
  },
  methods: {
    async toggleRaiseHand() {
      const handIds = hmsStore.getState(selectSessionStore('handIds')) || [];
      if (this.hmsLocalPeer?.isHandRaised) {
        await hmsActions.lowerLocalPeerHand();
        hmsActions.sessionStore.set(
          'handIds',
          handIds.filter((id) => id !== this.hmsLocalPeer.id),
        );
      } else {
        await hmsActions.raiseLocalPeerHand();
        hmsActions.sessionStore.set('handIds', [
          ...handIds,
          this.hmsLocalPeer.id,
        ]);
      }
    },
  },
};
</script>

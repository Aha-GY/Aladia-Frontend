<template>
  <div
    ref="box"
    class="relative flex shrink-0 flex-col items-center justify-center overflow-hidden rounded-5 bg-[#202020]"
  >
    <div class="flex items-center justify-center">
      <div
        v-for="(peer, index) in peers.slice(0, 2)"
        :key="peer.id"
        class="rounded-full border border-[#202020]"
        :style="{
          width: `${Width}px`,
          height: `${Height}px`,
          marginLeft: `-${index === 0 ? 0 : Width / 10}px`,
        }"
      >
        <BaseAvatar
          v-if="getPicture(peer.id)"
          :picture="getPicture(peer.id)"
          class="!p-0"
          :style="{ width: `${Width}px`, height: `${Height}px` }"
        />
        <MeetPeerUserAvartar
          v-else
          :name="peer.name"
          class="text-sm"
          :style="{
            width: `${Width}px`,
            height: `${Height}px`,
            fontSize: `${Width / 3}px`,
          }"
        />
      </div>
    </div>
    <div class="text-sm text-[#FAFAFA]">
      {{ peers.length }} {{ $t('meet.others') }}
    </div>
  </div>
</template>
<script>
import { selectPeerMetadata } from '@100mslive/hms-video-store';

import { hmsStore } from '~/utils/hms';

export default {
  props: {
    peers: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const box = ref(null);
    const Height = ref(40);
    const Width = ref(40);
    useResizeObserver(box, (entries) => {
      for (const entry of entries) {
        const { height } = entry.contentRect;
        Height.value = height / 3;
        Width.value = height / 3;
      }
    });
    return { box, Width, Height };
  },
  methods: {
    getPicture(id) {
      return hmsStore.getState(selectPeerMetadata(id))?.picture;
    },
  },
};
</script>

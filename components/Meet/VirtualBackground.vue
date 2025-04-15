<template>
  <div ref="box" class="flex items-center">
    <el-tooltip
      :disabled="$device.isMobile"
      effect="light"
      :content="$t('meet.layout.apply.visual')"
      placement="top"
      :hide-after="0"
    >
      <div
        class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl"
        :class="
          hmsStore.openPopup === 'visual'
            ? 'bg-white/5'
            : 'text-[#FAFAFA] hover:bg-white/5'
        "
        data-cy="155fe85c24f3d76c"
        @click="onOpen"
      >
        <i class="fa-light fa-wand-magic-sparkles" />
      </div>
    </el-tooltip>
  </div>
</template>
<script>
import { selectLocalVideoTrackID } from '@100mslive/hms-video-store';

import { hmsStore } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  methods: {
    onOpen() {
      const trackId = hmsStore.getState(selectLocalVideoTrackID);
      if (!trackId) {
        this.$toast.error(this.$t('meet.error.notFound.track'));
        return;
      }
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'visual' ? '' : 'visual';
    },
  },
};
</script>

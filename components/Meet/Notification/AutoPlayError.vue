<template>
  <div class="autoplay-modal">
    <h2 class="mb-2">
      {{ $t('meet.play.audio.error.title') }}
    </h2>
    <p>
      {{ $t('meet.play.audio.error.description') }}
    </p>
    <div class="mt-2 flex items-center justify-center">
      <el-button
        type="primary"
        data-cy="e7b2595eab1b347c"
        @click="unblockAudio"
      >
        {{ $t('meet.play.audio.error.label') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { hmsActions } from '~/utils/hms';

export default {
  props: {
    onClose: {
      type: Function,
      default: () => null,
    },
  },
  methods: {
    async unblockAudio() {
      await hmsActions.unblockAudio();
      this.onClose();
    },
  },
};
</script>

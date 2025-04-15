<template>
  <client-only>
    <el-dialog
      v-model="mute.open"
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
          {{ $t('meet.unmute.title') }}
        </div>
        <BaseIconClose @click.stop="mute.open = false" />
      </div>
      <div class="p-6 px-4">
        <div class="my-0.5 text-xs text-[#B0B0B0]">
          {{ mute?.data?.name }}
          {{ $t('meet.unmute.content', { type: mute?.data?.type }) }}
        </div>
      </div>
      <div class="flex items-center justify-end gap-5 rounded-b-5 p-4">
        <BaseButton
          label="$t:base.upload.cancel"
          type="secondary"
          @click="mute.open = false"
        />
        <BaseButton label="$t:meet.accept" @click="onSubmit" />
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
import { hmsActions } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  computed: {
    mute() {
      return this.hmsStore.dialog.mute;
    },
  },
  methods: {
    async onSubmit() {
      if (this.mute?.data?.type === 'audio') {
        hmsActions.setLocalAudioEnabled(true);
      } else {
        hmsActions.setLocalVideoEnabled(true);
      }
      this.mute.open = false;
    },
  },
};
</script>

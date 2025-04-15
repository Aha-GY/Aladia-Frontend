<template>
  <client-only>
    <el-dialog
      v-model="hmsStore.dialog.pdf"
      :show-close="false"
      align-center
      destroy-on-close
      :width="$device.isMobile ? '324px' : '558px'"
      class="!rounded-5"
    >
      <div
        class="flex items-center justify-between rounded-t-5 bg-[#0C0C0C] px-4 py-3"
      >
        <div class="text-base text-[#B0B0B0]">
          {{ $t('meet.screen.share.pdf') }}
        </div>
        <BaseIconClose
          data-cy="80966ddb45ba8c24"
          @click.stop="hmsStore.dialog.pdf = false"
        />
      </div>
      <div class="p-7">
        <div class="text-base text-[#B0B0B0]">
          {{ $t('meet.screen.share.content') }}
        </div>
        <div class="mt-3 h-[8.375rem] p-6 md:h-[15.625rem]">
          <div
            v-if="!file"
            class="h-full w-full rounded-5 border border-dashed border-[#D9D9D9] hover:bg-white/5"
          >
            <div
              class="relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2"
            >
              <input
                type="file"
                accept="application/pdf"
                class="absolute inset-0 z-10 opacity-0"
                data-cy="843e0dac78f74cf1"
                @change="upload"
              />
              <i class="fa-light fa-upload text-4xl text-[#707070]" />
              <div class="text-center text-sm font-medium text-[#707070]">
                {{ $t('meet.screen.share.file.drag') }}
                <br />
                {{ $t('meet.screen.share.file.or') }}
                <span class="text-[#FED54A]">
                  {{ $t('meet.screen.share.file.browse') }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="flex gap-1.5 p-1.5">
            <div
              class="flex h-9 w-9 items-center justify-center rounded bg-[#202020]"
            >
              <i class="fa-solid fa-file-pdf text-[#EB4937]" />
            </div>
            <div class="flex w-0 flex-1 flex-col gap-1">
              <div class="truncate text-xs font-medium text-[#D9D9D9]">
                {{ file.name }}
              </div>
              <div class="text-xs font-medium text-[#707070]">
                {{ (file.size / 1024).toFixed(2) }}kb/{{
                  (file.size / 1024).toFixed(2)
                }}kb
              </div>
            </div>
            <i
              class="fa-light fa-close cursor-pointer text-[#707070]"
              data-cy="1af26133589c422f"
              @click="file = null"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-5 rounded-b-5 p-4">
        <BaseButton
          label="$t:base.upload.cancel"
          type="secondary"
          data-cy="913be50269fb63ec"
          @click="hmsStore.dialog.pdf = false"
        />
        <BaseButton
          label="$t:flux.meet.share"
          data-cy="d9f6936e4b672302"
          @click="onSharePDF"
        />
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
      file: null,
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
  },
  methods: {
    async upload(event) {
      const file = event.target.files[0];
      event.target.value = null;
      if (file.type !== 'application/pdf') {
        return this.$toast.error(this.$t('meet.screen.share.file.browse'));
      }
      this.file = file;
    },
    async onSharePDF() {
      // await hmsActions.setScreenShareEnabled(false);
      this.hmsStore.pdfConfig = this.file;
      this.hmsStore.dialog.pdf = false;
      const shareIds = hmsStore.getState(selectSessionStore('shareIds')) || [];
      if (!shareIds.includes(this.hmsLocalPeer.id)) {
        hmsActions.sessionStore.set('shareIds', [
          ...shareIds,
          this.hmsLocalPeer.id,
        ]);
      }
    },
  },
};
</script>

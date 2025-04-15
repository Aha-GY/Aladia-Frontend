<template>
  <client-only>
    <el-dialog
      v-model="hmsStore.dialog.hls"
      :show-close="false"
      align-center
      destroy-on-close
      width="408px"
      class="!rounded-5"
    >
      <div
        class="flex items-center justify-between rounded-t-5 bg-[#0C0C0C] px-4 py-3"
      >
        <div class="text-base text-[#B0B0B0]">
          {{ $t('meet.hls.title') }}
        </div>
        <BaseIconClose
          data-cy="6342f493a8a06c1d"
          @click.stop="hmsStore.dialog.hls = false"
        />
      </div>
      <div class="p-6 px-4">
        <div class="my-0.5 text-xs text-[#B0B0B0]">
          {{ $t('meet.hls.description') }}
        </div>
      </div>
      <div class="flex items-center justify-end gap-5 rounded-b-5 p-4">
        <BaseButton
          label="$t:base.upload.cancel"
          type="secondary"
          data-cy="4ebcf547ead0acd6"
          @click="hmsStore.dialog.hls = false"
        />
        <BaseButton
          label="$t:flux.meet.recording.start"
          :loading="loading"
          data-cy="265add3b846787ba"
          @click="startHLS"
        />
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
import { selectRoomID } from '@100mslive/hms-video-store';

import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      loading: false,
      isSuccess: false,
    };
  },
  computed: {
    hmsHLSState() {
      return this.hmsStore.hmsHLSState;
    },
    isRunning() {
      return this.hmsHLSState?.running;
    },
    startedAt() {
      return this.hmsHLSState?.variants[0]?.startedAt;
    },
  },
  watch: {
    startedAt(val) {
      if (val && this.isSuccess) {
        this.isSuccess = false;
        this.$toast.info(this.$t('meet.hls.started'), {
          icon: 'fa-solid fa-record-vinyl',
        });
        this.loading = false;
        this.hmsStore.dialog.hls = false;
      }
    },
  },
  methods: {
    async startHLS() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.isSuccess = false;
      try {
        const roomId = hmsStore.getState(selectRoomID);
        // For this to work, destinations in your template needs to be configured in dashboard
        await hmsActions.startHLSStreaming({
          variants: [
            {
              meetingURL: `https://${window.location.hostname}/100ms-preview?roomId=${roomId}`,
              // meetingURL: `https://develop.aladia.io/100ms-preview?roomId=${roomId}`,
              // meetingURL: `https://aladia-io.app.100ms.live/preview/${roomId}/__internal_recorder?skip_preview=true`,
              metadata: 'landscape',
            },
          ],
          recording: { hlsVod: true, singleFilePerLayer: true },
        });
        this.isSuccess = true;
        // this.$toast.info(this.$t('meet.hls.started'), {
        //   icon: 'fa-solid fa-record-vinyl',
        // });
      } catch (err) {
        console.error(this.$t('meet.hls.failed'), err);
      }
    },
  },
};
</script>

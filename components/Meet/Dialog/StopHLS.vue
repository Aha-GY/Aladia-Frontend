<template>
  <client-only>
    <el-dialog
      v-model="hmsStore.dialog.stophls"
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
          {{ $t('meet.banner.record.stop.title') }}
        </div>
        <BaseIconClose @click.stop="hmsStore.dialog.stophls = false" />
      </div>
      <div class="p-6 px-4">
        <div class="my-0.5 text-xs text-[#B0B0B0]">
          {{ $t('meet.banner.record.save') }}
        </div>
      </div>
      <div class="flex items-center justify-end gap-5 rounded-b-5 p-4">
        <BaseButton
          label="$t:base.upload.cancel"
          type="secondary"
          @click="hmsStore.dialog.stophls = false"
        />
        <BaseButton
          :loading="loading"
          label="$t:meet.banner.record.stop.label"
          @click="onSubmit"
        />
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
  },
  watch: {
    isRunning(val) {
      if (!val && this.isSuccess) {
        this.isSuccess = false;
        this.$toast.info(this.$t('meet.banner.record.stop.done'), {
          icon: 'fa-solid fa-record-vinyl',
        });
        this.loading = false;
        this.hmsStore.dialog.stophls = false;
      }
    },
  },
  methods: {
    async onSubmit() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.isSuccess = false;
      try {
        await hmsActions.stopHLSStreaming();
        this.isSuccess = true;
        // this.$toast.info(this.$t('meet.banner.record.stop.done'), {
        //   icon: 'fa-solid fa-record-vinyl',
        // });
      } catch (err) {
        console.error(this.$t('meet.banner.record.stop.failed'), err);
      }
      // this.loading = false;
      // this.hmsStore.dialog.stophls = false;
    },
  },
};
</script>

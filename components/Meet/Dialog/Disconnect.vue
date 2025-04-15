<template>
  <client-only>
    <el-dialog
      v-model="hmsStore.dialog.disconnect"
      :show-close="false"
      append-to-body
      destroy-on-close
      align-center
      :width="$device.isMobile ? '324px' : '408px'"
      class="!rounded-5"
    >
      <div
        class="flex items-center justify-between rounded-t-5 bg-[#0C0C0C] p-4"
      >
        <div class="text-sm font-medium text-[#B0B0B0]">
          {{ $t('meet.disconnect.title') }}
        </div>
        <BaseIconClose
          data-cy="68d73e499bf1b0f3"
          @click.stop="hmsStore.dialog.disconnect = false"
        />
      </div>
      <div class="p-7">
        <div class="relative m-auto h-[4.25rem] w-[4.25rem]">
          <BaseClockCountdown :second="second" :total="120" />
          <div
            class="absolute left-0 top-0 flex h-full w-full items-center justify-center text-xs"
          >
            {{ secondToTime(second) }}
          </div>
        </div>
        <div
          class="m-auto mt-3 w-[19.25rem] text-center text-sm text-[#B0B0B0]"
        >
          {{ $t('meet.disconnect.description') }}
        </div>
      </div>
      <div class="flex items-center justify-end gap-5 rounded-b-5 p-4">
        <BaseButton
          label="$t:flux.meet.leave"
          type="secondary"
          data-cy="5f83591ec3f55de5"
          @click="onBack"
        />
        <BaseButton
          label="$t:flux.meet.stay"
          data-cy="c6782c22147e040b"
          @click="preview"
        />
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      second: 120,
      timer: null,
    };
  },
  computed: {
    meet() {
      return this.hmsStore.meet;
    },
    open() {
      return this.hmsStore.dialog.disconnect;
    },
  },
  watch: {
    open() {
      if (this.open) {
        this.init();
      } else {
        this.timer && clearInterval(this.timer);
      }
    },
  },
  methods: {
    init() {
      this.timer && clearInterval(this.timer);
      this.second = 120;
      this.timer = setInterval(() => {
        if (this.second > 0) {
          this.second--;
        } else {
          clearInterval(this.timer);
          this.onBack();
        }
      }, 1000);
    },
    async preview() {
      // await hmsActions.preview({
      //   userName: this.meet.fullName,
      //   authToken: this.meet.token,
      //   asRole: this.meet.role,
      //   metaData: JSON.stringify({
      //     picture: this.meet.picture,
      //     userId: this.meet.id,
      //   }),
      // });
      this.hmsStore.dialog.disconnect = false;
    },
    onBack() {
      this.hmsStore.dialog.disconnect = false;
      this.hmsStore.end.show = true;
      // this.hmsStore.end.disconnect = true;
      hmsActions.leave();
    },
  },
};
</script>

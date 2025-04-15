<template>
  <div class="mb-2 flex items-center gap-1.5 rounded-5 bg-black p-1">
    <BaseLive class="h-4 w-4 scale-50" />
    <div class="mr-1.5 text-sm text-[#ED3C28]">
      {{ $t('meet.header.rec') }}
    </div>
    <i class="fa-solid fa-clock text-xs text-[#FAFAFA]" />
    <div
      class="text-sm font-medium text-[#FAFAFA]"
      :class="startSeconds > 60 * 60 ? 'w-[3.75rem]' : 'w-10'"
    >
      {{ secondToTime(startSeconds) }}
    </div>
    <div
      v-if="isHost"
      class="flex h-6 cursor-pointer items-center gap-1.5 rounded-5 bg-[#450A0A] px-1.5 text-xs font-medium text-[#EF4444]"
      data-cy="0971999134ea1b40"
      @click="stopHLS"
    >
      <div class="h-3 w-3 rounded-sm bg-[#EF4444]" />
      {{ $t('meet.screen.stop.label') }}
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      timer: null,
      startSeconds: 0,
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    isHost() {
      const roleName = this.hmsLocalPeer.roleName;
      return roleName === 'host' || roleName === 'co-host';
    },
    hmsHLSState() {
      return this.hmsStore.hmsHLSState;
    },
    isRunning() {
      return this.hmsHLSState?.running;
    },
  },
  mounted() {
    this.init();
  },
  unmounted() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    init() {
      this.timer = setInterval(() => {
        const startedAt = this.hmsHLSState?.variants[0]?.startedAt;
        this.startSeconds = startedAt ? dayjs().diff(startedAt, 'second') : 0;
      }, 1000);
    },
    async stopHLS() {
      this.hmsStore.dialog.stophls = true;
    },
  },
};
</script>

<template>
  <div class="absolute left-0 z-10 w-full" :style="{ top: `${top}px` }">
    <div
      class="absolute left-0 top-0 -translate-x-full -translate-y-1/2 rounded-full bg-[#ea4335] px-1 text-xs"
    >
      {{ time }}
    </div>
    <div class="h-0.5 w-full bg-[#ea4335]" />
  </div>
</template>
<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;
export default {
  data() {
    return {
      top: 0,
      timer: null,
      time: '',
    };
  },
  mounted() {
    this.onInit();
    this.timer = setInterval(() => {
      this.onInit();
    }, 1000);
  },
  beforeUnmount() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    onInit() {
      const hours = dayjs().hour();
      const minute = dayjs().minute();
      this.top = hours * 50 + (minute / 60) * 50;
      this.time = dayjs().format('HH:mm');
    },
  },
};
</script>

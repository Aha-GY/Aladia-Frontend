<template>
  <svg
    width="68"
    height="68"
    viewBox="0 0 68 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="34"
      cy="34"
      r="30"
      stroke="#E0B92C"
      stroke-width="0.8"
      stroke-linecap="round"
      stroke-dasharray="3.2 3.2"
    />
    <circle
      cx="34"
      cy="34"
      r="30"
      stroke="#E0B92C"
      stroke-width="2.4"
      stroke-linecap="round"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="offset"
      class="progress-circle"
    />
    <circle :cx="dotPosition.x" :cy="dotPosition.y" r="3.2" fill="#E0B92C" />
  </svg>
</template>

<script>
export default {
  props: {
    second: Number,
    total: Number,
  },
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  computed: {
    progress() {
      return 1 - (this.total - this.second) / this.total;
    },
    circumference() {
      const radius = 30;
      return 2 * Math.PI * radius;
    },
    offset() {
      return this.circumference - this.progress * this.circumference;
    },
    dotPosition() {
      const angle = this.progress * 2 * Math.PI - Math.PI / 2;
      const radius = 30;
      const cx = 34 + radius * Math.cos(angle);
      const cy = 34 + radius * Math.sin(angle);
      return { x: cx, y: cy };
    },
  },
};
</script>
<style lang="scss" scoped>
.progress-circle {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
</style>

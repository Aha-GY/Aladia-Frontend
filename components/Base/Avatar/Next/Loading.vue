<template>
  <div
    :style="{
      width: `${height}px`,
      height: `${height}px`,
    }"
  >
    <svg
      :view-box="`0 0 ${height} ${height}`"
      :width="height"
      :height="height"
      xmlns="http://www.w3.org/2000/svg"
      :style="{
        fill: 'none',
        'stroke-dashoffset': 0,
        'stroke-linecap': 'round',
        strokeWidth: `${strokeWidth}px`,
        animation: `story-loading-${size} 2000ms ease-out infinite alternate`,
      }"
    >
      <defs>
        <linearGradient :id="id" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #906419" />
          <stop offset="8.33%" style="stop-color: #e8cc6b" />
          <stop offset="16.66%" style="stop-color: #eee3c5" />
          <stop offset="25%" style="stop-color: #ddcd65" />
          <stop offset="33.33%" style="stop-color: #e0b92c" />
          <stop offset="41.66%" style="stop-color: #edcb6d" />
          <stop offset="50%" style="stop-color: #e3bd60" />
          <stop offset="58.33%" style="stop-color: #986b1d" />
          <stop offset="66.66%" style="stop-color: #f9d571" />
          <stop offset="75%" style="stop-color: #f6e68e" />
          <stop offset="83.33%" style="stop-color: #d2ba72" />
          <stop offset="100%" style="stop-color: #a57625" />
        </linearGradient>
      </defs>
      <circle
        :cx="height / 2"
        :cy="height / 2"
        :r="radius"
        :stroke="`url(#${id})`"
      />
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'sm',
  },
});

const height = computed(
  () =>
    ({
      sm: 33,
      md: 56,
      lg: 94,
      xl: 234,
    })[props.size],
);

const radius = computed(
  () =>
    ({
      sm: 15,
      md: 26.5,
      lg: 44.5,
      xl: 112,
    })[props.size],
);

const strokeWidth = computed(
  () =>
    ({
      sm: 2,
      md: 3,
      lg: 4,
      xl: 10,
    })[props.size],
);

const id = ref(Math.random().toString(36).substring(7));
</script>

<style lang="scss">
@keyframes story-loading-sm {
  0% {
    stroke-dasharray: 0, 0;
    transform: rotate(0deg);
  }
  100% {
    stroke-dasharray: 4px, 5px;
    transform: rotate(180deg);
  }
}

@keyframes story-loading-md {
  0% {
    stroke-dasharray: 0, 0;
    transform: rotate(0deg);
  }
  100% {
    stroke-dasharray: 5px, 6px;
    transform: rotate(180deg);
  }
}

@keyframes story-loading-lg {
  0% {
    stroke-dasharray: 0, 0;
    transform: rotate(0deg);
  }
  100% {
    stroke-dasharray: 6px, 8px;
    transform: rotate(180deg);
  }
}

@keyframes story-loading-xl {
  0% {
    stroke-dasharray: 0, 0;
    transform: rotate(0deg);
  }
  100% {
    stroke-dasharray: 16px, 20px;
    transform: rotate(180deg);
  }
}
</style>

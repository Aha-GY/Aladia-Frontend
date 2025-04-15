<template>
  <div class="pointer-events-none flex-1 select-none">
    <div
      v-show="playing"
      class="relative flex h-3 items-center justify-between overflow-x-hidden"
    >
      <div v-for="n in 50" :key="n" class="waveform-bar shrink-0" />
    </div>
    <div
      v-show="!playing"
      class="relative flex h-3 items-center justify-between overflow-x-hidden"
    >
      <div v-for="n in 50" :key="n" class="waveform-bar-2 shrink-0" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playing: Boolean,
  },
  mounted() {
    const bars = document.querySelectorAll('.waveform-bar');
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.animationDuration = `${Math.random() * (0.7 - 0.2) + 0.2}s`;
    }
  },
};
</script>

<style lang="scss" scoped>
.waveform-bar-2 {
  width: 1px;
  height: 1px;
  background: #e3ff2f;
}

.waveform-bar {
  animation-name: wave-lg;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-direction: alternate;
  background: #e3ff2f;
  height: 100%;
  width: 1px;

  &:nth-child(-n + 7),
  &:nth-last-child(-n + 7) {
    animation-name: wave-md;
  }

  &:nth-child(-n + 3),
  &:nth-last-child(-n + 3) {
    animation-name: wave-sm;
  }
}

@keyframes wave-sm {
  0% {
    opacity: 0.35;
    height: 10%;
  }
  100% {
    opacity: 1;
    height: 25%;
  }
}

@keyframes wave-md {
  0% {
    opacity: 0.35;
    height: 15%;
  }
  100% {
    opacity: 1;
    height: 50%;
  }
}

@keyframes wave-lg {
  0% {
    opacity: 0.35;
    height: 15%;
  }
  100% {
    opacity: 1;
    height: 70%;
  }
}
</style>

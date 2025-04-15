<template>
  <ClientOnly>
    <div ref="countdown" class="relative">
      <Countdown
        :main-flip-background-color="black ? '#000' : '#aaa'"
        :second-flip-background-color="black ? '#222' : '#fff'"
        :main-color="black ? '#fff' : '#000'"
        :second-flip-color="black ? '#fff' : '#000'"
        countdown-size="1rem"
        :show-labels="false"
      />
      <div class="pl-2 pr-1">
        <img src="~/blank.png" class="mt-2 w-full" alt="clock" />
      </div>
    </div>
  </ClientOnly>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  components: {
    Countdown: defineAsyncComponent(async () => {
      const { Countdown } = await import('vue3-flip-countdown');
      return Countdown;
    }),
  },
  props: {
    black: Boolean,
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.countdown.style.setProperty(
        '--countdown-color',
        this.black ? '#fff' : '#000',
      );
    });
  },
};
</script>

<style lang="scss">
.flip-clock {
  display: flex;
  justify-content: space-between;
}

.flip-clock__piece {
  position: relative;
  display: inline-flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 !important;

  &::before {
    content: '';
    opacity: 0.75;
    width: 2px;
    height: 4px;
    background-color: var(--countdown-color);
    position: absolute;
    z-index: 99;
    left: 0;
    top: calc(50% - 2px);
  }

  &::after {
    content: '';
    opacity: 0.75;
    width: 2px;
    height: 4px;
    background-color: var(--countdown-color);
    position: absolute;
    z-index: 99;
    right: 0;
    top: calc(50% - 2px);
  }
}
</style>

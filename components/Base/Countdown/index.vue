<template>
  <div v-if="startDate" class="lecture-countdown relative">
    <Countdown
      :main-flip-background-color="'#000'"
      :second-flip-background-color="'#222'"
      :main-color="'#fff'"
      :second-flip-color="'#fff'"
      countdown-size="0.8rem"
      :show-labels="false"
      :deadline-i-s-o="startDate"
      :class="open ? '' : 'opacity-0'"
      @time-elapsed="() => $emit('timeElapsed')"
    />
    <BaseSkeleton
      v-if="!open"
      :length="1"
      class="absolute left-0 top-0 w-full opacity-50"
      height="1.25rem"
    />
  </div>
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
    startDate: String,
  },
  data() {
    return {
      open: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.open = true;
    }, 1500);
  },
};
</script>

<style lang="scss">
.lecture-countdown {
  .flip-clock__piece {
    position: relative;
    &::before {
      content: ':';
      font-size: 1rem;
      font-weight: 700;
      position: absolute;
      right: -7px;
      color: #fff;
    }
    &:last-child::before {
      content: '';
    }
  }
}
</style>

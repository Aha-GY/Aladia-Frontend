<template>
  <TouchRipple
    color="#ffffff"
    :opacity="0.2"
    :duration="200"
    class="flex h-full w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-full"
  >
    <slot />
  </TouchRipple>
</template>

<script>
import { TouchRipple } from 'vue-touch-ripple';
import 'vue-touch-ripple/style.css';

export default {
  components: {
    TouchRipple,
  },
};
</script>

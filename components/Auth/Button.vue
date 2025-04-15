<template>
  <div
    class="relative flex h-10 w-full items-center justify-center overflow-hidden rounded-md border border-white/0 bg-black text-center text-sm"
    :class="
      disabled || loading
        ? 'pointer-events-none opacity-70'
        : 'scale-100 cursor-pointer transition-all hover:border-white/40 active:scale-95'
    "
  >
    <div class="gradient absolute inset-0 opacity-50" />
    <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
    <div v-else><slot /></div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    loading: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.gradient {
  background: linear-gradient(
    15deg,
    rgba(255, 255, 255, 0) 9.55%,
    rgba(255, 255, 255, 0) 30.28%,
    rgba(255, 255, 255, 0.4) 35.93%,
    rgba(255, 255, 255, 0) 41.58%,
    rgba(255, 255, 255, 0) 59.02%,
    #fff 67.97%,
    rgba(255, 255, 255, 0) 74.56%,
    #fff 100%
  );
}
</style>

<template>
  <div
    class="pointer-events-none absolute inset-0 z-10 select-none bg-black/80 transition-all duration-300"
    :class="animation ? 'p-5 opacity-100' : 'p-0 opacity-0'"
  >
    <div
      class="flex h-full w-full flex-col items-center justify-center rounded-xl border-4 border-dashed border-white/50 pt-10"
    >
      <i class="fa-solid fa-arrow-down-to-bracket mb-4 text-6xl" />
      <div class="text-2xl">
        {{ $t('space.drop') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      animation: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.animation = true;
    }, 100);
  },
};
</script>

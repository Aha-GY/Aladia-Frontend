<template>
  <div class="z-[10] flex h-8 flex-shrink-0 items-center justify-center">
    <div
      class="hover-tooltip flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
      data-tooltip="zoom in"
      data-cy="069deccf327c7907"
      @click="operate('zoom-in')"
    >
      <i class="fa-regular fa-magnifying-glass-plus" />
    </div>
    <div
      class="hover-tooltip flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
      data-tooltip="zoom out"
      data-cy="6073c3ef8699995d"
      @click="operate('zoom-out')"
    >
      <i class="fa-regular fa-magnifying-glass-minus" />
    </div>
    <div
      class="hover-tooltip flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
      data-tooltip="rotate left"
      data-cy="bd149a5110a4f8cd"
      @click="operate('rotate-left')"
    >
      <i class="fa-solid fa-arrow-rotate-left" />
    </div>
    <div
      class="hover-tooltip flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
      data-tooltip="rotate right"
      data-cy="cd657bfda186d501"
      @click="operate('rotate-right')"
    >
      <i class="fa-solid fa-arrow-rotate-right" />
    </div>
  </div>
</template>
<script>
export default {
  emits: ['operate'],
  methods: {
    operate(type) {
      this.$emit('operate', type);
    },
  },
};
</script>

<template>
  <div
    class="hide-scrollbar absolute inset-0 flex flex-col overflow-y-auto overscroll-contain rounded border border-white/10 bg-[#060606] transition-all duration-300"
    :class="open ? 'translate-x-0' : 'translate-x-[28em]'"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

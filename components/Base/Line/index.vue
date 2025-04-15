<template>
  <div
    class="absolute bottom-0 left-0 right-0 flex h-[1px] justify-center bg-white/10 transition-all duration-300 group-hover/line:bg-white/30"
  >
    <div
      class="h-full bg-[#a2842a] transition-all duration-300"
      :class="active ? 'w-full' : 'w-0'"
    />
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

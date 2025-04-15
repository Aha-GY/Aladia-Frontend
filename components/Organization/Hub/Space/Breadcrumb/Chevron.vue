<template>
  <div
    class="flex size-6 cursor-pointer items-center justify-center rounded-md bg-[#FFFFFF08] duration-300"
    :class="open ? 'bg-white/10' : 'hover:bg-white/10'"
  >
    <i
      class="fa-light fa-chevron-right transition-all duration-300"
      :class="open ? 'rotate-90' : ''"
    />
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
    },
  },
};
</script>

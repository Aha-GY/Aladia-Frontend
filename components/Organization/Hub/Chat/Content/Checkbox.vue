<template>
  <div
    class="flex size-3.5 items-center justify-center rounded-full bg-white/30"
  >
    <i
      class="fa-sharp fa-solid fa-circle-check text-[#FFDA33] transition-all"
      :class="value ? 'scale-100' : 'scale-0'"
    />
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

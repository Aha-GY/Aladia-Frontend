<template>
  <div
    class="group/close flex h-7 w-7 items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
    :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
  >
    <i
      class="fa-solid fa-arrow-left transition-all group-hover/close:scale-125"
    />
  </div>
</template>
<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

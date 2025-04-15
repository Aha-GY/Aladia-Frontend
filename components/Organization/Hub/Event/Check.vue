<template>
  <div
    class="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border"
    :class="active ? 'border-[#ad8134]' : 'border-white/20'"
  >
    <div v-if="active" class="h-3 w-3 rounded-full bg-[#ad8134]" />
  </div>
</template>

<script>
export default {
  props: {
    active: Boolean,
  },
};
</script>

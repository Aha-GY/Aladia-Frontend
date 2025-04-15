<template>
  <div class="flex flex-col gap-1">
    <div class="skeleton h-16 w-16 rounded-md opacity-5" />
    <div v-if="isTitle" class="skeleton h-4 w-2/3 rounded-md opacity-5" />
  </div>
</template>
<script>
export default {
  props: {
    isTitle: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

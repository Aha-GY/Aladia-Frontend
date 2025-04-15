<template>
  <img v-if="item.gif" :src="item.gif" alt="GIF" class="w-24 rounded-5" />
</template>
<script setup>
defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});
</script>

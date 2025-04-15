<template>
  <div class="group flex items-center gap-2 overflow-hidden py-1.5">
    <i class="fa-regular fa-building-columns" />
    <span>{{ bankInfo.name }}</span>
    <span>{{ `···· ${bankInfo.lastFour}` }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const bankInfo = computed(() => props.item.bankAccount);
</script>

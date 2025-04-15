<template>
  <div class="group flex items-center gap-2 overflow-hidden">
    <div class="flex items-center text-xs">
      <BaseIconCurrency currency="USD" />
      <div class="ml-1">
        {{ moneyFormat(totalPaid) }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const totalPaid = computed(() => props.item.totalPaid);
</script>

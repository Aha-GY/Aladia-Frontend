<template>
  <div class="group flex items-center gap-2 overflow-hidden">
    <div class="flex items-center text-xs">
      <BaseIconCurrency currency="USD" />
      <div class="ml-1">
        {{ moneyFormat(productId.totalAmount * licencesBought) }}
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
const productId = computed(() => props.item.productId);
const licencesBought = computed(() => props.item.licencesBought);
</script>

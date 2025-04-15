<template>
  <div class="group flex items-center gap-2 overflow-hidden">
    <div v-if="!nextInstallment">
      {{ $t('category.payout.installment.done') }}
    </div>
    <div v-else>
      {{ formatDate(nextInstallment, 'DD MMM') }} for $
      {{ moneyFormat(item.installmentsAmount) }}
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
const nextInstallment = computed(() =>
  props.item.futureInstallments.length
    ? props.item.futureInstallments[0]
    : null,
);
</script>

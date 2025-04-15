<template>
  <div class="group flex items-center gap-2 overflow-hidden">
    {{ item.totalInstallment - item.currentInstallment }}
    <span class="text-[#707070]">
      {{ $t('category.payout.installment.name') }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

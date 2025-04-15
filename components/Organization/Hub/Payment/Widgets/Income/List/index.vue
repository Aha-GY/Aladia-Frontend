<template>
  <div class="flex h-full min-w-[25rem] flex-1 flex-col gap-2">
    <div
      class="flex items-center justify-between border-b border-[#282828] pb-2"
    >
      <div class="text-lg">
        {{ $t('payment.income.last') }}
      </div>
      <!-- <div class="text-xs text-[#707070]">until 24 february 2024</div> -->
    </div>
    <div
      v-if="lastIncomes.length !== 0"
      class="flex flex-1 flex-col gap-3 overflow-y-auto"
    >
      <OrganizationHubPaymentWidgetsIncomeListItem
        v-for="(item, index) in lastIncomes"
        :key="index"
        :item="item"
      />
    </div>
    <BaseNoData v-else class="flex flex-1 flex-col gap-3 overflow-y-auto" />
  </div>
</template>

<script setup>
const hubPaymentStore = useHubPaymentStore();
const lastIncomes = computed(() => hubPaymentStore.lastIncomes);
</script>

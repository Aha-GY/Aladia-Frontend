<template>
  <div class="flex h-full min-w-[25rem] flex-1 flex-grow flex-col gap-2">
    <div
      class="flex items-center justify-between border-b border-[#282828] pb-2"
    >
      <div class="text-lg">
        {{ $t('category.payout.future') }}
      </div>
    </div>
    <div
      v-if="futurePaymentsData.length !== 0"
      class="flex flex-1 flex-col gap-3 overflow-y-auto"
    >
      <OrganizationHubPaymentWidgetsSpendingFutureListItem
        v-for="(item, index) in futurePaymentsData"
        :key="index"
        :item="item"
      />
    </div>
    <BaseNoData v-else class="flex flex-1 flex-col gap-3 overflow-y-auto" />
  </div>
</template>

<script setup>
const hubPaymentStore = useHubPaymentStore();

const futurePaymentsData = computed(() => hubPaymentStore.futurePayments);
</script>

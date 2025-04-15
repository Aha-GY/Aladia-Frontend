<template>
  <div
    class="relative flex flex-col gap-2 text-[#D9D9D9]"
    :class="
      hubPaymentStore.open ? 'h-[calc(100vh-23.5rem)]' : 'h-[calc(100vh-8rem)]'
    "
  >
    <OrganizationHubPaymentHistoryHeader />
    <client-only>
      <OrganizationHubPaymentHistoryTable />
    </client-only>
    <div class="flex items-center justify-between pb-4">
      <div class="flex-shrink-0 text-sm text-[#707070]">
        <BaseSkeleton v-if="loading" :length="1" class="w-36" />
        <span v-else-if="total" class="pl-4">
          {{
            $t('filter.result', {
              current: `${(currentPage - 1) * limit + 1} ~ ${(currentPage - 1) * limit + currentDataCount}`,
              total: total,
            })
          }}
        </span>
      </div>
      <div>
        <div v-if="loading" class="flex gap-2">
          <BaseSkeleton :length="1" class="w-20" />
          <BaseSkeleton :length="1" class="w-20" />
        </div>
        <BasePagination v-else :cursor="cursor" @change="onChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
const hubPaymentStore = useHubPaymentStore();
const loading = computed(() => hubPaymentStore.loading);
const total = computed(
  () => hubPaymentStore.v2PaymentTransactionsCursor.totalItems,
);
const currentDataCount = computed(
  () => hubPaymentStore.v2PaymentTransactions.length,
);
const cursor = computed(() => hubPaymentStore.v2PaymentTransactionsCursor);
const currentPage = computed(() => hubPaymentStore.currentPage);
const limit = computed(
  () => hubPaymentStore.v2PaymentTransactionsFilterQuery.limit,
);

function onChange({ type, token }) {
  hubPaymentStore.getPaymentTransactionsPageChange({
    type,
    token,
  });
}
</script>

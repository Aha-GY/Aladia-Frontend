<template>
  <div
    v-loading="sidebarFilterLoading"
    class="overflow-hidden bg-[#020202] text-sm text-[#d9d9d9]"
  >
    <!-- header -->
    <div class="grid grid-cols-9 items-center bg-[#0C0C0C] p-2">
      <BaseIconClose
        class="ml-2"
        data-cy="80009bd7da8ec848"
        @click="handleCloseDrawer"
      />

      <div class="col-span-5 flex items-center gap-2">
        <i class="fa-regular fa-filter text-sm" />
        <span class="text-base">
          {{ $t('base.courses.filters') }}
        </span>
      </div>

      <div class="col-span-3 flex justify-end">
        <BaseButton
          label="$t:base.filter.clear"
          size="small"
          :disabled="!hasFilter"
          @click="handleClearFilters"
        />
      </div>
    </div>

    <!-- body -->
    <div class="mt-2 h-[calc(100vh-9rem)] overflow-y-auto bg-[#0C0C0C] pt-2">
      <OrganizationHubPaymentHistoryDrawerFilterTransSpending
        v-if="dataType === DATA_TYPES.TRANS_SPENDING"
      />
      <OrganizationHubPaymentHistoryDrawerFilterTransIncome
        v-if="dataType === DATA_TYPES.TRANS_INCOME"
      />
      <OrganizationHubPaymentHistoryDrawerFilterSubsSpending
        v-if="dataType === DATA_TYPES.SUB_SPENDING"
      />
      <OrganizationHubPaymentHistoryDrawerFilterSubsIncome
        v-if="dataType === DATA_TYPES.SUB_INCOME"
      />
      <OrganizationHubPaymentHistoryDrawerFilterPayout
        v-if="dataType === DATA_TYPES.PAYOUT"
      />
      <OrganizationHubPaymentHistoryDrawerFilterCustomer
        v-if="dataType === DATA_TYPES.CUSTOMER"
      />
    </div>

    <div class="mt-2 flex items-end justify-end bg-[#0C0C0C] p-3">
      <BaseButton
        :disabled="!hasResult"
        size="small"
        @click="handleClickFilter"
      >
        {{ resultText }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

import { DATA_TYPES } from '~/constant/payment.js';

const emits = defineEmits(['close']);

const { t } = useI18n();
const hubPaymentStore = useHubPaymentStore();

const dataType = computed(() => hubPaymentStore.dataType);
const sidebarFilterLoading = computed(
  () => hubPaymentStore.sidebarFilterLoading,
);
const sidebarFilterResCount = computed(
  () => hubPaymentStore.sidebarFilterResCount,
);
const hasResult = computed(() => sidebarFilterResCount.value !== 0);
const hasFilter = computed(
  () => !!Object.keys(hubPaymentStore.sidebarFilters).length,
);
const resultText = computed(() => {
  if (!hasResult.value) {
    return t('category.transaction.result');
  }
  if (sidebarFilterResCount.value === 1) {
    return t('category.transaction.resultOne', {
      count: sidebarFilterResCount.value,
    });
  }

  return t('category.transaction.results', {
    count: sidebarFilterResCount.value,
  });
});

function handleCloseDrawer() {
  emits('close');
}

function handleClearFilters() {
  hubPaymentStore.handleClearFilters();
}

function handleClickFilter() {
  hubPaymentStore.handleClickFilters();
}
</script>

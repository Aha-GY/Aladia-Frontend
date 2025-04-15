<template>
  <div class="overflow-hidden bg-[#020202] text-sm text-[#d9d9d9]">
    <!-- header -->
    <div class="grid grid-cols-9 items-center bg-[#0C0C0C] p-1">
      <BaseIconClose
        class="ml-2"
        data-cy="80009bd7da8ec848"
        @click="handleCloseDrawer"
      />

      <div class="col-span-5 flex items-center gap-2">
        <i class="fa-solid fa-sort text-[10px] text-[#D4D4D4]" />
        <span class="text-base">
          {{ $t('base.sort.label') }}
        </span>
      </div>
    </div>

    <!-- body -->
    <div class="mx-1 mt-2 overflow-y-auto rounded-5 bg-[#0C0C0C]">
      <OrganizationHubPaymentHistoryDrawerSortByCompsRowItem
        v-if="dataType === DATA_TYPES.PAYOUT"
        class="h-[9.6rem]"
      />
      <OrganizationHubPaymentHistoryDrawerSortByCompsRowItem
        v-if="dataType === DATA_TYPES.CUSTOMER"
        class="h-[9.5rem]"
      />
      <OrganizationHubPaymentHistoryDrawerSortByCompsRowItem
        v-if="dataType === DATA_TYPES.SUB_INCOME"
        class="h-[12.3rem]"
      />
      <OrganizationHubPaymentHistoryDrawerSortByCompsRowItem
        v-if="dataType === DATA_TYPES.SUB_SPENDING"
        class="h-[15rem]"
      />
      <OrganizationHubPaymentHistoryDrawerSortByCompsRowItem
        v-if="dataType === DATA_TYPES.TRANS_INCOME"
        class="h-[9.5rem]"
      />
      <OrganizationHubPaymentHistoryDrawerSortByCompsRowItem
        v-if="dataType === DATA_TYPES.TRANS_SPENDING"
        class="h-[9.5rem]"
      />
    </div>
    <div class="mx-1 mt-2 overflow-y-auto rounded-5 bg-[#0C0C0C]">
      <OrganizationHubPaymentHistoryDrawerSortByCompsSubscriptionAndInstallement
        v-if="dataType === DATA_TYPES.CUSTOMER"
        class="h-[9.6rem]"
      />
      <OrganizationHubPaymentHistoryDrawerSortByCompsSubscriptionAndInstallement
        v-if="dataType === DATA_TYPES.SUB_INCOME"
        class="h-[12.5rem]"
      />
      <OrganizationHubPaymentHistoryDrawerSortByCompsSubscriptionAndInstallement
        v-if="dataType === DATA_TYPES.SUB_SPENDING"
        class="h-[12.5rem]"
      />
    </div>
  </div>
</template>

<script setup>
import { DATA_TYPES } from '~/constant/payment.js';

const emits = defineEmits(['close']);
const hubPaymentStore = useHubPaymentStore();
const dataType = computed(() => hubPaymentStore.dataType);

function handleCloseDrawer() {
  emits('close');
}
</script>

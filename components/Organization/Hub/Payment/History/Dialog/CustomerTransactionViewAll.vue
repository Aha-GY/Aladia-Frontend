<template>
  <div class="overflow-hidden">
    <!-- body -->
    <div class="h-[calc(100vh-12rem)] overflow-auto">
      <div class="grid grid-cols-9 bg-[#0C0C0C] px-3 text-[#d9d9d9]">
        <div class="col-span-9 col-start-1 mt-2 flex items-center gap-2">
          <i class="fa-regular fa-money-bill-wave pl-1 text-xs" />
          <span>
            {{ $t('category.transaction.label') }}
          </span>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-5 bg-white/5 p-1"
          >
            {{ transactions.length }}
          </div>
        </div>
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          v-loading="transactionLoadingId === transaction.id"
          class="col-span-9 col-start-1 mb-1.5 mt-2 grid cursor-pointer grid-cols-9 rounded-5 px-3 hover:bg-white/5"
          @click="handleTransactionClick(transaction.id)"
        >
          <!-- First Row: Date and Status -->
          <div
            class="col-span-9 col-start-1 flex items-center justify-between py-1"
          >
            <span class="text-sm text-[#565656]">
              {{ formatDate(transaction.createdAt, 'DD MMM YYYY, HH:mm') }}
            </span>
            <OrganizationHubPaymentHistoryListStatus
              :item="{ status: transaction.status }"
            />
          </div>

          <!-- Second Row: Title -->
          <div class="col-span-8 col-start-1 text-base text-[#D9D9D9]">
            <span>{{ transaction.course?.title }}</span>
          </div>

          <!-- Third Row: ID, QTY, and Amount -->
          <div
            class="col-span-9 col-start-1 flex items-center justify-between py-1.5"
          >
            <span class="truncate text-xs text-[#565656]">
              {{ `ID: ${transaction.id}` }}
            </span>
            <div class="flex items-center space-x-1">
              <span class="text-[#565656]">
                {{ `QTY: ${transaction.licencesBought}` }}
              </span>
              <div class="flex items-center">
                <div>
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="transaction.totalAmount"
                    :is-bold="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DIALOG_TITLE_TYPES } from '~/constant/payment';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const hubPaymentStore = useHubPaymentStore();

const transactionLoadingId = ref(null);
const transactions = computed(() => props.item?.data || []);

async function handleTransactionClick(transactionId) {
  if (transactionLoadingId.value) {
    return;
  }
  transactionLoadingId.value = transactionId;
  const res = await hubPaymentStore.getPaymentTransactionDetail(transactionId);
  transactionLoadingId.value = null;
  hubPaymentStore.addDialogNavHistory({
    dataType: DIALOG_TITLE_TYPES.TRANS_INCOME,
    cacheData: res,
  });
}
</script>

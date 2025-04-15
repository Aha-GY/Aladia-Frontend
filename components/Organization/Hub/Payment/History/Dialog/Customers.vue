<template>
  <div class="h-[calc(100vh-12rem)] overflow-auto">
    <div
      v-if="viewAllLoading"
      v-loading="true"
      class="fixed z-50 h-[calc(100vh-12rem)]"
      :class="$device.isMobile ? 'w-[22rem]' : 'w-[28.125rem]'"
    />
    <div
      class="relative mb-2 h-[15.375rem] overflow-hidden bg-[#0C0C0C] px-2 text-[#d9d9d9]"
    >
      <OrganizationHubPaymentHistoryDialogCompsDetailHeader
        :detail="props.item"
      />
    </div>
    <div class="mb-2 grid grid-cols-9 bg-[#0C0C0C] px-4 py-4 text-[#d9d9d9]">
      <!-- Payment Method Row -->
      <div class="col-span-8 col-start-1 flex items-center">
        <i class="fa-regular fa-money-bill-wave text-xs" />
        <span class="ml-2 mr-3">{{ $t('payment.title') }}</span>
        <div
          class="flex h-8 w-8 items-center justify-center rounded-5 bg-white/5 p-1"
        >
          {{ item.paymentMethods.length }}
        </div>
      </div>
      <div class="col-span-9 mt-4 flex items-center">
        <OrganizationHubPaymentHistoryDialogCompsDetailHeaderCarouselList
          :item="item"
        />
      </div>
    </div>
    <div
      class="mb-2 grid grid-cols-9 items-center bg-[#0C0C0C] px-4 text-[#d9d9d9]"
    >
      <div
        class="col-span-9 col-start-1 mb-3 mt-2 flex items-center justify-between gap-2"
      >
        <!-- Left-aligned content -->
        <div class="flex items-center gap-2">
          <i class="fa-regular fa-money-bill-wave pl-1 text-xs" />
          <span>
            {{ $t('category.transaction.label') }}
          </span>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-5 bg-white/5 p-1"
          >
            {{ item.totalTransactions }}
          </div>
        </div>

        <!-- Right-aligned button -->
        <div
          v-if="item.totalTransactions > 2"
          class="cursor-pointer rounded-5 px-3 hover:bg-white/5"
          @click="handleViewAllTransactions(props.item.owner.owner.id)"
        >
          <span>{{ $t('category.transaction.viewAll') }}</span>
          <i class="fa-solid fa-arrow-right ml-2" />
        </div>
      </div>

      <div
        v-for="transaction in transactions"
        :key="transaction.id"
        v-loading="transactionLoadingId === transaction.id"
        class="col-span-9 col-start-1 mb-1.5 grid cursor-pointer grid-cols-9 rounded-5 px-3 hover:bg-white/5"
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
          {{ transaction.course.title }}
        </div>

        <!-- Third Row: ID, QTY, and Amount -->
        <div
          class="col-span-9 col-start-1 flex items-center justify-between py-1.5"
        >
          <span class="truncate text-xs text-[#565656]">
            {{ `ID: ${transaction.id}` }}
          </span>
          <div class="flex items-center space-x-1">
            <span>{{ `QTY: ${transaction.licencesBought}` }}</span>
            <div class="flex items-center">
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="transaction.totalAmount"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Subscriptions Section -->
    <div
      class="mb-2 grid grid-cols-9 items-center bg-[#0C0C0C] px-4 text-[#d9d9d9]"
    >
      <div
        class="col-span-9 col-start-1 mb-3 mt-2 flex items-center justify-between gap-2"
      >
        <!-- Left-aligned content -->
        <div class="flex items-center gap-2">
          <i class="fa-regular fa-calendar-clock text-xs" />
          <span>
            {{ $t('category.money.subscriptions') }}
          </span>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-5 bg-white/5 p-1"
          >
            {{ item.totalSubs }}
          </div>
        </div>

        <!-- Right-aligned button -->
        <div
          v-if="item.totalSubs > 2"
          v-loading="subInfoLoadingId === props.item.owner.owner.id"
          class="cursor-pointer rounded-5 px-3 hover:bg-white/5"
          @click="handleViewAllSubscriptions(props.item.owner.owner.id)"
        >
          <span>{{ $t('category.transaction.viewAll') }}</span>
          <i class="fa-solid fa-arrow-right ml-2" />
        </div>
      </div>
      <div
        v-for="subscription in subscriptions"
        :key="subscription.id"
        v-loading="subInfoLoadingId === subscription.id"
        class="col-span-9 mb-1.5 grid cursor-pointer grid-cols-9 items-center rounded-5 px-3 hover:bg-white/5"
        @click="handleClickSubscriptionItem(subscription.id)"
      >
        <!-- First Row: Date and Status -->
        <div
          class="col-span-9 col-start-1 flex items-center justify-between py-1"
        >
          <span class="text-sm text-[#565656]">
            {{ formatDate(subscription.createdAt, 'DD MMM YYYY, HH:mm') }}
          </span>
          <OrganizationHubPaymentHistoryListStatus
            :item="{
              status: mapStatusCanceledToCompleted({
                status: subscription.subscriptionStatus,
              }),
            }"
          />
        </div>

        <!-- Second Row: Title -->
        <div class="col-span-8 col-start-1 text-base text-[#D9D9D9]">
          {{ subscription.course.title }}
        </div>

        <!-- Third Row: ID, QTY, and Amount -->
        <div
          class="col-span-9 col-start-1 flex items-center justify-between py-1.5"
        >
          <span class="truncate text-xs text-[#565656]">
            {{ `ID: ${subscription.id}` }}
          </span>
          <div class="flex items-center space-x-1">
            <span>{{ `QTY: ${subscription.licencesBought}` }}</span>
            <div class="flex items-center">
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="
                    calculateSubscriptionTotalPaid({
                      recurringTransactions: subscription.recurringTransactions,
                      feeTransaction: subscription.feeTransaction,
                      successTextStatus: PAYMENT_STATUS.SUCCESS.text,
                    })
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PAYMENT_STATUS,
  QUERY_PARAMS,
  DIALOG_TITLE_TYPES,
} from '~/constant/payment';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const hubPaymentStore = useHubPaymentStore();
const transactionLoadingId = ref(null);
const subInfoLoadingId = ref(null);
const viewAllLoading = ref(false);
const isLoading = computed(
  () =>
    transactionLoadingId.value ||
    subInfoLoadingId.value ||
    viewAllLoading.value,
);
const subscriptions = computed(() => props.item.subscriptions);
const transactions = computed(() => props.item.transactions);

// request Transaction Detail to navigate
async function handleTransactionClick(transactionId) {
  if (isLoading.value) {
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

// request Subscription Detail to navigate
async function handleClickSubscriptionItem(subscriptionId) {
  if (isLoading.value) {
    return;
  }
  subInfoLoadingId.value = subscriptionId;
  const res =
    await hubPaymentStore.getPaymentSubscriptionsDetail(subscriptionId);
  subInfoLoadingId.value = null;
  hubPaymentStore.addDialogNavHistory({
    dataType: DIALOG_TITLE_TYPES.SUB_INCOME,
    cacheData: res,
  });
}

// request Transaction ALL to navigate
async function handleViewAllTransactions(customerId) {
  if (isLoading.value) {
    return;
  }
  const queryParam = {
    filterQuery: QUERY_PARAMS.FILTER_QUERY.INCOMING.key,
    limit: '0',
    customerIds: [customerId],
  };
  viewAllLoading.value = true;
  const res = await hubPaymentStore.getAllTransactionCustomer(queryParam);
  viewAllLoading.value = false;
  hubPaymentStore.addDialogNavHistory({
    dataType: DIALOG_TITLE_TYPES.CUS_VIEW_ALL_TRANS,
    cacheData: res,
  });
}

// request Subscription ALL to navigate
async function handleViewAllSubscriptions(customerId) {
  if (isLoading.value) {
    return;
  }
  const queryParam = {
    filterQuery: QUERY_PARAMS.FILTER_QUERY.INCOMING.key,
    limit: '0',
    customerIds: [customerId],
  };
  viewAllLoading.value = true;
  const res = await hubPaymentStore.getAllSubscriptionCustomer(queryParam);
  viewAllLoading.value = false;
  hubPaymentStore.addDialogNavHistory({
    dataType: DIALOG_TITLE_TYPES.CUS_VIEW_ALL_SUBS,
    cacheData: res,
  });
}
</script>

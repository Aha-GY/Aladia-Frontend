<template>
  <div class="overflow-hidden">
    <!-- body -->
    <div class="h-[calc(100vh-12rem)] overflow-auto">
      <div
        class="mb-3 grid grid-cols-9 items-center overflow-auto bg-[#0C0C0C] px-2 text-xs text-[#FAFAFA]"
      >
        <!-- row1 -->
        <div
          class="col-span-6 col-start-1 flex items-center gap-1 px-2 py-2 text-base"
        >
          <i class="fa-solid fa-circle-dollar-to-slot" />
          <span>
            {{ $t('category.transaction.net') }}
          </span>
          <div>
            <OrganizationHubPaymentHistoryDialogCompsAmountTip
              :money="item.totalAmount"
              size="normal"
              :currency="item.bankAccount.currency"
            />
          </div>
        </div>
        <div class="col-span-3 justify-self-end pr-2">
          <OrganizationHubPaymentHistoryListStatus
            :item="{ status: item.status }"
          />
        </div>
        <div class="col-span-6 col-start-1 flex items-center gap-1.5 px-3 py-2">
          <div class="col-span-8 text-[#707070]">
            {{ formatDate(item.createdAt, 'DD MMM YYYY, HH:mm') }}
          </div>
        </div>
        <div
          data-cy="359f5e730cb752e2"
          class="item-center col-span-3 flex gap-1 justify-self-end rounded-md border border-gray-800 bg-[#0C0C0C]"
        >
          <OrganizationHubPaymentHistoryDialogCompsTransactionID
            :id="props.item.id"
          />
        </div>
      </div>
      <div
        class="mb-2 grid grid-cols-9 items-center bg-[#0C0C0C] text-[#d9d9d9]"
      >
        <div
          class="col-span-8 col-start-1 mb-2 mt-3 px-4 text-xs text-[#565656]"
        >
          {{ $t('category.role.customer') }}
        </div>

        <!-- row7 -->

        <div class="col-span-8 ml-2">
          <OrganizationHubPaymentHistoryListUser
            :user-item="recipient"
            :show-popup="false"
          />
        </div>

        <!-- row8 -->
        <div
          class="col-span-8 col-start-1 mb-2 mt-3 px-4 text-xs text-[#565656]"
        >
          {{ $t('category.role.issuer') }}
        </div>

        <!-- row9 -->

        <div class="col-span-8 mb-2 ml-2">
          <OrganizationHubPaymentHistoryListUser
            :show-popup="false"
            :user-item="{
              owner: {
                fullName: 'Aladia',
                picture: '/logo/image.png',
                online: true,
              },
            }"
          />
        </div>
      </div>
      <div class="mb-2 grid grid-cols-9 gap-3 bg-[#0C0C0C] px-4 text-[#d9d9d9]">
        <div class="col-span-8 col-start-1 mb-2 mt-3">
          <i class="fa-thin fa-square-info text-xs" />
          <span class="ml-3">
            {{ $t('category.payout.details') }}
          </span>
        </div>
        <div class="col-span-9">
          <div class="flex justify-between">
            <span>
              {{ $t('category.payout.quantity') }}
            </span>
            <span>{{ transactions.length }}</span>
          </div>
        </div>
        <div class="col-span-9">
          <div class="flex justify-between">
            <span>
              {{ $t('category.payout.bank') }}
            </span>
            <div class="col-span-8 text-base">
              {{ `${bankAccount.name}・・・・${bankAccount.lastFour}` }}
            </div>
          </div>
        </div>
        <div class="col-span-9">
          <div class="flex justify-between">
            <span>
              {{ $t('category.exchange.title') }}
            </span>
            <div class="flex items-center">
              <div class="flex items-center">
                <div>
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="1.0"
                    :currency="item.currency"
                  />
                </div>
              </div>
              <span class="ml-1">-></span>
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="handleTransDatas.exchangeRate"
                  :currency="bankAccount.currency"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-9">
          <div class="flex justify-between">
            <span>
              {{ $t('category.payout.gross') }}
            </span>
            <div class="flex items-center">
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="handleTransDatas.gross"
                  :currency="bankAccount.currency"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-9">
          <div class="flex justify-between">
            <span>
              {{ $t('category.payout.fees') }}
            </span>
            <div class="flex items-center">
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="0 - handleTransDatas.fees"
                  :currency="bankAccount.currency"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-9 h-[1px] bg-white/10" />
        <div class="col-span-9">
          <div class="flex justify-between">
            <span>
              {{ $t('category.payout.net') }}
            </span>
            <div class="flex items-center">
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="handleTransDatas.total"
                  :currency="bankAccount.currency"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-2 grid grid-cols-9 bg-[#0C0C0C] px-3 text-[#d9d9d9]">
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
              {{ item.transactions.length }}
            </div>
          </div>

          <!-- Right-aligned button -->
          <div
            v-if="transactions.length > 2"
            v-loading="transactionLoadingId === transactions.id"
            class="cursor-pointer rounded-5 px-3 hover:bg-white/5"
            @click="handleViewAllClick"
          >
            <span>{{ $t('category.transaction.viewAll') }}</span>
            <i class="fa-solid fa-arrow-right ml-2" />
          </div>
        </div>

        <div
          v-for="transaction in transactionsLimit"
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
      <div class="mb-2 grid grid-cols-9 bg-[#0C0C0C] px-3 text-[#d9d9d9]">
        <div class="col-span-8 col-start-1 flex h-[2.5rem] items-center py-2">
          <i class="fa-regular fa-money-bill-wave pl-1 text-xs" />
          <span class="ml-2">
            {{ $t('category.payout.detail.bank') }}
          </span>
        </div>
        <div
          class="col-span-9 mb-2 flex h-[10rem] items-center gap-6 px-1 text-[#F1F1F1]"
        >
          <div
            class="flex h-[8.375rem] w-[11.7125rem] items-center justify-center rounded-5 bg-[#E2E2E2]/10"
          >
            <i class="fa-thin fa-building-columns text-6xl text-[#707070]" />
          </div>
          <div class="w-[15rem] text-xs">
            <div class="mb-2.5">
              <span class="block text-[#808080]">Bank</span>
              <div class="flex items-center justify-between">
                <span class="text-xs">
                  <span class="text-xs">
                    {{ props.item.bankAccount.name }} ****
                    {{ props.item.bankAccount.lastFour }}
                  </span>
                </span>
              </div>
            </div>
            <div class="mb-2.5">
              <span class="block text-[#808080]">Routing Number</span>
              <div class="flex items-center justify-between">
                <span class="text-xs">
                  {{ props.item.bankAccount.routingNumber }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mb-2 grid grid-cols-9 items-center bg-[#0C0C0C] text-[#d9d9d9]"
      >
        <div class="col-span-8 col-start-2 mb-3 mt-7 flex items-center">
          <i class="fa-thin fa-clock -ml-8 text-xs" />
          <span class="ml-4 text-base text-[#FAFAFA]">
            {{ $t('category.payout.timeline') }}
          </span>
        </div>

        <div class="relative text-center">
          <i
            class="fa-regular text-base text-white/20"
            :class="`${iconClass} ${colorClass}`"
          />
          <div
            class="absolute left-[1.5375rem] top-5 z-0 h-5 w-[1px] border-l border-solid"
            :class="colorClass"
          />
        </div>

        <div class="col-span-8 py-2 pr-2">
          <div class="flex items-center justify-between">
            <span>
              {{ $t('category.payout.status') }}
            </span>
            <span class="text-xs text-[#707070]">
              {{ completedOn || '---' }}
            </span>
          </div>
        </div>

        <div class="relative text-center">
          <i
            class="fa-regular fa-landmark-magnifying-glass text-base"
            :class="`${iconClass} ${colorClass}`"
          />
          <div
            class="absolute left-[1.5375rem] top-5 z-0 h-5 w-[1px] border-l border-solid"
            :class="colorClass"
          />
        </div>
        <div class="col-span-8 my-1.5 py-2 pr-2">
          <div class="flex items-center justify-between">
            <span>
              {{ $t('category.payout.arrival') }}
            </span>
            <span class="text-xs text-[#707070]">
              {{
                `${formatDate(createAt, 'DD MMM YYYY, HH:mm')} - ${completedOn || ' --- '}`
              }}
            </span>
          </div>
        </div>
        <div class="relative text-center">
          <i
            class="fa-regular fa-money-bills text-base"
            :class="`${iconClass} ${colorClass}`"
          />
        </div>
        <div class="col-span-8 py-2 pr-2">
          <div class="flex items-center justify-between">
            <span>
              {{ $t('category.payout.started') }}
            </span>
            <span class="text-xs text-[#707070]">
              {{ formatDate(createAt, 'DD MMM YYYY, HH:mm') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PAYMENT_STATUS, DIALOG_TITLE_TYPES } from '~/constant/payment';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const hubPaymentStore = useHubPaymentStore();
const transactionLoadingId = ref(null);
const status = computed(() => props.item.status);
const bankAccount = computed(() => props.item.bankAccount);
const updatedAt = computed(() => props.item.updatedAt);
const createAt = computed(() => props.item.createdAt);
const recipient = computed(() => props.item.recipient);
const colorClass = computed(() => getProgressColor(status.value).colorClass);
const iconClass = computed(() => getProgressColor(status.value).iconClass);
const transactions = computed(() => props.item.transactions);
const transactionsLimit = computed(() => props.item.transactions.slice(0, 2));
const handleTransDatas = computed(() => calculateTrans(transactions.value));
const isLoading = computed(() => transactionLoadingId.value);
const completedOn = computed(() => {
  if (
    status.value === PAYMENT_STATUS.PAID.text ||
    status.value === PAYMENT_STATUS.FAILED.text
  ) {
    return formatDate(updatedAt.value, 'DD MMM YYYY, HH:mm');
  }
  return null;
});

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

function handleViewAllClick() {
  // todo: wait the BE limit the numbers of transactions => 2
  // then add request to get all transactions
  console.log('handleViewAllClick', transactions.value);
  hubPaymentStore.addDialogNavHistory({
    dataType: DIALOG_TITLE_TYPES.PAYOUT_VIEW_ALL_TRANS,
    cacheData: transactions.value,
  });
}

function getProgressColor(status) {
  switch (status) {
    case PAYMENT_STATUS.PAID.text:
      return {
        colorClass: 'paid-color-class',
        iconClass: 'fa-circle-check',
      };
    case PAYMENT_STATUS.FAILED.text:
      return {
        colorClass: 'failed-color-class',
        iconClass: 'fa-circle-xmark',
      };
    case PAYMENT_STATUS.PENDING.text:
      return {
        colorClass: 'pending-color-class',
        iconClass: 'fa-circle-check',
      };
    default:
      return {
        colorClass: 'default-color-class',
        iconClass: 'fa-circle-check',
      };
  }
}

function calculateTrans(transactions) {
  let gross = 0;
  let fees = 0;
  let total = 0;
  let exchangeRate = 0;
  transactions.forEach((transaction) => {
    const { status, incomeDetail } = transaction;
    if (status === PAYMENT_STATUS.SUCCESS.text && incomeDetail) {
      gross += incomeDetail.totalAmount;
      fees += incomeDetail.totalFee;
      total += incomeDetail.netAmount;
      exchangeRate = incomeDetail.exchangeRate;
    }
  });
  return { gross, fees, total, exchangeRate };
}
</script>
<style>
.paid-color-class {
  color: #88c359;
  border-color: #88c359;
}

.failed-color-class {
  color: #ef4444;
  border-color: #ef4444;
}

.pending-color-class {
  color: #e0b92c;
  border-color: #e0b92c;
}

.default-color-class {
  color: rgb(255 255 255 / 0.2);
  color: rgb(255 255 255 / 0.2);
}
</style>

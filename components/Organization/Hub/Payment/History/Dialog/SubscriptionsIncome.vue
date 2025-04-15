<template>
  <div class="overflow-hidden">
    <div>
      <!-- body -->
      <div class="h-[calc(100vh-12rem)] overflow-auto">
        <div
          v-if="hubPaymentStore.dialogLoading"
          v-loading="true"
          class="fixed z-50 h-[calc(100vh-12rem)]"
          :class="$device.isMobile ? 'w-[22rem]' : 'w-[28.125rem]'"
        />
        <div
          class="mb-3 grid grid-cols-9 items-center overflow-auto bg-[#0C0C0C] px-2 text-xs text-[#FAFAFA]"
        >
          <!-- row1 -->
          <div
            class="col-span-6 col-start-1 flex items-center gap-1 px-2 py-2 text-base"
          >
            <div>
              <OrganizationHubPaymentHistoryDialogCompsAmountTip
                :money="productInfo.totalAmount * item.licencesBought"
                size="normal"
                :currency="item.currency"
              />
            </div>
          </div>
          <div class="col-span-3 justify-self-end pr-2">
            <OrganizationHubPaymentHistoryListStatus
              :item="{ status: checkStatus }"
            />
          </div>
          <div
            class="col-span-6 col-start-1 flex items-center gap-1.5 px-3 py-2"
          >
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
        <OrganizationHubPaymentHistoryDialogCompsCourseAndName
          :course="course"
          :course-owner="courseOwner"
          :licenses-bought="item.licencesBought"
          :course-price="productInfo.totalAmount"
        />

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
              :user-item="item.payer"
              user-name-link="customer"
            />
          </div>

          <!-- row8 -->
          <div
            class="col-span-8 col-start-1 mb-2 mt-3 px-4 text-xs text-[#565656]"
          >
            {{ $t('category.role.supplier') }}
          </div>

          <!-- row9 -->
          <div class="col-span-8 mb-2 ml-2">
            <OrganizationHubPaymentHistoryListUser
              :user-item="item.recipient"
            />
          </div>
        </div>
        <div
          class="mb-2 grid grid-cols-9 gap-3 bg-[#0C0C0C] px-3 text-sm text-[#d9d9d9]"
        >
          <div class="col-span-8 col-start-1 mb-2 mt-3">
            <i class="fa-thin fa-square-info text-xs" />
            <span class="ml-3 text-base">
              {{ $t('category.details') }}
            </span>
          </div>
          <div class="col-span-9">
            <div class="flex justify-between">
              <span>
                {{ $t('category.payout.quantity') }}
              </span>
              <span>x{{ item.licencesBought }}</span>
            </div>
          </div>

          <div class="col-span-9">
            <div class="flex justify-between">
              <div>
                {{ $t('category.payout.subscription') }}
              </div>
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="subscriptionInfo.fee.amount * item.licencesBought"
                />
              </div>
            </div>
          </div>

          <div class="col-span-9">
            <div class="flex justify-between">
              <span>
                {{ $t('category.payout.installment.unit') }}
              </span>
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="item.installmentsAmount * item.licencesBought"
                />
              </div>
            </div>
          </div>
          <div class="col-span-9">
            <div class="flex justify-between">
              <span>
                {{ $t('category.payout.installment.label') }}
              </span>
              <span>
                {{ item.totalInstallment }}
              </span>
            </div>
          </div>
          <div class="col-span-9">
            <div class="flex justify-between">
              <span>
                {{ $t('category.payout.installment.total') }}
              </span>
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="
                    (productInfo.totalAmount - subscriptionInfo.fee.amount) *
                    item.licencesBought
                  "
                />
              </div>
            </div>
          </div>

          <div class="col-span-9">
            <div class="flex justify-between">
              <div>
                {{ $t('category.payout.installment.actual') }}
              </div>
              <div class="flex items-center">
                <div class="ml-1 font-bold">
                  {{
                    futureInstallment === 0
                      ? `${totalInstallment}`
                      : `${totalInstallment - futureInstallment} (${$t('category.payout.installment.still')} ${futureInstallment})`
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-9 h-[1px] bg-white/10" />
          <div class="col-span-9">
            <div class="flex justify-between">
              <div>
                {{ $t('category.exchange.title') }}
              </div>
              <div class="flex items-center">
                <div
                  v-if="!feeIncomeDetail"
                  class="flex items-center justify-end"
                >
                  ---
                </div>
                <div v-else class="flex items-center justify-end">
                  <div class="ml-1">
                    <OrganizationHubPaymentHistoryDialogCompsAmountTip
                      :money="1"
                    />
                  </div>
                  <span class="ml-1">-></span>
                  <div class="ml-1">
                    <OrganizationHubPaymentHistoryDialogCompsAmountTip
                      :money="feeIncomeDetail.exchangeRate"
                      :currency="feeIncomeDetail.currency"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-9">
            <div class="flex justify-between">
              <div>
                {{ $t('category.amount.total') }}
              </div>
              <div
                v-if="!feeIncomeDetail"
                class="flex items-center justify-end"
              >
                ---
              </div>
              <div v-else class="flex items-center justify-end">
                <div class="ml-1 font-bold">
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="productInfo.totalAmount * item.licencesBought"
                  />
                </div>
                <span class="ml-1">-></span>
                <div class="ml-1 font-bold">
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="
                      productInfo.totalAmount *
                      item.licencesBought *
                      feeIncomeDetail.exchangeRate
                    "
                    :currency="feeIncomeDetail.currency"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-9">
            <div class="flex justify-between">
              <div>
                {{ $t('category.amount.paid') }}
              </div>
              <div
                v-if="!feeIncomeDetail"
                class="flex items-center justify-end"
              >
                ---
              </div>
              <div v-else class="flex items-center justify-end">
                <div class="ml-1 font-bold">
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="
                      (productInfo.totalAmount -
                        subscriptionInfo.remainingAmount) *
                      item.licencesBought
                    "
                  />
                </div>
                <span class="ml-1">-></span>
                <div class="ml-1 font-bold">
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="
                      (productInfo.totalAmount -
                        subscriptionInfo.remainingAmount) *
                      item.licencesBought *
                      feeIncomeDetail.exchangeRate
                    "
                    :currency="feeIncomeDetail.currency"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-9 h-[1px] bg-white/10" />
          <div class="col-span-9">
            <div class="flex justify-between">
              <div>
                {{ $t('category.amount.remaining') }}
                <OrganizationHubPaymentHistoryDialogCompsTips />
              </div>
              <div
                v-if="!feeIncomeDetail"
                class="flex items-center justify-end"
              >
                ---
              </div>
              <div v-else class="flex items-center justify-end">
                <div class="ml-1 font-bold">
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="
                      subscriptionInfo.remainingAmount * item.licencesBought
                    "
                  />
                </div>
                <span class="ml-1">-></span>
                <div class="flex items-center text-[#d9d9d9]">
                  <div class="ml-1 font-bold">
                    <OrganizationHubPaymentHistoryDialogCompsAmountTip
                      :money="
                        subscriptionInfo.remainingAmount *
                        item.licencesBought *
                        feeIncomeDetail.exchangeRate
                      "
                      :currency="feeIncomeDetail?.currency"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- fees -->
          <div class="col-span-9 h-[1px] bg-white/10" />
          <div v-if="feeIncomeDetail" class="col-span-9">
            <div class="flex justify-between">
              <span>
                {{ $t('category.fee.application') }}
              </span>
              <div class="flex items-center text-[#d9d9d9]">
                <div class="ml-1 font-bold">
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="0 - totalIncomeInfo.applicationFee"
                    :currency="feeIncomeDetail?.currency"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-9">
            <div class="flex justify-between">
              <span>
                {{ $t('category.fee.stripe') }}
              </span>
              <div class="flex items-center text-[#d9d9d9]">
                <div class="ml-1 font-bold">
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="0 - totalIncomeInfo.stripeFee"
                    :currency="feeIncomeDetail?.currency"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-9">
            <div class="flex justify-between">
              <span>
                {{ $t('category.fee.total') }}
              </span>
              <div class="flex items-center text-[#d9d9d9]">
                <div class="ml-1 font-bold">
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="0 - totalIncomeInfo.totalFee"
                    :currency="feeIncomeDetail?.currency"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-9">
            <div class="flex justify-between">
              <span>
                {{ $t('category.amount.net') }}
              </span>
              <div class="flex items-center text-[#d9d9d9]">
                <div>
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="totalIncomeInfo.totalNet"
                    :currency="feeIncomeDetail?.currency"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- todo move it to the OrganizationHubPaymentHistoryDialogCompsDetailHeaderCarouselList -->
        <div
          v-if="paymentMethods.length === 1"
          class="mb-2 grid h-[13.5rem] grid-cols-9 bg-[#0C0C0C] px-4 text-[#d9d9d9]"
        >
          <!-- Payment Method Row -->
          <div class="col-span-8 col-start-1 flex h-[2.5rem] items-center py-2">
            <i class="fa-regular fa-money-bill-wave text-xs" />
            <span class="ml-2 text-base">{{ $t('payment.title') }}</span>
          </div>

          <!-- Card and Information -->
          <div class="col-span-9 mt-1 flex h-[10rem] items-center gap-10">
            <!-- Card Display (Left Side) -->
            <div class="w-[13.25rem]">
              <div class="-ml-8 scale-75">
                <OrganizationHubPaymentHistoryDialogCompsPaymentCarousel
                  :show-set-default="false"
                  :item="item"
                />
              </div>
            </div>

            <!-- Card Information (Right Side) -->
            <div class="w-[11.25rem]text-xs">
              <div class="mb-2.5">
                <span class="block text-[#707070]">Cardholder Name</span>
                <div class="flex items-center justify-between overflow-hidden">
                  <span class="truncate text-xs">
                    {{ userName }}
                  </span>
                </div>
              </div>
              <div class="mb-2.5">
                <span class="block text-[#707070]">Card Number</span>
                <span class="text-xs">
                  **** **** ****
                  {{ paymentMethods[0].card.lastFour }}
                </span>
              </div>
              <div class="mb-2.5">
                <span class="block text-[#707070]">Expiry Date</span>
                <span class="text-xs">
                  {{
                    `${paymentMethods[0].card.expMonth} / ${paymentMethods[0].card.expYear}`
                  }}
                </span>
              </div>
              <div>
                <span class="block text-[#707070]">Security Code</span>
                <span class="text-xs">***</span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="mb-2 grid grid-cols-9 bg-[#0C0C0C] px-4 py-4 text-[#d9d9d9]"
        >
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
        <div class="mb-2 grid grid-cols-9 bg-[#0C0C0C] text-[#d9d9d9]">
          <div
            class="col-span-8 col-start-2 mb-2 mt-7 text-base text-[#FAFAFA]"
          >
            <i class="fa-thin fa-clock -ml-8 text-xs" />
            <span class="ml-3">
              {{ $t('category.payout.timeline') }}
            </span>
          </div>

          <div
            v-for="(recurringItem, recurringIndex) in progressItems"
            :key="recurringItem.id"
            class="col-span-9 grid grid-cols-9 items-center pr-1.5 text-xs text-[#d9d9d9]"
          >
            <!-- Progress Indicator -->
            <div class="col-span-1 justify-self-center">
              <OrganizationHubPaymentHistoryDialogCompsProgressItem
                :uni-key="recurringItem.transactionId"
                :status="recurringItem.status"
                :completed-steps="recurringIndex + 1"
                :total-steps="progressItems.length + 1"
                line-height="4rem"
              />
            </div>

            <!-- Content -->
            <div
              v-loading="transactionLoading === recurringItem.transactionId"
              class="col-span-8 mb-1.5 rounded-5 p-2"
              :class="[
                recurringItem.transactionId
                  ? 'cursor-pointer hover:bg-white/5'
                  : '',
              ]"
              data-cy="9ffa71dbc54d3521"
              @click="handleClickTransactionItem(recurringItem.transactionId)"
            >
              <!-- Top Row: Date and Status -->
              <div class="mb-1 flex items-center justify-between">
                <span class="text-[#707070]">
                  {{ formatDate(recurringItem.date, 'DD MMM YYYY, HH:mm') }}
                </span>
                <span
                  v-if="recurringItem.next"
                  class="rounded-5 bg-[#FFDB86] px-2 py-1 text-[#554301]"
                >
                  {{ $t('category.payout.next') }}
                </span>
                <OrganizationHubPaymentHistoryListStatus
                  v-else
                  :item="{ status: recurringItem.status }"
                />
              </div>

              <!-- Middle Row: Item Text -->
              <div class="mb-1">
                <span class="text-sm font-bold text-[#f1f1f1]">
                  {{ recurringItem.text }}
                </span>
              </div>

              <!-- Bottom Row: Transaction ID and Net Amount -->
              <div
                v-if="recurringItem.transactionId && recurringItem.incomeDetail"
                class="flex items-center justify-between text-[#565656]"
              >
                <span>
                  {{
                    $t('category.transaction.itemId', {
                      id: recurringItem.transactionId,
                    })
                  }}
                </span>
                <div class="flex items-center">
                  <i class="fa-regular fa-circle-dollar-to-slot mr-1" />
                  <span class="text-[#FAFAFA]">
                    {{ $t('category.transaction.net') }}
                  </span>
                  <div>
                    <OrganizationHubPaymentHistoryDialogCompsAmountTip
                      :money="recurringItem.incomeDetail?.netAmount || 0"
                      :currency="recurringItem.incomeDetail.currency"
                    />
                  </div>
                </div>
              </div>

              <div
                v-else
                class="flex items-center justify-between text-xs opacity-0"
              >
                {{ $t('category.transaction.line') }}
              </div>
            </div>
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
const transactionDetails = ref(null);
const transactionLoading = ref(false);
const course = computed(() => props.item.course);
const courseOwner = computed(() => props.item.recipient?.owner);
const feeIncomeDetail = computed(() => props.item.feeTransaction?.incomeDetail);
const totalInstallment = computed(() => props.item.totalInstallment);
const futureInstallment = computed(() => props.item.futureInstallments.length);
const productInfo = computed(() => props.item.productId);
// calculate by FE
const totalIncomeInfo = computed(() => props.item.totalIncome);
// calculate by FE
const paymentMethods = computed(() => props.item.paymentMethods);
const userName = computed(
  () => props.item.payer.owner?.fullName || props.item.payer.owner.name || '--',
);
const checkStatus = computed(() =>
  mapStatusCanceledToCompleted({
    status: props.item.subscriptionStatus,
  }),
);
const subscriptionInfo = computed(() => {
  const { cycleId } = props.item;
  return productInfo.value.subscriptionInfo[cycleId];
});

const recurringDetails = computed(() => props.item.recurringTransactions);
const feeDetails = computed(() => props.item.feeTransaction);
const progressItems = computed(() =>
  handleProgress({
    feeTransaction: feeDetails.value,
    recurringTransactions: recurringDetails.value,
    futureInstallments: props.item.futureInstallments,
    currentInstallment: props.item.currentInstallment,
    installmentsAmount: props.item.installmentsAmount,
    lastInstallmentAmount: props.item.lastInstallmentAmount,
    licencesBought: props.item.licencesBought,
  }),
);

async function handleClickTransactionItem(id) {
  if (!id) {
    return;
  }
  if (transactionLoading.value) {
    return;
  }
  transactionLoading.value = id;
  const res = await hubPaymentStore.getPaymentTransactionDetail(id);
  transactionLoading.value = false;
  hubPaymentStore.addDialogNavHistory({
    dataType: DIALOG_TITLE_TYPES.TRANS_INCOME,
    cacheData: res,
  });
  transactionDetails.value = res;
}

function handleProgress({
  feeTransaction,
  recurringTransactions,
  futureInstallments,
  currentInstallment,
  installmentsAmount,
  lastInstallmentAmount,
  licencesBought,
}) {
  const recurringPayments = [
    ...recurringTransactions.map((item, index) => ({
      id: index + 2,
      transactionId: item.id,
      next: currentInstallment === index,
      status: item.status,
      date: item.dates.startDate,
      text: `Subscription Update #${index + 1}`,
      incomeDetail: item.incomeDetail
        ? {
            currency: item.incomeDetail.currency,
            netAmount: item.incomeDetail.netAmount,
          }
        : null,
      totalAmount: item.totalAmount,
      currency: item.currency,
      paymentCard: item.paymentCard,
    })),
    ...futureInstallments.map((item, index) => ({
      id: index + 2 + recurringTransactions.length,
      next: currentInstallment === index + recurringTransactions.length,
      status: PAYMENT_STATUS.PENDING.text,
      date: item,
      text: `Subscription Update #${index + 2 + recurringTransactions.length}`,
      incomeDetail: null,
      totalAmount: installmentsAmount * licencesBought,
      currency: 'usd',
    })),
  ];
  if (recurringPayments.length) {
    recurringPayments[recurringPayments.length - 1] = {
      ...recurringPayments[recurringPayments.length - 1],
      totalAmount: lastInstallmentAmount * licencesBought,
    };
  }

  const dataArray = [
    {
      id: 1,
      transactionId: feeTransaction.id,
      status: feeTransaction.status,
      date: feeTransaction.dates.startDate,
      text: 'Subscription Fee',
      // null or object
      incomeDetail: feeTransaction.incomeDetail
        ? {
            currency: feeTransaction.incomeDetail.currency,
            netAmount: feeTransaction.incomeDetail.netAmount,
          }
        : null,
      totalAmount: feeTransaction.totalAmount,
      currency: feeTransaction.currency,
      paymentCard: feeTransaction.paymentCard,
    },
    ...recurringPayments,
  ];

  return dataArray;
}
</script>

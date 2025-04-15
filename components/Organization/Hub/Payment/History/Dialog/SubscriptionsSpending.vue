<template>
  <div class="relative overflow-hidden">
    <!-- body -->
    <div class="h-[calc(100vh-12rem)] overflow-auto">
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
      <OrganizationHubPaymentHistoryDialogCompsCourseAndName
        :course="course"
        :course-owner="courseOwner"
        :licenses-bought="item.licencesBought"
        :course-price="props.item.productId.totalAmount"
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
          <OrganizationHubPaymentHistoryListUser :user-item="item.payer" />
        </div>

        <!-- row8 -->
        <div
          class="col-span-8 col-start-1 mb-2 mt-3 px-4 text-xs text-[#565656]"
        >
          {{ $t('category.role.supplier') }}
        </div>

        <!-- row9 -->
        <div class="col-span-8 mb-2 ml-2">
          <OrganizationHubPaymentHistoryListUser :user-item="item.recipient" />
        </div>
      </div>

      <!-- details -->
      <div
        class="mb-2 grid grid-cols-9 bg-[#0C0C0C] px-4 text-sm text-[#d9d9d9]"
      >
        <div class="col-span-8 col-start-1 mb-2 mt-3">
          <i class="fa-thin fa-square-info text-xs" />
          <span class="ml-3 text-base">
            {{ $t('category.details') }}
          </span>
        </div>
        <div class="col-span-9 py-2">
          <div class="flex justify-between">
            <span>
              {{ $t('category.payout.quantity') }}
            </span>
            <span>x{{ item.licencesBought }}</span>
          </div>
        </div>
        <div class="col-span-9 py-2">
          <div class="flex justify-between">
            <span>
              {{ $t('category.amount.unit') }}
            </span>
            <div>
              <OrganizationHubPaymentHistoryDialogCompsAmountTip
                :money="productInfo.totalAmount"
              />
            </div>
          </div>
        </div>
        <div class="col-span-9 py-2">
          <div class="flex justify-between">
            <span>
              {{ $t('category.payout.installment.label') }}
            </span>
            <span>
              {{ props.item.totalInstallment }}
            </span>
          </div>
        </div>
        <div class="col-span-9 py-2">
          <div class="flex justify-between">
            <div>
              {{ $t('category.amount.total') }}
            </div>
            <div>
              <OrganizationHubPaymentHistoryDialogCompsAmountTip
                :money="productInfo.totalAmount * item.licencesBought"
              />
            </div>
          </div>
        </div>
        <div class="col-span-9 h-[1px] bg-white/10" />
        <div class="col-span-9 py-2">
          <div class="flex justify-between">
            <span>
              {{ $t('category.amount.paid') }}
            </span>
            <div>
              <OrganizationHubPaymentHistoryDialogCompsAmountTip
                :money="item.totalPaid"
                :currency="feeDetails.currency"
                :is-bold="true"
              />
            </div>
          </div>
        </div>
        <div class="col-span-9 py-2 pl-3">
          <div class="flex justify-between">
            <div>
              {{ $t('category.payout.installment.single') }}
            </div>
            <div>
              <OrganizationHubPaymentHistoryDialogCompsAmountTip
                :money="props.item.installmentsAmount"
                :is-bold="true"
              />
            </div>
          </div>
        </div>
        <div class="col-span-9 py-2 pl-3">
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
        <div class="col-span-9 py-2">
          <div class="flex justify-between">
            <div>
              {{ $t('category.amount.remaining') }}
            </div>
            <div>
              <OrganizationHubPaymentHistoryDialogCompsAmountTip
                :money="subscriptionInfo.remainingAmount * item.licencesBought"
                :is-bold="true"
              />
            </div>
          </div>
        </div>
      </div>

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
          <div class="w-[11.25rem] text-xs">
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
        <div class="col-span-8 col-start-2 mb-2 mt-7 text-base text-[#FAFAFA]">
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
          <div class="col-span-1 justify-self-center">
            <OrganizationHubPaymentHistoryDialogCompsProgressItem
              :uni-key="recurringItem.transactionId"
              :status="recurringItem.status"
              :completed-steps="recurringIndex + 1"
              :total-steps="progressItems.length + 1"
              line-height="4rem"
            />
          </div>
          <div
            v-loading="transactionLoading === recurringItem.transactionId"
            class="col-span-8 mb-1.5 cursor-pointer rounded-5 p-2 hover:bg-white/5"
            data-cy="e1c20037e2b816bc"
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
            <!-- Middle Row: Recurring Item Text -->
            <div class="mb-1">
              <span class="text-sm font-bold text-[#f1f1f1]">
                {{ recurringItem.text }}
              </span>
            </div>

            <!-- Bottom Row: ID and Total Amount -->
            <div class="flex items-center justify-between">
              <span class="text-xs text-[#707070]">
                <span v-if="recurringItem.transactionId">
                  {{
                    $t('category.payout.id', {
                      id: recurringItem.transactionId,
                    })
                  }}
                </span>
              </span>
              <div class="flex items-center">
                <div>
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="recurringItem.totalAmount"
                    :currency="recurringItem.currency"
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
import { PAYMENT_STATUS, DIALOG_TITLE_TYPES } from '~/constant/payment';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const hubPaymentStore = useHubPaymentStore();

const totalInstallment = computed(() => props.item.totalInstallment);
const transactionLoading = ref(false);
const course = computed(() => props.item.course);
const futureInstallment = computed(() => props.item.futureInstallments.length);
const courseOwner = computed(() => props.item.recipient?.owner);
const productInfo = computed(() => props.item.productId);
const paymentMethods = computed(() => props.item.paymentMethods);
const userName = computed(
  () => props.item.payer.owner?.fullName || props.item.payer.owner.name || '--',
);
const subscriptionInfo = computed(() => {
  const { cycleId } = props.item;
  return productInfo.value.subscriptionInfo[cycleId];
});

const checkStatus = computed(() =>
  mapStatusCanceledToCompleted({
    status: props.item.subscriptionStatus,
  }),
);
const recurringDetails = computed(() => props.item.recurringTransactions);
const feeDetails = computed(() => props.item.feeTransaction);
const progressItems = computed(() =>
  handleProgress({
    feeTransaction: feeDetails.value,
    recurringTransactions: recurringDetails.value,
    futureInstallments: props.item.futureInstallments,
    currentInstallment: props.item.currentInstallment,
    installmentsAmount: props.item.installmentsAmount,
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
  hubPaymentStore.addDialogNavHistory({
    dataType: DIALOG_TITLE_TYPES.TRANS_SPENDING,
    cacheData: res,
  });
  transactionLoading.value = false;
}

function handleProgress({
  feeTransaction,
  recurringTransactions,
  futureInstallments,
  currentInstallment,
  installmentsAmount,
  licencesBought,
}) {
  const dataArray = [
    {
      id: 1,
      transactionId: feeTransaction.id,
      status: feeTransaction.status,
      date: feeTransaction.dates.endDate,
      text: 'Subscription Fee',
      totalAmount: feeTransaction.totalAmount,
      currency: feeTransaction.currency,
      paymentCard: feeTransaction.paymentCard,
    },
    ...recurringTransactions.map((item, index) => ({
      id: index + 2,
      transactionId: item.id,
      next: currentInstallment === index,
      status: item.status,
      date: item.dates.endDate,
      text: `Subscription Update #${index + 1}`,
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

  return dataArray;
}
</script>

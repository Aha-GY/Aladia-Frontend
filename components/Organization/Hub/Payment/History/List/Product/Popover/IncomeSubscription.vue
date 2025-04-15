<template>
  <div class="grid grid-cols-2 gap-1 p-3 text-xs text-[#707070]">
    <div>Q.ty</div>
    <div class="text-right underline">{{ `× ${licencesBought}` }}</div>

    <div>Subscription Fee</div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.feeTransaction.amount * licencesBought) }}
      </div>
    </div>

    <div>{{ $t('category.payout.installment.amount') }}</div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.installmentsAmount * licencesBought) }}
      </div>
    </div>

    <div>Installments Number</div>
    <div class="flex items-center justify-end text-xs">
      <div class="ml-1">
        {{ item.totalInstallment }}
      </div>
    </div>

    <div>Amount</div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(produceId.totalAmount * licencesBought) }}
      </div>
    </div>

    <div class="text-[#d9d9d9]">Paid Amount</div>
    <div class="flex items-center justify-end text-xs text-[#d9d9d9]">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.totalPaid) }}
      </div>
    </div>

    <div>Exchanged Rate</div>
    <div v-if="!feeIncomeDetail" class="flex items-center justify-end">---</div>
    <div v-else class="flex items-center justify-end">
      <div class="flex items-center">
        <BaseIconCurrency :currency="courseCurrency" />
        <span>1.00</span>
      </div>
      <span>-></span>
      <div class="flex items-center">
        <BaseIconCurrency :currency="feeIncomeDetail.currency" />
        <span>{{ feeIncomeDetail.exchangeRate }}</span>
      </div>
    </div>

    <div class="text-[#D9D9D9]">{{ $t('category.exchange.amount') }}</div>
    <div v-if="!incomeDetail" class="flex items-center justify-end">---</div>
    <div v-else class="flex items-center justify-end text-[#D4D4D4]">
      <BaseIconCurrency :currency="incomeCurrency" />
      <div class="ml-1">
        {{ moneyFormat(incomeDetail.totalTransAmount) }}
      </div>
    </div>

    <div>{{ $t('category.fee.application') }}</div>
    <div v-if="!incomeDetail" class="flex items-center justify-end">---</div>
    <div v-else class="flex items-center justify-end">
      <BaseIconCurrency :currency="incomeCurrency" />
      <div class="ml-1">
        {{ moneyFormat(0 - incomeDetail.applicationFee) }}
      </div>
    </div>

    <div>{{ $t('category.fee.stripe') }}</div>
    <div v-if="!incomeDetail" class="flex items-center justify-end">---</div>
    <div v-else class="flex items-center justify-end">
      <BaseIconCurrency :currency="incomeCurrency" />
      <div class="ml-1">
        {{ moneyFormat(0 - incomeDetail.stripeFee) }}
      </div>
    </div>

    <div class="text-[#D9D9D9]">{{ $t('category.fee.total') }}</div>
    <div v-if="!incomeDetail" class="flex items-center justify-end">---</div>
    <div v-else class="flex items-center justify-end text-[#D4D4D4]">
      <BaseIconCurrency :currency="incomeCurrency" />
      <div class="ml-1">
        {{ moneyFormat(0 - incomeDetail.totalFee) }}
      </div>
    </div>

    <div class="text-[#D9D9D9]">{{ $t('category.amount.net') }}</div>
    <div v-if="!incomeDetail" class="flex items-center justify-end">---</div>
    <div v-else class="flex items-center justify-end text-[#D4D4D4]">
      <BaseIconCurrency :currency="incomeCurrency" />
      <div class="ml-1">
        {{ moneyFormat(incomeDetail.totalNet) }}
      </div>
    </div>
  </div>

  <div class="mt-4 p-3">
    <div class="flex justify-end">
      <span class="mr-1 text-[#707070]">Subscription starts on</span>
      <span>
        {{ ` ${formatDate(produceId.dates?.startDate, 'DD/MM/YYYY')}` }}
      </span>
    </div>

    <div class="flex justify-end">
      <span class="mr-1 text-[#707070]">Subscription ends on</span>
      <span>
        {{ ` ${formatDate(produceId.dates?.endDate, 'DD/MM/YYYY')}` }}
      </span>
    </div>
  </div>

  <div class="flex justify-end p-2">
    <div
      class="items-center rounded-md border border-[#D4D4D4] px-3 py-1 text-xs text-[#D4D4D4]"
    >
      <i class="fa-regular fa-badge-check mr-1.5" />
      <span>
        {{
          `${item.currentInstallment} / ${item.totalInstallment} ${$t('filter.received.installment')}`
        }}
      </span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const courseCurrency = ref(props.item.currency);
const licencesBought = computed(() => props.item.licencesBought);
const produceId = computed(() => props.item.productId);
const feeIncomeDetail = computed(() => props.item.feeTransaction?.incomeDetail);
const incomeCurrency = computed(() => feeIncomeDetail.value?.currency);
const incomeDetail = computed(() => props.item.totalIncome);
</script>

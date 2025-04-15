<template>
  <div class="grid grid-cols-2 gap-1 p-3 text-xs text-[#707070]">
    <div>Q.ty</div>
    <div class="text-right underline">{{ `× ${item.licencesBought}` }}</div>

    <div>Unit Subscription Fee</div>
    <div class="flex items-center justify-end">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.amount) }}
      </div>
    </div>

    <div>Amount Subscription Fee</div>
    <div class="flex items-center justify-end">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.totalAmount) }}
      </div>
    </div>

    <div>Exchanged Rate</div>
    <div v-if="!incomeDetail" class="flex items-center justify-end">---</div>
    <div v-else class="flex items-center justify-end">
      <div class="flex items-center">
        <BaseIconCurrency :currency="item.courseCurrency" />
        <span>1.00</span>
      </div>
      <span>-></span>
      <div class="flex items-center">
        <BaseIconCurrency :currency="incomeCurrency" />
        <span>{{ incomeDetail.exchangeRate }}</span>
      </div>
    </div>

    <div class="text-[#D9D9D9]">
      {{ $t('category.exchange.amount') }}
    </div>
    <div v-if="!incomeDetail" class="flex items-center justify-end">---</div>
    <div v-else class="flex items-center justify-end text-[#D4D4D4]">
      <BaseIconCurrency :currency="incomeCurrency" />
      <div class="ml-1">
        {{ moneyFormat(incomeDetail.totalAmount) }}
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
        {{ moneyFormat(incomeDetail.netAmount) }}
      </div>
    </div>
  </div>
  <div class="flex justify-end p-1.5">
    <div
      class="text=[#D4D4D4] items-center rounded-md border border-[#D4D4D4] px-3 py-1 text-xs"
    >
      <i class="fa-regular fa-badge-check mr-1.5" />
      <span>
        {{ $t('filter.received.fee.subscription') }}
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
const courseCurrency = computed(() => props.item.currency);
const incomeDetail = computed(() => props.item.incomeDetail);
const incomeCurrency = computed(() => incomeDetail.value.currency);
</script>

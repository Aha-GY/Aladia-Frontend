<template>
  <div class="grid grid-cols-2 gap-1 p-3 text-xs text-[#707070]">
    <div>{{ $t('filter.qty') }}</div>
    <div class="text-right underline">{{ `× ${licencesBought}` }}</div>

    <div>
      {{ $t('space.columns.elements.subscription.fee') }}
    </div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(subscriptionInfo.fee.amount) }}
      </div>
    </div>

    <div class="text-[#d9d9d9]">
      {{ $t('category.fee.subscription') }}
    </div>
    <div class="flex items-center justify-end text-xs text-[#d9d9d9]">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(subscriptionInfo.fee.amount * licencesBought) }}
      </div>
    </div>

    <div>{{ $t('category.payout.installment.amount') }}</div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.installmentsAmount) }}
      </div>
    </div>

    <div>
      {{ $t('category.payout.installment.number') }}
    </div>
    <div class="mb-1 flex items-center justify-end text-xs">
      <div class="ml-1">{{ item.totalInstallment }}</div>
    </div>

    <div class="text-[#d9d9d9]">
      {{ $t('category.payout.installment.label') }}
    </div>
    <div class="flex items-center justify-end text-xs text-[#d9d9d9]">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{
          moneyFormat(
            subscriptionInfo.installments.amount *
              licencesBought *
              item.totalInstallment,
          )
        }}
      </div>
    </div>

    <div>
      {{ $t('category.amount.label') }}
    </div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(productInfo.totalAmount * licencesBought) }}
      </div>
    </div>

    <div class="text-[#d9d9d9]">{{ $t('category.amount.label') }}</div>
    <div class="flex items-center justify-end text-xs text-[#d9d9d9]">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ $t('category.amount.missing') }}
        <!-- {{ moneyFormat(item.totalPaid) }} -->
      </div>
    </div>
  </div>

  <div class="mt-4 p-3">
    <div class="flex justify-end">
      <span class="mr-1 text-[#707070]">
        {{ $t('category.subscription.start') }}
      </span>
      <span>
        {{ ` ${formatDate(productInfo.dates?.startDate, 'DD/MM/YYYY')}` }}
      </span>
    </div>

    <div class="flex justify-end">
      <span class="mr-1 text-[#707070]">
        {{ $t('category.subscription.end') }}
      </span>
      <span>
        {{ ` ${formatDate(productInfo.dates?.endDate, 'DD/MM/YYYY')}` }}
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
          `${item.currentInstallment} / ${item.totalInstallment} ${$t('nav.header.notificationKey.payments.transactions.installment')}`
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
const courseCurrency = ref('usd');
const licencesBought = computed(() => props.item.licencesBought);
const productInfo = computed(() => props.item.productId);

const subscriptionInfo = computed(() => {
  const { cycleId } = props.item;
  return productInfo.value.subscriptionInfo[cycleId];
});
</script>

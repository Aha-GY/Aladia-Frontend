<template>
  <div class="grid grid-cols-2 gap-1 p-3 text-xs text-[#707070]">
    <div>{{ $t('filter.qty') }}</div>
    <div class="text-right underline">{{ `× ${item.licencesBought}` }}</div>

    <div>
      {{ $t('category.payout.subscription') }}
    </div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.unitAmount) }}
      </div>
    </div>

    <div>{{ $t('category.fee.subscription') }}</div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.amount) }}
      </div>
    </div>

    <div>{{ $t('category.payout.installment.amount') }}</div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="subscriptionInfo.currency" />
      <div class="ml-1">
        {{ moneyFormat(subscriptionInfo.amount) }}
      </div>
    </div>

    <div class="text-[#D9D9D9]">
      {{ $t('category.amount.total') }}
    </div>
    <div class="flex items-center justify-end text-xs text-[#D9D9D9]">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.amount) }}
      </div>
    </div>
  </div>

  <div class="flex justify-end p-1.5">
    <div
      class="items-center rounded-md border border-[#D4D4D4] px-3 py-1 text-xs text-[#D4D4D4]"
    >
      <i class="fa-regular fa-badge-check mr-1.5" />
      <span>
        {{ $t('nav.header.notification.payments.subscription.feePaid') }}
      </span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  item: Object,
});
const courseCurrency = ref(props.item.currency);
const subscriptionInfo = ref(props.item.subscription);
</script>

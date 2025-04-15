<template>
  <div class="grid grid-cols-2 gap-1 p-3 text-xs text-[#707070]">
    <div>Q.ty</div>
    <div class="text-right underline">{{ `× ${item.licencesBought}` }}</div>

    <div>{{ $t('category.payout.installment.amount') }}</div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.unitAmount) }}
      </div>
    </div>

    <div>
      {{ $t('category.installment.title') }}
    </div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="courseCurrency" />
      <div class="ml-1">
        {{ moneyFormat(item.amount) }}
      </div>
    </div>

    <div>
      {{ $t('category.amount.subscription') }}
    </div>
    <div class="flex items-center justify-end text-xs">
      <BaseIconCurrency :currency="subscriptionInfo.currency" />
      <div class="ml-1">
        {{ moneyFormat(subscriptionInfo.amount) }}
      </div>
    </div>
  </div>

  <div class="mt-4 flex justify-end p-3">
    <span class="mr-1 text-[#707070]">
      {{ $t('category.subscription.end') }}
    </span>
    <span>
      {{ ` ${formatDate(dates?.endDate, 'DD/MM/YYYY')}` }}
    </span>
  </div>

  <div class="flex justify-end p-1.5">
    <div
      class="items-center rounded-md border border-[#D4D4D4] px-3 py-1 text-xs text-[#D4D4D4]"
    >
      <i class="fa-regular fa-badge-check mr-1.5" />
      <span>
        {{ $t('nav.header.notificationKey.payments.transactions.installment') }}
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
const dates = ref(props.item.dates);
</script>

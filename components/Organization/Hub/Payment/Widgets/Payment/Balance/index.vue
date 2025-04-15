<template>
  <!-- pc -->
  <div v-if="!$device.isMobile" class="flex flex-grow justify-between">
    <!-- 左侧饼图 -->
    <div class="relative h-full w-[17rem]">
      <OrganizationHubPaymentWidgetsChart
        :data="data"
        :color="color"
        :currency="currency"
        :index="hoverIndex"
        left
      />
      <OrganizationHubPaymentWidgetsChartText
        :data="total"
        :currency="currency"
        :label="$t('filter.balance.details')"
      />
    </div>

    <!-- 右侧项目列表 -->
    <div class="h-full w-[24rem]">
      <!-- <OrganizationHubPaymentWidgetsPaymentBalanceStripe /> -->
      <OrganizationHubPaymentWidgetsPaymentBalanceStripeNew />
    </div>
  </div>
</template>

<script setup>
import { STRIPE_COUNTRIES } from '~/constant/countries';

const hubPaymentStore = useHubPaymentStore();

const color = ref(['#E4B53D', '#D65F20', '#6C5B7F']);
const hoverIndex = ref(null);
const balanceDatas = computed(() => hubPaymentStore.balanceDatas);
const total = computed(() => balanceDatas.value?.total || 0);
const currency = computed(() => {
  const currencyItem = getCountryItemByCurrency(
    balanceDatas.value?.currency || 'usd',
    STRIPE_COUNTRIES,
  );
  return currencyItem.currency_symbol;
});

const data = computed(() => [
  // { value: balanceDatas.value?.total || 0, name: 'Total Balance' },
  { value: balanceDatas.value?.availableSoon || 0, name: 'Available soon' },
  { value: balanceDatas.value?.available || 0, name: 'Available to pay out' },
  { value: balanceDatas.value?.inTransit || 0, name: 'In transit to bank' },
]);

// const enter = (index) => {
//   hoverIndex.value = index;
// };
</script>

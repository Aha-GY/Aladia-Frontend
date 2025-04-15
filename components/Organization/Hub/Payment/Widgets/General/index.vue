<template>
  <div
    class="flex h-[15.3125rem] items-center justify-between gap-4 rounded-md bg-black/60 p-4"
  >
    <!-- 左侧chart -->
    <OrganizationHubPaymentWidgetsGeneralBar />
    <!-- 右侧三个饼图 -->
    <div class="flex h-full items-center gap-4">
      <OrganizationHubPaymentWidgetsGeneralItem
        title="org.hub.payment.balance.total"
        :number="balanceTotal"
        :currency="balanceCurrency"
        ratio="--"
        icon-class="fa-scale-balanced text-[#707070]"
        label="$t:org.hub.payment.view.details"
        :data="balanceData"
        :color="balanceColor"
        @change="hubPaymentStore.index = 3"
      />
      <div class="h-full w-[1px] scale-x-50 bg-[#D9D9D9]" />
      <OrganizationHubPaymentWidgetsGeneralItem
        title="org.hub.payment.spending"
        :number="spedingTotal"
        :ratio="spendingRatio"
        icon-class="fa-arrow-up text-[#DA4242]"
        label="$t:org.hub.payment.view.transactions"
        :data="spendingData"
        :color="spendingColor"
        @change="hubPaymentStore.index = 1"
      />
      <div class="h-full w-[1px] scale-x-50 bg-[#D9D9D9]" />
      <OrganizationHubPaymentWidgetsGeneralItem
        title="org.hub.payment.income"
        :number="incomeTotal"
        :ratio="incomeRatio"
        icon-class="fa-arrow-down text-[#88C359]"
        label="$t:org.hub.payment.view.transactions"
        :data="incomeData"
        :color="incomeColor"
        @change="hubPaymentStore.index = 2"
      />
    </div>
  </div>
</template>

<script setup>
import { STRIPE_COUNTRIES } from '~/constant/countries';

const hubPaymentStore = useHubPaymentStore();

const balanceDatas = computed(() => hubPaymentStore.balanceDatas);
const balanceCurrency = computed(() => {
  const currencyItem = getCountryItemByCurrency(
    balanceDatas.value?.currency || 'usd',
    STRIPE_COUNTRIES,
  );
  return currencyItem.currency_symbol;
});
const spedingTotal = computed(() => hubPaymentStore.spendingDatas?.total || 0);
const spendingData = computed(() => {
  if (hubPaymentStore.spendingDatas) {
    return Object.values(hubPaymentStore.spendingDatas.categories);
  }
  return [30, 50, 20];
});
const incomeTotal = computed(() => hubPaymentStore.incomeDatas?.total || 0);
const incomeData = computed(() => {
  if (hubPaymentStore.incomeDatas) {
    return Object.values(hubPaymentStore.incomeDatas.categories).map(
      (item) => item.total,
    );
  }
  return [30, 50, 20, 40];
});
const balanceTotal = computed(() => hubPaymentStore.balanceDatas?.total || 0);
const balanceData = computed(() => {
  if (hubPaymentStore.balanceDatas) {
    return [
      hubPaymentStore.balanceDatas.availableSoon,
      hubPaymentStore.balanceDatas.available,
      hubPaymentStore.balanceDatas.inTransit,
    ];
  }
  return [20, 50, 30];
});
const spendingRatio = computed(
  () => hubPaymentStore.spendingDatas?.increase || '--',
);
const incomeRatio = computed(
  () => hubPaymentStore.incomeDatas?.increase || '--',
);

const spendingColor = ref(['#DE034B', '#FD6C69', '#FF7A00', '#E4B53D']);
const incomeColor = ref([
  '#598C32',
  '#02826B',
  '#E4B53D',
  '#FC7672',
  '#FFC5B8',
]);
const balanceColor = ref(['#E4B53D', '#D65F20', '#3D8DAE', '#6C5B7F']);
</script>
<style scoped>
:deep(.el-loading-mask) {
  background-color: transparent;
}

:deep(.el-loading-spinner .circular circle) {
  stroke: white;
}
</style>

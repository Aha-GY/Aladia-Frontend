<template>
  <div
    class="flex h-[15.3125rem] gap-4 overflow-hidden rounded-md bg-black/60 py-4 pr-4"
  >
    <div class="relative h-full w-[20.25rem] shrink-0">
      <OrganizationHubPaymentWidgetsChart
        :data="data"
        :color="color"
        :index="hoverIndex"
      />
      <OrganizationHubPaymentWidgetsChartText
        :data="total"
        :label="$t('filter.amount.earning')"
      />
      <div
        v-if="open"
        class="absolute left-5 top-0 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-black/60 shadow-[0_4px_4px_rgba(0,0,0,0.4)] transition-all hover:bg-white/5"
        data-cy="167bfcdc70e4073a"
        @click="onBack"
      >
        <i class="fa-light fa-chevron-left" />
      </div>
    </div>

    <OrganizationHubPaymentWidgetsIncomeLegend
      :data="data"
      :color="color"
      @enter="enter"
      @leave="hoverIndex = null"
      @change="change"
    />
    <div class="h-full w-[1px] scale-x-50 bg-[#D9D9D9]" />
    <OrganizationHubPaymentWidgetsIncomeList />
  </div>
</template>

<script setup>
const hubPaymentStore = useHubPaymentStore();
const color = ref(['#02826B', '#88C359', '#E1AF00', '#FC7672', '#EC9F8E']);
const hoverIndex = ref(null);
const open = ref(false);
const incomeData = computed(() => hubPaymentStore.incomeDatas);
const data = computed(() => [
  {
    value: incomeData.value?.categories.live.total || 0,
    name: 'filter.courses.onLive',
  },
  {
    value: incomeData.value?.categories.onDemand.total || 0,
    name: 'filter.courses.onDemand',
  },
]);
const total = computed(
  () =>
    parseInt(data.value.reduce((acc, cur) => acc + cur.value, 0) * 100) / 100,
);

const enter = (index) => {
  hoverIndex.value = index;
};

const change = (index) => {
  if (index === 1) {
    open.value = true;
    data.value = [
      { value: 534, name: 'Interior Design & Architecture' },
      { value: 323.7, name: 'Commuication Business' },
      { value: 223, name: 'The Sports Nutrition ' },
      { value: 213.2, name: 'Zero To Hero In Data Science' },
      { value: 104.7, name: 'Internet Security Essentials' },
    ];
  }
};

const onBack = () => {
  open.value = false;
  data.value = [
    { value: 223.7, name: 'On live courses' },
    { value: 423.2, name: 'On demand courses' },
  ];
};
</script>

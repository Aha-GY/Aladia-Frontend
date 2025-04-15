<template>
  <div
    class="flex h-[15.3125rem] gap-4 overflow-hidden rounded-md bg-black/60 py-4 pr-4"
  >
    <!-- 左侧圈图 -->
    <div class="relative h-full w-[20.25rem] shrink-0">
      <OrganizationHubPaymentWidgetsChart
        :data="data"
        :color="color"
        :index="hoverIndex"
      />
      <OrganizationHubPaymentWidgetsChartText
        :data="total"
        :label="$t('filter.general.spending.label')"
      />
    </div>

    <!-- 圈图数据列表 -->
    <OrganizationHubPaymentWidgetsSpendingLegend
      :data="data"
      :color="color"
      @enter="enter"
      @leave="hoverIndex = null"
    />

    <div class="h-full w-[1px] scale-x-50 bg-[#D9D9D9]" />

    <OrganizationHubPaymentWidgetsSpendingFutureList />
  </div>
</template>

<script setup>
const hubPaymentStore = useHubPaymentStore();
const color = ref(['#DE034B', '#FD6C69', '#FF7A00', '#E4B53D']);
const hoverIndex = ref(null);
const spendingData = computed(() => hubPaymentStore.spendingDatas);

const data = computed(() => [
  { value: spendingData.value?.categories.courses || 0, name: 'Courses' },
  { value: spendingData.value?.categories.tokens || 0, name: 'AI' },
  { value: spendingData.value?.categories.storage || 0, name: 'Storage' },
  { value: spendingData.value?.categories.streaming || 0, name: 'Streaming' },
]);
const total = computed(
  () =>
    parseInt(data.value.reduce((acc, cur) => acc + cur.value, 0) * 100) / 100,
);

const enter = (index) => {
  hoverIndex.value = index;
};
</script>

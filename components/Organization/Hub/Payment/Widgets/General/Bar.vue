<template>
  <div class="relative z-10 h-full flex-1 flex-shrink-0 overflow-hidden">
    <div class="absolute left-0 top-0 z-10 flex items-center gap-2">
      <OrganizationHubPaymentWidgetsGeneralDatePicker />
    </div>
    <VChart ref="chartRef" :option="option" :autoresize="true" />
  </div>
</template>

<script setup>
import { LineChart, BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import VChart, { THEME_KEY } from 'vue-echarts';

import { PAYMENT_TIMELINE_BAR_OPTIONS } from '~/constant/chartOpts';

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
]);

provide(THEME_KEY, 'dark');

const hubPaymentStore = useHubPaymentStore();
const chartRef = ref(null);
const timeLineData = computed(() => hubPaymentStore.timeLineDatas);
// const dateName = computed(() => {
//   if (startDate.value) {
//     return `${formatDate(startDate.value, 'MMMM YYYY')}`;
//   }
//   return '';
// });
const option = PAYMENT_TIMELINE_BAR_OPTIONS;

watch(
  timeLineData,
  (val) => {
    handleChartDatas(val);
  },
  { immediate: true },
);

function handleChartDatas(data) {
  const newOption = {
    xAxis: {
      data: data.map((dataItem) => dataItem.date.match(/\d{2}-\d{2}$/)[0]),
    },
    series: [
      {
        data: data.map((dataItem) => dataItem.income),
      },
      {
        data: data.map((dataItem) => dataItem.spending),
      },
    ],
  };

  chartRef.value?.setOption(newOption);
}
</script>
<style scoped>
:deep(#chart .echarts-legend) {
  white-space: pre-wrap;
}

:deep(#chart .echarts-legend span) {
  padding: 5px 0;
  display: block;
}
</style>

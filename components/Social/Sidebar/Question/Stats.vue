<template>
  <div class="relative z-10 h-[11rem] px-4">
    <div
      class="bg-gradient-top absolute bottom-10 left-1/2 h-[1px] w-3/4 -translate-x-1/2"
    />
    <VChart ref="chart" :option="option" class="h-[11rem]" :autoresize="true" />
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
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import VChart, { THEME_KEY } from 'vue-echarts';

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
]);

provide(THEME_KEY, 'dark');

const chart = ref(null);

const option = computed(() => ({
  backgroundColor: '',
  color: ['#FF6B00', '#ffffff'],
  title: {
    text: 'Stats',
  },
  grid: {
    top: 30,
    bottom: 45,
  },
  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    trigger: 'axis',
    formatter: (params) => {
      let res = '';
      for (let i = 0; i < params.length; i++) {
        if (params[i].data !== undefined) {
          res +=
            `<div>` +
            `<span class="mr-3">${params[i].marker}</span>${
              params[i].data
            }</div>`;
        }
      }
      return res;
    },
    textStyle: {
      color: '#fff',
      fontWeight: '600',
    },
    borderColor: '#565656',
    padding: [4, 8],
  },
  xAxis: {
    type: 'category',
    data: ['Contribution', 'Question' + '\n' + 'Posted'],
    offset: 5,
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#fff',
    },
  },
  yAxis: { type: 'value', show: false },
  legend: {
    right: 0,
    itemWidth: 16,
    itemHeight: 8,
    formatter: (name) => {
      let val = '';
      const len = name.split(' ').length;
      name.split(' ').map((r, index) => {
        const str = len - index > 1 ? '\n' : '';
        val += r + str;
      });
      return val;
    },
  },
  series: [
    {
      name: 'You',
      type: 'bar',
      data: [12, 6],
      barWidth: 16,
      itemStyle: {
        borderRadius: 3,
      },
    },
    {
      name: 'Community Average',
      type: 'bar',
      data: [34, 16],
      barWidth: 16,
      itemStyle: {
        borderRadius: 3,
      },
    },
  ],
}));

function handleResize() {
  if (chart.value) {
    chart.value.resize();
  }
}

onMounted(() => {
  setTimeout(() => handleResize(), 1000);
});
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

<template>
  <VChart
    ref="chart"
    :option="option"
    :autoresize="true"
    class="h-full w-full"
  />
</template>

<script setup>
import { PieChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  VisualMapComponent,
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import VChart, { THEME_KEY } from 'vue-echarts';

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  VisualMapComponent,
]);

provide(THEME_KEY, 'dark');
const chart = ref(null);

const option = computed(() => ({
  backgroundColor: '',
  grid: {
    x: '8%',
    y: '4%',
    width: '85%',
    height: '85%',
  },
  tooltip: {
    show: true,
    trigger: 'item',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textStyle: {
      color: '#fff',
    },
    borderColor: '#333',
    borderWidth: 1,
    padding: 10,
    formatter() {
      return `
        <div class="text-xs w-40">
          <div class="flex items-center justify-between mb-2">
            <div class="text-white/50 flex items-center gap-1">
              <i class="fa-light fa-clock"></i>
              ${this.$t('org.dashboard.time.activity')}
            </div>
            <div>1 hr</div>
          </div>
          <div class="flex items-center justify-between mb-2">
            <div class="text-white/50 flex items-center gap-1">
              <i class="fa-light fa-clock"></i>
              ${this.$t('org.dashboard.time.range')}
            </div>
            <div>9:30 - 12:3</div>
          </div>
          <div class="flex items-center gap-1">
            <img src="/logo/image.png" class="w-7 h-5 object-cover rounded-sm" />
            Bootstrap Library 5.0
          </div>
        </div>
        `;
    },
  },
  xAxis: {
    type: 'category',
    data: [
      'MON\n24/09',
      'TUE\n25/09',
      'WED\n26/09',
      'THU\n27/09',
      'FRI\n28/09',
      'SAT\n29/09',
      'SUN\n30/09',
    ],
    axisLabel: {
      interval: 0,
      color: '#fff',
      formatter(value) {
        return value.split('\n').join('\n');
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#333',
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#fff',
      formatter: '{value}hr',
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#333',
      },
    },
  },
  series: [
    {
      name: 'Category1',
      type: 'bar',
      data: [5, 3, 4, 7, 2, 5, 6],
      itemStyle: {
        color: '#8d4bf6',
        borderRadius: [10, 10, 0, 0],
      },
    },
    {
      name: 'Category2',
      type: 'bar',
      data: [2, 5, 3, 2, 8, 1, 4],
      itemStyle: {
        color: '#9bd4bd',
        borderRadius: [10, 10, 0, 0],
      },
    },
    {
      name: 'Category3',
      type: 'bar',
      data: [6, 1, 5, 3, 4, 7, 2],
      itemStyle: {
        color: '#e28986',
        borderRadius: [10, 10, 0, 0],
      },
    },
  ],
}));
</script>

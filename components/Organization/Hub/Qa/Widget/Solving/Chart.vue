<template>
  <VChart ref="chart" :option="option" :autoresize="true" class="h-16 w-full" />
</template>

<script setup>
import { LineChart } from 'echarts/charts';
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
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
]);

provide(THEME_KEY, 'dark');

const chart = ref(null);
const hubQaStore = useHubQaStore();

const option = computed(() => {
  const solvingRate = hubQaStore.solving.solvingRate;

  const xAxisData = solvingRate.length
    ? solvingRate.map((item) => item.date)
    : Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  const seriesData = solvingRate.length
    ? solvingRate.map((item) => item.rate)
    : Array.from({ length: 31 }, () => 0);

  return {
    backgroundColor: '',
    color: '#95c167',
    grid: {
      left: '0%',
      right: '3%',
      top: '10%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        data: seriesData,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 4,
        },
        animationDelay(dataIndex) {
          return dataIndex * 100;
        },
        markPoint: {
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {
            color: '#fff',
            borderColor: '#95c167',
            borderWidth: 2,
          },
          data: [
            {
              coord: [
                xAxisData[xAxisData.length - 1],
                seriesData[seriesData.length - 1],
              ],
              symbol: 'circle',
              symbolSize: 10,
              itemStyle: {
                color: '#fff',
                borderColor: '#95c167',
                borderWidth: 2,
              },
            },
          ],
          animation: true,
          animationDuration: 300,
          animationDelay: 900,
        },
      },
    ],
    animationEasing: 'linear',
  };
});
</script>

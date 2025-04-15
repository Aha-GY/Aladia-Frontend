<template>
  <VChart ref="chart" :option="option" :autoresize="true" class="h-60 w-full" />
</template>

<script setup>
import { graphic } from 'echarts';
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
const { width } = useWindowSize();
const hubSpaces = useHubSpacesStore();
const storage = computed(() => hubSpaces.statistics.storage);
const streaming = computed(() => hubSpaces.statistics.streaming);
const ai = computed(() => hubSpaces.statistics.ai);

const option = computed(() => {
  // 计算每个系列的最大值
  const storageMax = Math.max(
    ...storage.value.timeline.map((date) => date.storageUsed),
  );
  const streamingMax = Math.max(
    ...streaming.value.timeline.map((date) => date.minutes),
  );
  const aiMax = Math.max(...ai.value.timeline.map((date) => date.tokens));

  const xAxisData = storage.value.timeline.map(
    (item) => item.date.match(/\d{2}-\d{2}$/)[0],
  );

  return {
    backgroundColor: '',
    color: ['#39816d', '#6f147e', '#eacb5b'],
    grid: {
      y: xAxisData.length <= 2 ? '-10rem' : '0%',
      left: '-20rem',
      right: '-36rem',
      height: '100%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        showMinLabel: true,
        showMaxLabel: true,
        margin: 0,
        formatter: (value, index) => {
          if (xAxisData.length === 1) {
            return `{center|${value}}`;
          }
          if (index === 0) {
            return `{left|${value}}`;
          }
          if (index === xAxisData.length - 1) {
            return `{right|${value}}`;
          }
          return '';
        },
        rich: {
          center: {
            align: 'center',
            padding: [10, 0, 0, 0],
          },
          left: {
            align: 'left',
            padding: [10, 0, 0, 32],
          },
          right: {
            align: 'right',
            padding: [10, 32, 0, 0],
          },
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#666',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        show: false,
        splitLine: {
          show: false,
        },
        max: Math.ceil(storageMax * 1.2), // 将最大值增加20%
      },
      {
        type: 'value',
        show: false,
        splitLine: {
          show: false,
        },
        max: Math.ceil(streamingMax * 1.2),
      },
      {
        type: 'value',
        show: false,
        splitLine: {
          show: false,
        },
        max: Math.ceil(aiMax * 1.2),
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.6)',
      textStyle: {
        color: '#fff',
        fontWeight: '600',
      },
      borderColor: '#565656',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#565656',
        },
      },
    },
    series: [
      {
        name: 'Storage',
        type: 'line',
        yAxisIndex: 0,
        data: storage.value.timeline.map((date) => date.storageUsed),
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#39816d',
            },
            {
              offset: 1,
              color: 'rgba(39,93,79,0)',
            },
          ]),
        },
        showSymbol: false,
      },
      {
        name: 'Streaming',
        type: 'line',
        yAxisIndex: 1,
        data: streaming.value.timeline.map((date) => date.minutes),
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#6f147e',
            },
            {
              offset: 1,
              color: 'rgba(39,93,79,0)',
            },
          ]),
        },
        showSymbol: false,
      },
      {
        name: 'Artificial Intelligence',
        type: 'line',
        yAxisIndex: 2,
        data: ai.value.timeline.map((date) => date.tokens),
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#eacb5b',
            },
            {
              offset: 1,
              color: 'rgba(39,93,79,0)',
            },
          ]),
        },
        showSymbol: false,
      },
    ],
  };
});

watch(width, () => {
  chart.value?.resize();
});
</script>

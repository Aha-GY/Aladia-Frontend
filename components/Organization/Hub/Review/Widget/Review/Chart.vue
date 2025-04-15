<template>
  <client-only>
    <VChart
      ref="chart"
      :option="option"
      :autoresize="true"
      class="h-full w-full"
    />
  </client-only>
</template>

<script setup>
import { PieChart } from 'echarts/charts';
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

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  index: {
    type: Number,
    default: null,
  },
});

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
  VisualMapComponent,
]);

provide(THEME_KEY, 'dark');

const hubReviewStore = useHubReviewStore();
const chart = ref(null);

watch(
  () => props.index,
  (value) => {
    if (hubReviewStore.reviewType !== 'Total') {
      return;
    }
    if (value !== null) {
      chart.value.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: value,
        dataIndex: 0,
      });
    } else {
      chart.value.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
      });
      chart.value.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 1,
      });
    }
  },
);
watch(
  () => hubReviewStore.reviewType,
  (value) => {
    if (value === 'Positive') {
      chart.value.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 0,
      });
    } else if (value === 'Negative') {
      chart.value.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 1,
        dataIndex: 0,
      });
    } else {
      chart.value.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
      });
      chart.value.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 1,
      });
    }
  },
);

const option = computed(() => ({
  backgroundColor: '',
  grid: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  series: [
    {
      name: 'Positive',
      type: 'pie',
      radius: ['80%', '95%'],
      startAngle: 0,
      endAngle: 90,
      itemStyle: {
        borderRadius: [0, 5],
      },
      emptyCircleStyle: {
        color: 'rgba(255, 255, 255, 0.06)',
      },
      emphasis: {
        focus: 'series',
        blurScope: 'global',
      },
      label: {
        show: false,
      },
      data: [
        {
          value: props.data[0],
          itemStyle: {
            color: '#42AC1D',
            borderRadius: [0, 5],
          },
        },
        {
          value: props.data[1],
          name: 'Placeholder',
          itemStyle: { color: 'rgba(255, 255, 255, 0.06)' },
          emphasis: {
            disabled: true,
          },
        },
      ],
    },
    {
      name: 'Negative',
      type: 'pie',
      radius: ['65%', '80%'],
      startAngle: 0,
      endAngle: 90,
      itemStyle: {
        borderRadius: [5, 0],
      },
      emptyCircleStyle: {
        color: 'rgba(255, 255, 255, 0.06)',
      },
      emphasis: {
        focus: 'series',
        blurScope: 'global',
      },
      label: {
        show: false,
      },
      data: [
        {
          value: props.data[1],
          itemStyle: {
            color: '#B31414',
            borderRadius: [5, 0],
          },
        },
        {
          value: props.data[0],
          name: '占位符',
          itemStyle: { color: 'rgba(255, 255, 255, 0.06)' },
          emphasis: {
            disabled: true,
          },
        },
      ],
    },
  ],
}));
</script>

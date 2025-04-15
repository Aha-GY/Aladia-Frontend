<template>
  <div
    class="absolute top-1/2 z-10 h-[20.25rem] w-[20.25rem] -translate-y-1/2"
    :class="left ? '-left-[1.75rem]' : '-left-0'"
  >
    <VChart ref="chart" :option="option" :autoresize="true" />
  </div>
</template>

<script setup>
import { PieChart } from 'echarts/charts';
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

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  color: {
    type: Array,
    default: () => [],
  },
  index: {
    type: Number,
    default: null,
  },
  currency: {
    type: String,
    default: '$',
  },
  left: {
    type: Boolean,
    default: false,
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
]);

provide(THEME_KEY, 'dark');

const chart = ref(null);
watch(
  () => props.index,
  (value) => {
    if (value !== null) {
      chart.value.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: value,
      });
    } else {
      chart.value.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
      });
    }
  },
);

const option = computed(() => ({
  backgroundColor: '',
  color: props.color,
  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    textStyle: {
      color: '#fff',
      fontWeight: '600',
    },
    borderColor: '#565656',
    valueFormatter: (value) => `${moneyFormat(value)} ${props.currency}`,
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '68%'],
      data: props.data,
      // [
      //   { value: 30, name: "Courses" },
      //   { value: 50, name: "Streaming" },
      //   { value: 30, name: "Manteinance" },
      // ],
      // roseType: 'radius',
      labelLine: {
        show: false,
      },
      label: {
        show: false,
      },
      emptyCircleStyle: {
        color: '#707070',
      },
    },
  ],
}));
</script>

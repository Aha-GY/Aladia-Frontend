<template>
  <div
    class="relative z-10 h-14 w-14 cursor-pointer transition-all duration-300 hover:rotate-180"
  >
    <VChart
      ref="chart"
      :option="option"
      class="pointer-events-none"
      :autoresize="true"
    />
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
const option = computed(() => ({
  backgroundColor: '',
  color: props.color,
  tooltip: {
    show: false,
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '72%'],
      data: props.data,
      labelLine: {
        show: false,
      },
      label: {
        show: false,
      },
      emphasis: {
        disabled: false,
        scale: false,
      },
      animation: false,
      emptyCircleStyle: {
        color: '#707070',
      },
    },
  ],
}));
</script>

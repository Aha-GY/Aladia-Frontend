<template>
  <client-only>
    <VChart
      ref="chart"
      :option="option"
      :autoresize="true"
      class="h-full w-full"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
      @selectchanged="onSelectChanged"
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
  hoverIndex: {
    type: Number,
    default: null,
  },
  filterIndex: {
    type: Number,
    default: null,
  },
  change: {
    type: Function,
    default: () => {},
  },
  hover: {
    type: Function,
    default: () => {},
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

const chart = ref(null);

const option = computed(() => ({
  backgroundColor: '',
  color: ['#EBD448', '#EBD448', '#EBD448', '#EBD448', '#EBD448'],
  grid: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['170%', '180%'],
      center: ['50%', '100%'],
      startAngle: 180,
      endAngle: 360,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#101010',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      data: [
        { value: 10, name: 1 },
        { value: 10, name: 2 },
        { value: 10, name: 3 },
        { value: 10, name: 4 },
        { value: 10, name: 5 },
      ],
    },
  ],
}));

watch(
  () => props.hoverIndex,
  (value) => {
    if (value !== null) {
      chart.value.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: value - 1,
      });
    } else {
      chart.value.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
      });
      showFilter();
    }
  },
);
watch(
  () => props.filterIndex,
  () => {
    chart.value.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
    });
    showFilter();
  },
);
function showFilter() {
  if (props.filterIndex !== null) {
    chart.value.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: props.filterIndex - 1,
    });
  }
}

function onSelectChanged({ fromActionPayload }) {
  props.change(fromActionPayload.dataIndexInside + 1);
}

function onMouseOver({ data }) {
  props.hover(data.name);
}

function onMouseOut() {
  props.hover(null);
}
</script>

<template>
  <VChart
    ref="chart"
    :option="option"
    :autoresize="true"
    class="h-[20rem] w-[40rem]"
    @mouseover="onMouseOver"
    @mouseout="onMouseOut"
    @selectchanged="onSelectChanged"
  />
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
const courseStore = useCourseStore();
const filter = computed(() => courseStore.review.rating);
const hover = computed(() => courseStore.review.hover);

const chart = ref(null);

const option = computed(() => ({
  backgroundColor: '',
  color: ['#f5ce4c', '#f5ce4c', '#f5ce4c', '#f5ce4c', '#f5ce4c'],
  grid: {
    x: '0%',
    y: '0%',
    bottom: '0%',
    top: '0%',
    width: '100%',
    height: '100%',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['94%', '98%'],
      center: ['50%', '75%'],
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

function onSelectChanged({ fromActionPayload }) {
  courseStore.review.rating = Math.min(
    5,
    fromActionPayload.dataIndexInside + 1,
  );
}

function onMouseOver({ data }) {
  courseStore.review.hover = data.name;
}

function onMouseOut() {
  courseStore.review.hover = 0;
}

function highlight(val) {
  for (let index = 0; index < 5; index++) {
    chart.value.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: index,
    });
  }

  chart.value.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: val - 1,
  });
}

watch(filter, highlight);
watch(hover, highlight);
</script>

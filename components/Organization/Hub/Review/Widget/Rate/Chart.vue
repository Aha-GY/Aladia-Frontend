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
const filter = computed(() => hubReviewStore.reviewFilter);
const hover = computed(() => hubReviewStore.reviewFilterHover);

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
        { value: 10, name: '1' },
        { value: 10, name: '2' },
        { value: 10, name: '3' },
        { value: 10, name: '4' },
        { value: 10, name: '5' },
      ],
    },
  ],
}));

function handleResize() {
  if (chart.value) {
    chart.value.resize();
  }
}

function onSelectChanged({ fromActionPayload }) {
  hubReviewStore.reviewFilter = `${fromActionPayload.dataIndexInside + 1}`;
}

function onMouseOver({ data }) {
  hubReviewStore.reviewFilterHover = data.name;
}

function onMouseOut() {
  hubReviewStore.reviewFilterHover = 'all';
}

function highlight(val) {
  for (let index = 0; index < 5; index++) {
    if (filter.value?.length === 1 && Number(filter.value) - 1 === index) {
      //
    } else {
      chart.value.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: index,
      });
    }
  }

  if (val?.length === 1) {
    chart.value.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: Number(val) - 1,
    });
  }
}

onMounted(() => setTimeout(handleResize, 1000));
watch(filter, highlight);
watch(hover, highlight);
</script>

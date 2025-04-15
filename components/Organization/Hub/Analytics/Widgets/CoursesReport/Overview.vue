<template>
  <div class="flex flex-1 items-center">
    <div class="relative flex h-full w-44 items-center justify-center">
      <VChart
        ref="chart"
        :option="option"
        :autoresize="true"
        class="h-40 w-40"
      />
      <div
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center leading-none"
      >
        <div class="text-2xl font-bold text-white">9</div>
        <div class="text-sm text-white text-white/50">
          {{ $t('org.courses.label') }}
        </div>
      </div>
    </div>
    <div class="h-full flex-1 py-5 text-sm">
      <div class="flex h-full flex-col justify-between">
        <div
          class="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-white/10"
          data-cy="734e0c2b44d1bf5f"
          @click="onDetail"
          @mouseover="highlightPie(0)"
          @mouseleave="downplayPie(0)"
        >
          <div class="flex items-center gap-1">
            <div class="size-2 rounded-full bg-[#9bd4bd]" />
            <img
              class="size-5 rounded-full object-cover"
              src="https://storage.googleapis.com/testing_uploads/elijah.jpeg"
            />
            Maria
          </div>
          <div class="text-[#9bd4bd]">12</div>
        </div>
        <div
          class="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-white/10"
          data-cy="ca5649a35a8fde2f"
          @click="onDetail"
          @mouseover="highlightPie(1)"
          @mouseleave="downplayPie(1)"
        >
          <div class="flex items-center gap-1">
            <div class="size-2 rounded-full bg-[#e28986]" />
            <img
              class="size-5 rounded-full object-cover"
              src="https://storage.googleapis.com/testing_uploads/elijah.jpeg"
            />
            Juliette
          </div>
          <div class="text-[#e28986]">10</div>
        </div>
        <div
          class="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-white/10"
          data-cy="f6231d2aa70f36b7"
          @click="onDetail"
          @mouseover="highlightPie(2)"
          @mouseleave="downplayPie(2)"
        >
          <div class="flex items-center gap-1">
            <div class="size-2 rounded-full bg-[#8d4cf6]" />
            <img
              class="size-5 rounded-full object-cover"
              src="https://storage.googleapis.com/testing_uploads/elijah.jpeg"
            />
            Vivian
          </div>
          <div class="text-[#8d4cf6]">18</div>
        </div>
      </div>
    </div>
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
const analyticsStore = useHubAnalyticsStore();
const chart = ref(null);

const option = computed(() => ({
  backgroundColor: '',
  color: ['#9bd4bd', '#e28986', '#8d4cf6'],
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
      radius: ['60%', '90%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: false,
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 3, name: 'Completed' },
        { value: 4, name: 'In progress' },
        { value: 2, name: 'To do' },
      ],
    },
  ],
}));

function highlightPie(index) {
  const myChart = chart.value?.chart;
  if (!myChart) {
    return;
  }
  myChart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: index,
  });
}

function downplayPie(index) {
  const myChart = chart.value?.chart;
  if (!myChart) {
    return;
  }
  myChart.dispatchAction({
    type: 'downplay',
    seriesIndex: 0,
    dataIndex: index,
  });
}

function onDetail() {
  analyticsStore.coursesReportDetail = {};
}
</script>

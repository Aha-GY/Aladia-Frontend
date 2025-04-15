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
    <div class="flex h-full flex-1 flex-col py-5 text-sm">
      <div
        v-if="analyticsStore.coursesReportDetail"
        class="mb-4 flex cursor-pointer items-center justify-between border-b border-white/50 pb-2"
      >
        <div class="flex items-center gap-1">
          <img
            class="size-5 rounded-full object-cover"
            src="https://storage.googleapis.com/testing_uploads/elijah.jpeg"
          />
          Maria
        </div>
        <div class="text-white">9</div>
      </div>
      <div class="flex flex-1 flex-col justify-between">
        <div
          class="flex items-center justify-between"
          @mouseover="highlightPie(0)"
          @mouseleave="downplayPie(0)"
        >
          <div class="flex items-center gap-2 text-white/80">
            <div class="size-2 rounded-full bg-[#95c167]" />
            {{ $t('org.status.completed') }}
          </div>
          <div class="text-white/50">3</div>
        </div>
        <div
          class="flex items-center justify-between"
          @mouseover="highlightPie(1)"
          @mouseleave="downplayPie(1)"
        >
          <div class="flex items-center gap-2 text-white/80">
            <div class="size-2 rounded-full bg-[#ddb754]" />
            {{ $t('org.status.inProgress') }}
          </div>
          <div class="text-white/50">4</div>
        </div>
        <div
          class="flex items-center justify-between"
          @mouseover="highlightPie(2)"
          @mouseleave="downplayPie(2)"
        >
          <div class="flex items-center gap-2 text-white/80">
            <div class="size-2 rounded-full bg-[#b1b1b1]" />
            {{ $t('org.status.toDo') }}
          </div>
          <div class="text-white/50">2</div>
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
  color: ['#95c167', '#ddb754', '#b1b1b1'],
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
</script>

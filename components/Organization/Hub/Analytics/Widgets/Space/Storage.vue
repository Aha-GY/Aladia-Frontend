<template>
  <div>
    <div class="flex gap-4">
      <div class="flex-1">
        <div class="relative mb-1 text-sm font-semibold">
          {{ $t('org.cost.storage.label') }}
        </div>
        <div class="mb-1 h-1 rounded-full bg-white/10">
          <div class="h-full w-1/2 rounded-full bg-[#035E4E]" />
        </div>
        <div class="mb-6 text-xs text-[#035E4E]">
          {{ $t('org.cost.storage.left', { amount: '56%' }) }}
        </div>
      </div>
      <div class="text-13 text-white/50">
        <div class="mb-1 flex items-center justify-between gap-4">
          <div>{{ $t('org.cost.storage.total') }}</div>
          <div>256,45$</div>
        </div>
        <div class="flex items-center justify-between gap-4">
          <div>{{ $t('org.cost.payment.due') }}</div>
          <div>17/02/24</div>
        </div>
      </div>
    </div>
    <VChart
      ref="chart"
      :option="option"
      :autoresize="true"
      class="h-48 w-full"
    />
  </div>
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

const option = computed(() => ({
  backgroundColor: '',
  color: ['#275d4f'],
  grid: {
    x: '2%',
    y: '4%',
    width: '89%',
    height: '80%',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: Array(30)
      .fill()
      .map((_, index) => index + 1),
    axisLabel: {
      color: '#666',
    },
  },
  yAxis: {
    type: 'value',
    position: 'right',
    axisLabel: {
      color: '#275d4f',
    },
  },
  series: [
    {
      data: Array(30)
        .fill()
        .map(() => Math.floor(Math.random() * 100) + 100),
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#275d4f' },
          { offset: 1, color: 'rgba(39,93,79,0)' },
        ]),
      },
    },
  ],
}));
</script>

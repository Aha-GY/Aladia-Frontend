<template>
  <OrganizationHubAnalyticsWidgetsWrap data-type="qa-report" class="flex">
    <div class="flex h-full w-44 items-center">
      <VChart
        ref="chart"
        :option="option"
        :autoresize="true"
        class="h-40 w-44"
      />
    </div>
    <div class="ml-4 flex-1 text-sm">
      <OrganizationHubAnalyticsWidgetsHeader name="org.hub.task.manage.qa" />
      <div class="mb-2 text-xl font-bold">600</div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-white/80">
          <div class="size-2 rounded-full bg-[#b63831]" />
          {{ $t('course.question.status.notAnswered') }}
        </div>
        <div class="text-white/50">123</div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-white/80">
          <div class="size-2 rounded-full bg-[#eec24e]" />
          {{ $t('course.question.status.answered') }}
        </div>
        <div class="text-white/50">123</div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-white/80">
          <div class="size-2 rounded-full bg-[#94d2f6]" />
          {{ $t('course.question.status.answeredByT') }}
        </div>
        <div class="text-white/50">123</div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-white/80">
          <div class="size-2 rounded-full bg-[#95c167]" />
          {{ $t('course.question.status.solved') }}
        </div>
        <div class="text-white/50">123</div>
      </div>
    </div>
  </OrganizationHubAnalyticsWidgetsWrap>
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

const option = computed(() => ({
  backgroundColor: '',
  color: ['#b63831', '#eec24e', '#94d2f6', '#95c167'],
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
      radius: ['65%', '90%'],
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
        { value: 123, name: 'Not Answered' },
        { value: 123, name: 'Answered' },
        { value: 123, name: 'Answered by a teacher' },
        { value: 123, name: 'Solved' },
      ],
    },
  ],
}));
</script>

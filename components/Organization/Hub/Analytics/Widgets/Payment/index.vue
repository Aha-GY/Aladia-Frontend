<template>
  <OrganizationHubAnalyticsWidgetsWrap data-type="payment-chart" class="flex">
    <div class="flex h-full w-44 items-center">
      <VChart
        ref="chart"
        :option="option"
        :autoresize="true"
        class="h-40 w-44"
      />
    </div>
    <div class="ml-4 flex-1 text-sm">
      <OrganizationHubAnalyticsWidgetsHeader
        name="org.hub.task.manage.payment"
      />
      <div class="mb-6 text-xl font-bold">60.234,50€</div>
      <div class="mb-3 flex items-center justify-between">
        <div class="flex items-center gap-2 text-white/80">
          <div class="size-2 rounded-full bg-[#95c166]" />
          {{ $t('org.hub.analytics.payment.income') }}
        </div>
        <div class="text-white/50">55%</div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-white/80">
          <div class="size-2 rounded-full bg-[#b63831]" />
          {{ $t('org.hub.analytics.payment.spending') }}
        </div>
        <div class="text-white/50">45%</div>
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
  color: ['#95c166', '#b63831'],
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
        { value: 1048, name: 'Income' },
        { value: 735, name: 'Spending' },
      ],
    },
  ],
}));
</script>

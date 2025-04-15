<template>
  <div class="relative h-full w-[17rem] bg-white">
    <div
      class="absolute left-1/2 top-1/2 z-10 h-[20.25rem] w-[20.25rem] -translate-x-1/2 -translate-y-1/2"
    >
      <VChart ref="chart" :option="option" :autoresize="true" />
    </div>

    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <OrganizationHubPaymentWidgetsSvgCircle />
      <div
        class="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center"
      >
        <div v-if="activeItem" class="text-[1.4375rem] font-semibold">
          {{ `${activeItem?.amount} ${activeItem?.currency}` }}
        </div>
        <div v-if="activeItem" class="text-center text-xs opacity-80">
          {{
            `${activeItem.groupId !== activeItem.name ? `${activeItem.groupId} -` : ''} ${activeItem.name}`
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { graphic } from 'echarts';
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

const DATA = [
  {
    percent: 15,
    name: 'EUR',
    amount: 1500,
    currency: '€',
    groupId: 'Total',
    childGroupId: 'EUR',
  },
  {
    percent: 10,
    name: 'USD',
    amount: 1000,
    currency: '$',
    groupId: 'Total',
    childGroupId: 'USD',
  },
  {
    percent: 5,
    name: 'ETB',
    amount: 62894.7,
    currency: 'Birr',
    groupId: 'Total',
    childGroupId: 'ETB',
  },
  {
    percent: 50,
    name: 'Escrow',
    amount: 5000,
    currency: '$',
    groupId: 'Escrow',
  },
];

const SUB_DATA = {
  dataGroupId: 'Total',
  data: [DATA[0], DATA[1], DATA[2]],
};

const option = {
  backgroundColor: '',
  color: ['#E4B53D', '#D65F20', '#6C5B7F'],
  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    textStyle: {
      color: '#fff',
      fontWeight: '600',
    },
    borderColor: '#565656',
  },
  series: [
    {
      type: 'pie',
      radius: ['50%', '68%'],
      data: DATA.map((item) => ({
        value: item.percent,
        name: item.name,
        groupId: item.groupId,
        childGroupId: item.childGroupId,
        tooltip: {
          show: true,
          // eslint-disable-next-line arrow-body-style, @typescript-eslint/no-unused-vars
          formatter: (params) => {
            // console.log('params', params);
            return `${item.groupId !== item.name ? `${item.groupId} -` : ''} ${item.name}: ${item.amount} (${item.percent}%) `;
          },
        },
      })),
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
};

const chart = ref(null);
const activeItem = ref(DATA[0]);

onMounted(async () => {
  await sleep(1000);
  const myChart = chart.value?.chart;
  if (!myChart) {
    return;
  }

  // 默认激活第一个数据项
  myChart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: 0,
  });

  myChart.on('click', (params) => {
    console.log('click params', params);
    if (params.componentType === 'series') {
      activeItem.value = DATA[params.dataIndex];
      if (params.data.groupId === 'Total') {
        myChart.setOption({
          series: {
            dataGroupId: params.data.groupId,
            data:
              params.data.groupId === 'Total'
                ? SUB_DATA.data.map((item) => ({
                    value: item.percent,
                    name: item.name,
                    groupId: item.groupId,
                    childGroupId: item.childGroupId,
                    tooltip: {
                      show: true,
                      // eslint-disable-next-line arrow-body-style
                      formatter: (params) => {
                        // console.log('params', params);
                        return `${item.groupId !== item.name ? `${item.groupId} -` : ''} ${item.name}: ${item.amount} (${params.percent}%) `;
                      },
                    },
                  }))
                : [DATA[3]].map((item) => ({
                    value: item.percent,
                    name: item.name,
                    groupId: item.groupId,
                    tooltip: {
                      show: true,
                      // eslint-disable-next-line arrow-body-style
                      formatter: (params) => {
                        // console.log('params', params);
                        return `${item.groupId !== item.name ? `${item.groupId} -` : ''} ${item.name}: ${item.amount} (${params.percent}%) `;
                      },
                    },
                  })),
          },
          graphic: [
            {
              type: 'text',
              left: 50,
              top: 50,
              style: { text: 'Back', fontSize: 18, fill: '#fff' },
              onclick() {
                myChart.setOption(option, true);
              },
            },
          ],
        });
      }

      // 移除所有高亮状态
      myChart.dispatchAction({
        type: 'downplay',
      });

      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: [0],
        dataIndex: params.dataIndex,
      });
    }
  });
});
</script>

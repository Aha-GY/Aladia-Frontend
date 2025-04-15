<template>
  <VChart
    ref="chart"
    :option="option"
    :autoresize="true"
    class="h-full w-full"
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
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import VChart, { THEME_KEY } from 'vue-echarts';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  color: {
    type: Array,
    default: () => [],
  },
  highlight: {
    type: Number,
    default: null,
  },
});
const emit = defineEmits(['mouseover', 'mouseout', 'selectchanged']);
const { t } = useI18n();
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

watch(
  () => props.highlight,
  (value) => {
    if (value !== null) {
      chart.value.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: value,
      });
    } else {
      chart.value.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
      });
    }
  },
);

const option = computed(() => ({
  backgroundColor: '',
  color: props.color,
  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    textStyle: {
      color: '#fff',
      fontWeight: '600',
    },
    borderColor: '#565656',
    appendToBody: true,
  },
  series: [
    {
      type: 'pie',
      radius: ['60%', '90%'],
      data: props.data.map((item) => ({
        ...item,
        name: t(item.name),
      })),
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
}));

const onMouseOver = (params) => {
  emit('mouseover', params);
};
const onMouseOut = () => {
  emit('mouseout');
};
const onSelectChanged = (params) => {
  const { fromActionPayload } = params;
  const data = props.data[fromActionPayload.dataIndexInside];
  emit('selectchanged', {
    data,
    index: fromActionPayload.dataIndexInside,
    ...params,
  });
};
</script>

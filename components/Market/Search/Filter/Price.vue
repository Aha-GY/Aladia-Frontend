<template>
  <div>
    <div class="mb-4 text-center">
      {{ $t('course.price.name') }}
    </div>
    <div class="relative mb-8 h-28">
      <VChart class="h-full w-full" :option="chartOption" />
      <el-slider
        v-model="range"
        range
        :min="0"
        :max="maxPrice"
        :step="step"
        :format-tooltip="formatTooltip"
        class="range-slider absolute -bottom-4 left-0 right-0"
        tooltip-class="range-tooltip"
        @change="handleRangeChange"
      />
    </div>
    <div class="flex justify-between gap-16 text-sm">
      <div class="flex w-60 items-end gap-1">
        <span class="mb-0.5 text-white/50">
          {{ $t('org.activity.chat.forward.from') }}
        </span>
        <BaseInput
          v-model="props.query.minCost"
          fixed
          number
          currency
          @blur="validateFromPrice"
        />
      </div>
      <div class="flex w-60 items-end gap-1">
        <span class="mb-0.5 text-white/50">
          {{ $t('org.activity.chat.forward.to') }}
        </span>
        <span v-if="props.query.maxCost === maxPrice" class="mb-0.5">+</span>
        <BaseInput
          v-model="props.query.maxCost"
          fixed
          number
          currency
          @blur="validateToPrice"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';

const props = defineProps({
  query: {
    type: Object,
    required: true,
  },
});

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
]);

const searchStore = useSearchStore();
const step = searchStore.priceRange.step;
const priceHistogram = searchStore.priceRange.priceHistogram;
const maxPrice = computed(() => step * priceHistogram.length);
const range = ref([props.query.minCost, props.query.maxCost]);
const formatTooltip = (val) => `$${val === maxPrice.value ? '+' : ''}${val}`;

const chartOption = ref({
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  xAxis: {
    type: 'category',
    data: priceHistogram.map(
      (_, i, arr) =>
        `$${i * step} - $${arr.length - 1 === i ? '+' : ''}${(i + 1) * step}`,
    ),
    show: false,
  },
  yAxis: {
    type: 'value',
    show: false,
  },
  series: [
    {
      data: priceHistogram,
      type: 'bar',
      barWidth: '100%',
      itemStyle: {
        borderRadius: [1, 1, 0, 0],
      },
    },
  ],
  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    textStyle: {
      color: '#fff',
      fontWeight: '600',
    },
    borderColor: '#565656',
    trigger: 'axis',
    formatter(params) {
      const data = params[0];
      return `${data.name}<br/>Courses: ${data.value}`;
    },
  },
  visualMap: {
    show: false,
    dimension: 0,
    pieces: [{ gte: 0, lte: priceHistogram.length - 1, color: '#3B82F6' }],
  },
});

const handleRangeChange = (newRange) => {
  updateChartHighlight(newRange);
};

const updateChartHighlight = (newRange) => {
  const startIndex = Math.floor(newRange[0] / step);
  const endIndex = Math.ceil(newRange[1] / step) - 1;

  chartOption.value.visualMap.pieces = [
    { lt: startIndex, color: '#777777' },
    { gte: startIndex, lte: endIndex, color: '#dcb73d' },
    { gt: endIndex, color: '#777777' },
  ];
};

const validateFromPrice = () => {
  let value = props.query.minCost;
  if (isNaN(value) || value < 0) {
    value = 0;
  } else if (value > props.query.maxCost) {
    value = props.query.maxCost;
  }
  props.query.minCost = value;
  range.value = [value, props.query.maxCost];
};

const validateToPrice = () => {
  let value = props.query.maxCost;
  if (isNaN(value) || value > maxPrice.value) {
    value = maxPrice.value;
  } else if (value < props.query.minCost) {
    value = props.query.minCost;
  }
  props.query.maxCost = value;
  range.value = [props.query.minCost, value];
};

const reset = () => {
  range.value = [0, maxPrice.value];
  props.query.minCost = 0;
  props.query.maxCost = maxPrice.value;
};

watch(
  range,
  (newRange) => {
    updateChartHighlight(newRange);
    props.query.minCost = newRange[0];
    props.query.maxCost = newRange[1];
  },
  { immediate: true },
);

defineExpose({
  reset,
});
</script>

<style>
.el-popper.is-dark.range-tooltip {
  color: #fff;
  background: #000;
  border: 1px solid #222;
}

.el-popper.is-dark.range-tooltip .el-popper__arrow::before {
  background: #000;
  border: 1px solid #222;
  border-left-color: #000;
  border-bottom-color: #000;
}

.range-slider .el-slider__bar {
  --el-slider-height: 3px !important;
  background-color: #dcb73d !important;
}

.range-slider .el-slider__runway {
  --el-slider-height: 3px !important;
}

.range-slider .el-slider__button {
  border-color: #cfa200 !important;
  background-color: #d5ceb1 !important;
  box-shadow: 0px 0px 1px 1px #0000003d;
}

.range-slider .el-slider__button-wrapper.hover .el-slider__button,
.range-slider .el-slider__button-wrapper:hover .el-slider__button {
  border-color: #cfa200 !important;
}

.range-slider .el-slider__button-wrapper {
  transform: scale(3) translateX(-25%);
  transform-origin: center;
}

.range-slider .el-slider__runway {
  background-color: #777777;
}
</style>

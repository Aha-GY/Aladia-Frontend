<template>
  <div id="treemap-container" class="treemap-container w-full" />
</template>
<script setup>
import {
  VChart,
  registerAnimate,
  registerRangeColumnChart,
  registerCartesianTimeAxis,
  registerTooltip,
  registerDomTooltipHandler,
  registerDataZoom,
  registerLabel,
} from '@visactor/vchart';
import dayJS from 'dayjs';
import { useI18n } from 'vue-i18n';

import briefcaseIcon from '~/assets/images/briefcase-solid.svg';
import certificateSolid from '~/assets/images/certificate-solid.svg';
import graduationCapSolid from '~/assets/images/graduation-cap-solid.svg';
import locales from '~/constant/en';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const dayjs = dayJS.tz;

const { t } = useI18n();
// 注册图表和组件
VChart.useRegisters([
  registerAnimate,
  registerRangeColumnChart,
  registerCartesianTimeAxis,
  registerTooltip,
  registerDomTooltipHandler,
  registerDataZoom,
  registerLabel,
]);

let chart = null;
const { isMobile } = useDevice();
const labels = locales.labels;
const chartData = ref([]);
const minAndMaxDate = ref();
const spec = computed(() => {
  const endTimeValue = (minAndMaxDate.value.max + 365 * 20 * 86400000) / 1000;
  return {
    type: 'rangeColumn',
    direction: 'horizontal',
    background: 'transparent',
    theme: 'dark',
    height: props.data.length >= 4 ? 400 : 240,
    padding: {
      left: 0,
      right: 0,
    },
    yField: 'id',
    minField: 'start_time',
    maxField: 'end_time',
    dataZoom: [
      {
        orient: 'bottom',
        height: 20,
        start: 0,
        end: 100,
        // endValue: endTimeValue,
        filterMode: 'axis',
        brushSelect: false,
        startText: {
          style: {
            dy: -5,
          },
          formatMethod: (text) => formatDateString(text, true),
        },
        endText: {
          style: {
            dy: -5,
          },
          formatMethod: (text) => formatDateString(text, true),
        },
        selectedBackground: {
          style: {
            height: 10,
          },
        },
        background: {
          style: {
            height: 10,
          },
        },
        startHandler: {
          style: {
            size: 12,
            dy: -5,
          },
        },
        endHandler: {
          style: {
            size: 12,
            dy: -5,
          },
        },
      },
    ],
    barMaxWidth: 15,
    barMinHeight: 30,
    bar: {
      style: {
        cornerRadius: 10,
        // shadowColor: (datum) => {
        //   const color = {
        //     work: '#9747FF',
        //     study: '#FD7542',
        //     certificate: '#EAB308',
        //   };
        //   return color[datum.type];
        // },
        // shadowBlur: 10,
        fillOpacity: 0.6,
        fill: (datum) => {
          const color = {
            work: '#9747FF',
            study: '#FD7542',
            certificate: '#EAB308',
          };
          return color[datum.type];
          // return {
          //   gradient: 'linear',
          //   x0: 0,
          //   y0: 0.5,
          //   x1: 1,
          //   y1: 0.5,
          //   stops: [
          //     { offset: 0, color: '#fff' },
          //     { offset: 1, color: color[datum.type] },
          //   ],
          // };
        },
      },
    },
    barBackground: {
      visible: false,
    },
    label: {
      visible: true,
      position: 'outside',
      overlap: {
        hideOnHit: false,
        avoidBaseMark: true,
      },
      style: {
        type: 'rich',
        ellipsis: true,
        singleLine: true,
        // width: 200,
      },
      formatMethod: (_, datum) => {
        const img = datum.brand?.picture || datum.organization?.picture;
        let icon = briefcaseIcon;
        if (datum.type === 'study') {
          icon = graduationCapSolid;
        } else if (datum.type === 'certificate') {
          icon = certificateSolid;
        }
        return {
          type: 'rich',
          text: [
            {
              image: icon,
              width: 15,
              height: 15,
              margin: [0, 5, 0, 5],
            },
            {
              image: img,
              width: img ? 15 : 0,
              height: img ? 15 : 0,
              margin: img ? [0, 5, 0, 0] : 0,
            },
            {
              text: truncateString(datum.yField, 0),
              fontSize: 13,
              textAlign: true,
              fill: '#fff',
              stroke: false,
            },
          ],
        };
      },
    },
    axes: [
      {
        orient: 'left',
        type: 'band',
        bandPadding: 0.7,
        visible: false,
        autoIndent: false,
      },
      {
        type: 'time',
        orient: 'bottom',
        nice: true,
        max: endTimeValue * 1000,
        label: {
          formatMethod: (text) => formatDateString(text),
        },
        domainLine: {
          visible: true,
          style: {
            // stroke: '#4e4e4e',
          },
        },
        grid: {
          visible: false,
        },
        tick: {
          tickCount: 6,
        },
      },
    ],
    tooltip: {
      visible: true,
      trigger: isMobile ? 'click' : 'hover',
      mark: {
        visible: true,
        title: {
          visible: false,
        },
        content: [
          {
            key: (datum) => {
              let text = '';
              if (datum.type === 'work') {
                text = 'personal.job.role';
              } else if (datum.type === 'study') {
                text = 'personal.degree';
              } else if (datum.type === 'certificate') {
                text = 'personal.certificate.label';
              }
              return t(text);
            },
            value: (datum) => datum.yField,
          },
          {
            key: (datum) => {
              let text = '';
              if (datum.type === 'work') {
                text = 'personal.company';
              } else if (datum.type === 'study') {
                text = 'personal.school';
              } else if (datum.type === 'certificate') {
                text = 'personal.issue.organization';
              }
              return t(text);
            },
            value: (datum) => datum.authority,
          },
          {
            key: (datum) => {
              let text = '';
              if (datum.type === 'work') {
                text = 'personal.job.type';
              } else if (datum.type === 'study') {
                text = 'personal.field';
              } else if (datum.type === 'certificate') {
                text = 'personal.credential.url';
              }
              return t(text);
            },
            value: (datum) => {
              let value = '';
              if (datum.type === 'work') {
                value = datum.jobType;
              } else if (datum.type === 'study') {
                value = datum.fieldOfStudy;
              } else if (datum.type === 'certificate') {
                value = datum.link;
              }
              return value;
            },
          },
          {
            key: (datum) =>
              datum.type === 'certificate'
                ? t('personal.certificate.date.issued')
                : t('personal.certificate.from'),
            value: (datum) => formatDateString(datum.start_time),
          },
          {
            key: (datum) =>
              datum.type === 'certificate'
                ? t('personal.certificate.date.expire')
                : t('personal.certificate.to'),
            value: (datum) => formatDateString(datum.end_time),
          },
        ],
      },
      dimension: {
        visible: false,
      },
    },
    brush: {
      visible: false,
    },
    data: [
      {
        values: chartData.value,
      },
    ],
  };
});

const handlerData = (data) => {
  const sortedData = data
    .map((item) => ({
      ...item,
      yField: item.name || item.degree || item.authority,
      start_time: dayjs(new Date(item.startDate)).valueOf(),
      end_time: item.endDate
        ? dayjs(new Date(item.endDate)).valueOf()
        : dayjs().valueOf(),
    }))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  minAndMaxDate.value = findMinMaxDates(sortedData);
  return sortedData;
};

const formatDateString = (datetime, showDay = false) => {
  const dateStr = dayjs(datetime).format('YYYY-MM-DD');
  const [year, monthStr, day] = dateStr.split('-');
  const monthNum = parseInt(monthStr, 10);
  const monthName = labels.monthsShort[monthNum - 1];
  return showDay ? `${day} ${monthName} ${year}` : `${monthName} ${year}`;
};

const findMinMaxDates = (data) => {
  let min = null;
  let max = null;
  data.forEach((item) => {
    if (min === null || item.start_time < min) {
      min = item.start_time;
    }
    if (max === null || item.end_time > max) {
      max = item.end_time;
    }
  });

  return { min, max };
};

const createOrUpdateChart = () => {
  const container = document.getElementById('treemap-container');
  if (container && !chart) {
    chart = new VChart(spec.value, {
      dom: container,
    });
    chart.renderSync();
    return true;
  } else if (chart) {
    chart.updateSpec(spec.value);
    chart.renderSync();
    return true;
  }
  return false;
};

onMounted(() => {
  createOrUpdateChart();
});

onUpdated(() => {
  createOrUpdateChart();
});

onBeforeUnmount(() => {
  if (chart) {
    chart.release();
  }
});

watch(
  () => props.data,
  () => {
    chartData.value = [];
    const newData = handlerData(props.data);
    chartData.value = newData;
  },
  { immediate: true, deep: true },
);
</script>

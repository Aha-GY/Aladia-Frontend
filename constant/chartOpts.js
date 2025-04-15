export const PAYMENT_TIMELINE_BAR_OPTIONS = {
  backgroundColor: '',
  color: ['#88C359', '#DA4242'],

  grid: {
    top: 35,
    left: 80,
    right: 0,
    bottom: 20,
  },
  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    trigger: 'axis',
    // formatter: (params) => {
    //   var res = "";
    //   for (var i = 0; i < params.length; i++) {
    //     if (params[i].data != undefined) {
    //       res +=
    //         "<div>" +
    //         `<span class="mr-3">${params[i].marker}</span>` +
    //         params[i].data +
    //         "</div>";
    //     }
    //   }
    //   return res;
    // },
    textStyle: {
      color: '#fff',
      fontWeight: '600',
    },
    borderColor: '#565656',
    padding: [4, 8],
  },
  xAxis: {
    type: 'category',
    data: [1, 2, 3, 4, 5, 6, 7],
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#707070',
      // interval: 1,
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#707070',
      // interval: 1,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(112, 112, 112, 0.55)',
        type: 'dashed',
      },
    },
  },
  legend: {
    top: 2,
    right: 0,
    itemWidth: 8,
    itemHeight: 8,
    icon: 'circle',
    textStyle: {
      color: '#707070',
      fontWeight: '600',
    },
  },
  series: [
    {
      name: 'Income',
      type: 'bar',
      data: [0, 0, 0, 0, 0, 0, 0],
      barWidth: 4,
      // barMinHeight: 4,

      itemStyle: {
        borderRadius: [4, 4, 0, 0],
      },
    },
    {
      name: 'Spending',
      type: 'bar',
      data: [0, 0, 0, 0, 0, 0, 0],
      barWidth: 4,
      // barMinHeight: 4,

      itemStyle: {
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
};

import dayJS from 'dayjs';

const dayjs = dayJS.tz;
/** 如果date参数是ISO 那么需要new Date */

export function getDaysInMonth(date) {
  const dayjsDate = dayjs(date);
  let start = dayjsDate.startOf('month').startOf('week');

  const dates = [];
  let i = 0;
  while (i < 42) {
    dates.push(start.toDate());
    start = start.add(1, 'day');
    i++;
  }

  return dates;
}

export function getWeekArray(date) {
  const weekArray = [];
  const startOfWeek = dayjs(date).startOf('week');
  for (let i = 0; i < 7; i++) {
    if (i < 6) {
      weekArray.push(startOfWeek.add(i, 'day').toDate());
    } else {
      weekArray.push(startOfWeek.add(i, 'day').endOf('day').toDate());
    }
  }
  return weekArray;
}

export function getTimesInDay() {
  const times = [];
  // for (let i = 0; i < 24; i++) {
  //   let hour;
  //   let md;

  //   if (i === 0) {
  //     hour = 12;
  //     md = 'AM';
  //   } else {
  //     hour = i;
  //     md = 'AM';
  //   }

  //   if (hour > 12) {
  //     hour -= 12;
  //   }
  //   if (i >= 12) {
  //     md = 'PM';
  //   }
  //   times.push(`${hour}${md}`);
  // }
  for (let i = 0; i < 24; i++) {
    times.push(`${i}:00`);
  }
  return times;
}

export function getCreateDateRange(date, isAll) {
  let createDate = dayjs(new Date(date));
  let minute = createDate.minute();
  if (minute % 15 !== 0) {
    minute = Math.ceil(minute / 15) * 15;
  }
  createDate = createDate.set('minute', minute);

  let startDate = dayjs(createDate).toISOString();
  let endDate = dayjs(createDate.add(1, 'hour')).toISOString();
  if (isAll) {
    startDate = dayjs(createDate).startOf('day').toISOString();
    endDate = dayjs(createDate).endOf('day').toISOString();
  }
  return { startDate, endDate };
}

export function generateDateArray(startDate, endDate) {
  const start = dayjs(new Date(startDate));
  const end = dayjs(new Date(endDate));
  const dateArray = [];

  let currentDate = start;
  while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
    dateArray.push(currentDate.format('YYYY-MM-DD'));
    currentDate = currentDate.add(1, 'day');
  }

  return dateArray;
}

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import today from 'dayjs/plugin/isToday';
import yesterday from 'dayjs/plugin/isYesterday';
import minMax from 'dayjs/plugin/minMax';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import moment from 'moment-timezone';

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(today);
dayjs.extend(yesterday);
dayjs.extend(minMax);
dayjs.extend(quarterOfYear);

export const timezoneList = moment.tz.names().map((zone, index) => {
  const gmt = moment.tz(zone).format('Z');
  return {
    key: index,
    zone,
    gmt,
  };
});

export function formatRelativeTime(date) {
  const target = dayjs.tz(date);
  if (target.isToday()) {
    return `Today at ${target.format('h:mm A')}`;
  } else if (target.isYesterday()) {
    return `Yesterday at ${target.format('h:mm A')}`;
  } else {
    return target.format('DD MMM YYYY [at] h:mm A');
  }
}

export const currentTimeZone = () => {
  const zone = dayjs.tz.guess();
  // const now = dayjs().format();
  // const gmt = dayjs.tz(now, zone).format('Z');
  // return `${zone} (UTC${gmt})`;
  return `${zone}`;
};

export const getUTCOffsetForTimezone = (timezone) => {
  if (!timezone) {
    return null;
  }
  if (timezone?.includes('UTC')) {
    return `UTC+00:00`;
  }
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone?.replace(/\s?\(UTC[+-]\d{2}(:\d{2})?\)/, ''),
    timeZoneName: 'short',
  });
  const parts = formatter.formatToParts(new Date());
  const timeZonePart = parts.find((part) => part.type === 'timeZoneName');
  if (timeZonePart?.value) {
    const offset = timeZonePart?.value.replace('GMT', 'UTC');
    return `${offset === 'UTC' ? 'UTC+0' : offset}:00`;
  } else {
    return null;
  }
};

export const getTimeZoneDifference = (targetTimeZone) => {
  const now = dayjs();
  const defaultTime = now.tz();
  const targetTime = now.tz(targetTimeZone);
  const difference = targetTime.utcOffset() - defaultTime.utcOffset();
  return difference;
};

export function localDayjs(date) {
  const zone = dayjs.tz.guess();
  return dayjs.utc(date).tz(zone);
}

export function dateToUTC(date) {
  return dayjs(date).utc();
}

export function formatDate(date, format = 'DD MMM YYYY') {
  if (!date) {
    return 'No Date';
  }
  return dayjs.tz(new Date(date)).format(format);
}

export function afterToday() {
  return dayjs.tz().subtract(1, 'day');
}

export function isToday(date) {
  return dayjs.tz(new Date(date)).isToday();
}

export function isYesterday(date) {
  return dayjs.tz(new Date(date)).isYesterday();
}

export function isSameday(date, otherDate) {
  return dayjs.tz(new Date(date)).isSame(dayjs.tz(new Date(otherDate)), 'day');
}

export function isThisWeek(date) {
  const startOfWeek = dayjs.tz().startOf('week');
  const endOfWeek = dayjs.tz().endOf('week');
  return dayjs
    .tz(new Date(date))
    .isBetween(startOfWeek, endOfWeek, 'day', '[]');
}

export function formatRelativeDate(date) {
  const now = dayjs.tz();
  const createdAt = dayjs.tz(new Date(date));
  if (now.isSame(createdAt, 'day')) {
    return 'Today';
  }
  if (now.subtract(1, 'day').isSame(createdAt, 'day')) {
    return 'Yesterday';
  }
  // if (now.isSame(createdAt, 'week')) {
  //   return 'This week';
  // }
  return createdAt.format('D MMM YYYY');
}

export function timeAgo(date) {
  return dayjs.tz(new Date(date)).fromNow();
}

export function timeAgo2(date) {
  const now = dayjs.tz();
  const targetTime = dayjs.tz(new Date(date));
  const diffInSeconds = now.diff(targetTime, 'second');
  const diffInMinutes = now.diff(targetTime, 'minute');
  const diffInHours = now.diff(targetTime, 'hour');
  const diffInDays = now.diff(targetTime, 'day');
  const diffInWeeks = now.diff(targetTime, 'week');
  const diffInMonths = now.diff(targetTime, 'month');
  if (diffInSeconds < 60) {
    return `${diffInSeconds < 1 ? 1 : diffInSeconds} sec`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min`;
  } else if (diffInHours < 24) {
    return `${diffInHours} h`;
  } else if (diffInDays < 7) {
    return `${diffInDays} d`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} w`;
  } else if (diffInMonths < 4) {
    return `${diffInMonths} m`;
  } else {
    return targetTime.format('MM/DD/YYYY');
  }
}

export function timeAgo3(date, prefix = 'nav.header.time.prefix') {
  const { $i18n } = useNuxtApp();

  const now = dayjs.tz();
  const targetTime = dayjs.tz(new Date(date));
  const diffInSeconds = now.diff(targetTime, 'second');
  const diffInMinutes = now.diff(targetTime, 'minute');
  const diffInHours = now.diff(targetTime, 'hour');
  const translatedPrefix = $i18n.t(prefix);
  if (diffInSeconds < 60) {
    const message = $i18n.t('nav.header.time.now', {
      prefix: translatedPrefix,
    });
    return message;
  } else if (diffInMinutes < 60) {
    const message = $i18n.t('nav.header.time.minutes', {
      prefix: translatedPrefix,
      diffInMinutes,
    });
    return message;
  } else if (diffInHours < 24) {
    const message = $i18n.t('nav.header.time.hours', {
      prefix: translatedPrefix,
      diffInHours,
    });
    return message;
  } else {
    return targetTime.format('MM/DD/YYYY');
  }
}

export function dateAgo(date) {
  if (dayjs.tz(new Date(date)).isSame(dayjs.tz(), 'day')) {
    return formatDate(date, 'HH:mm');
  } else if (
    dayjs.tz(new Date(date)).isBefore(dayjs.tz().subtract(6, 'day'), 'day')
  ) {
    return formatDate(date, 'MM/DD/YY');
  } else {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
      dayjs.tz(new Date(date)).day()
    ];
  }
}

export function seenTimeFormat(date) {
  if (dayjs.tz(new Date(date)).isSame(dayjs.tz(), 'day')) {
    return `today at ${formatDate(new Date(date), 'HH:mm')}`;
  } else {
    return `${formatDate(new Date(date), 'MMM DD,YYYY')} at ${formatDate(new Date(date), 'HH:mm')}`;
  }
}

export function secondsToHours(seconds, fixed = 2) {
  const hours = dayjs
    .duration(seconds * 1000)
    .asHours()
    .toFixed(fixed);
  return hours;
}

export function diffDays(date) {
  const now = dayjs.tz().format('YYYY-MM-DD');
  const targetTime = formatDate(date, 'YYYY-MM-DD');
  return dayjs.tz(now).diff(targetTime, 'day');
}

export function timeBefore24Hours() {
  const timeBefore24Hours = dayjs.tz().subtract(24, 'hour');

  return timeBefore24Hours.toISOString();
}

export function formatTimeInput(input, previousValue) {
  let cleanedInput = input.replace(/\s/g, '');
  // 检查是否没有am或pm并且小时数大于等于24
  const timeParts = cleanedInput.split(':');
  let hours = parseInt(timeParts[0], 10);
  let minutes = timeParts[1] || '00';

  if (!/am|pm/i.test(cleanedInput) && hours >= 24) {
    cleanedInput = `${hours - 24}:${minutes}`;
  } else {
    // 补全不完整的时间格式
    if (hours.length === 1) {
      hours = `0${hours}`;
    }
    if (minutes.length === 1) {
      minutes = `0${minutes}`;
    }
    cleanedInput = `${hours}:${minutes}`;
  }

  let parsedTime;
  if (/^\d{1,2}:\d{2}(am|pm)?$/i.test(cleanedInput)) {
    parsedTime = dayjs(cleanedInput, ['HH:mm', 'H:mm'], true);
    if (!parsedTime.isValid()) {
      parsedTime = dayjs(
        cleanedInput,
        ['hh:mma', 'hh:mmA', 'h:mma', 'h:mmA'],
        true,
      );
    }
  }

  if (parsedTime && parsedTime.isValid()) {
    return parsedTime.format('HH:mm');
  } else {
    return previousValue;
  }
}

export function getCurrentTimeStatus(startDate, endDate) {
  const now = dayjs.tz();
  let start = dayjs.tz(new Date(startDate));
  let end = dayjs.tz(new Date(endDate));

  const diff = dayjs
    .tz(new Date(endDate))
    .diff(dayjs.tz(new Date(startDate)), 'minute');
  if (diff % 1440 === 0) {
    start = dayjs.tz(dayjs.tz(new Date(startDate)).startOf('day'));
    end = dayjs.tz(dayjs.tz(new Date(endDate)).endOf('day'));
  }

  if (now.isBefore(start)) {
    return 'future';
  } else if (now.isAfter(end)) {
    return 'past';
  } else {
    return 'live';
  }
}

export function getZeroTimeZone(date) {
  const currentTime = dayjs.tz().format('HH:mm');
  const day = formatDate(date, 'YYYY-MM-DD');
  return dayjs.tz(`${day} ${currentTime}`).toISOString();
}

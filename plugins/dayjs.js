import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/en';
import 'dayjs/locale/it';

dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(timezone);

export default defineNuxtPlugin(() => {
  const i18n_redirected = useCookie('i18n_redirected');
  const user = useCookie('user');
  const setDayjsTimeZone = (timezone = user.value?.timezone) => {
    const myTimezone = timezone?.trim()?.match(/^([\w/]+)/);
    const gussTimezone = dayjs.tz.guess();
    const defaultTimezone = myTimezone ? myTimezone[0] : gussTimezone;
    dayjs.tz.setDefault(defaultTimezone);
  };
  const setDayjsLanguage = (lang) => {
    dayjs.locale(lang);
    dayjs.updateLocale(lang, {
      weekStart: 0,
    });
  };
  setDayjsTimeZone();
  setDayjsLanguage(i18n_redirected.value || 'en');

  return {
    provide: {
      dayjs,
      setDayjsLanguage,
      setDayjsTimeZone,
    },
  };
});

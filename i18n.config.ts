const fileNames = [
  'auth',
  'base',
  'calendar',
  'categories',
  'course',
  'event',
  'error',
  'filter',
  'fluxes',
  'index',
  'meet',
  'nav',
  'organization',
  'payment',
  'personal',
  'post',
  'space',
  'reviews',
  'qa',
  'admin',
];

function getFileList(locale: string) {
  return fileNames.map((name) => `${locale}/${name}.js`);
}

export default {
  legacy: false,
  locales: [
    { code: 'en', files: getFileList('en') },
    { code: 'it', files: getFileList('it') },
  ],
  lazy: true,
  langDir: 'i18n',
  defaultLocale: 'en',
  strategy: 'no_prefix' as const,
};

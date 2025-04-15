import { Loader } from '@googlemaps/js-api-loader';

import { ApiKey } from '~/components/Base/GoogleMaps/constant';

export default defineNuxtPlugin(() => {
  const i18n_redirected = useCookie('i18n_redirected');
  const loadGoogleMaps = () =>
    new Promise((resolve) => {
      const loader = new Loader({
        apiKey: ApiKey,
        version: 'weekly',
        libraries: ['places'],
        language: i18n_redirected.value || 'en',
      });
      loader
        .importLibrary('maps')
        .then((res) => {
          resolve({
            status: 'success',
            message: 'Google Maps loaded successfully',
            data: res,
          });
        })
        .catch((e) => {
          resolve({
            status: 'error',
            message: 'Error loading Google Maps',
            data: e,
          });
        });
    });
  loadGoogleMaps();
});

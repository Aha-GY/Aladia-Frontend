import axios from 'axios';
import { useToast } from 'vue-toastification';

import * as constant from '~/constant';
import { REQUEST_ERROR_MESSAGE } from '~/constant/request';
import { useAuthStore } from '~/stores/auth';

const showErrorMessage = (error) => {
  const { message } = error;
  if (import.meta.server) {
    return;
  }
  const $toast = useToast();
  return $toast.error(message, {
    position: 'top-right',
  });
};

const service = axios.create({
  timeout: 1000 * 60 * 15,
  withCredentials: true,
});

service.interceptors.request.use(
  (config) => {
    config.baseURL = constant.BASE_API_URL;
    return config;
  },
  (error) => {
    showErrorMessage(error);
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    const authStore = useAuthStore();
    const { message, details, errors, path, statusCode, errorCode } =
      error?.response?.data || {};
    const errDetails = details || errors;
    const errorCodes_403 = [
      REQUEST_ERROR_MESSAGE[403].FREE_TIER_EXHAUSTED.STORAGE_FREE_TIER_FINISHED
        .errorCode,
      REQUEST_ERROR_MESSAGE[403].FREE_TIER_EXHAUSTED
        .STREAMING_FREE_TIER_FINISHED.errorCode,
      REQUEST_ERROR_MESSAGE[403].FREE_TIER_EXHAUSTED.AI_FREE_TIER_FINISHED
        .errorCode,
      REQUEST_ERROR_MESSAGE[403].FAILED_TO_PAY.errorCode,
    ];

    if (status === REQUEST_ERROR_MESSAGE[401].statusCode && authStore.logged) {
      authStore.logout({ noLogoutApi: true });
      showErrorMessage({ message: REQUEST_ERROR_MESSAGE[401].message });
    } else if (errorCode && errorCodes_403.includes(errorCode)) {
      // do nothing handle in the store
      // console.log('------403errorCode------', errorCode);
    } else {
      if (message) {
        const msgVnode = h('div', [
          h(
            'div',
            { class: 'overflow-hidden ', style: 'word-break:break-word' },
            `[${statusCode}] ${message} - ${path}`,
          ),
          errDetails?.map((item) =>
            h('div', { class: 'flex item-center text-white/90' }, [
              h('span', { class: 'text-2xl mr-1 -mb-2' }, '·'),
              h('span', item?.messages?.join(', ')),
            ]),
          ),
        ]);
        showErrorMessage({ message: msgVnode });
      } else {
        showErrorMessage(error);
      }
    }
    return Promise.reject(error);
  },
);

export default service;

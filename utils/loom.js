// loom.js
// document: https://dev.loom.com/docs/record-sdk/getting-started

import { createInstance } from '@loomhq/record-sdk';
import { isSupported } from '@loomhq/record-sdk/is-supported';

// import { useToast } from 'vue-toastification';
import { LOOM_APP_ID, ENV_NAME } from '~/constant';

// const showError = (message) => {
//   if (import.meta.server) return;
//   const $toast = useToast();
//   return $toast.error(message, {
//     position: 'top-right',
//   });
// };

let hasCheckSupported = 'pending'; // 'supported' | 'nosupport' | 'pending'
export default class LoomService {
  static _instance = null;
  constructor(ins) {
    this._instance = ins;
  }

  static async getInstance() {
    if (!LoomService._instance) {
      if (hasCheckSupported === 'nosupport') {
        return hasCheckSupported;
      }

      const { supported, error } = await isSupported();

      if (!supported) {
        // showError(`Error setting up Loom: ${error}`);
        console.log(`Error setting up Loom: ${error}`, error);
        hasCheckSupported = 'nosupport';
        return hasCheckSupported;
      }

      const LOOMINS = await LoomService.setupLoom();

      LoomService._instance = new LoomService(LOOMINS);
      hasCheckSupported = 'supported';
    }
    return LoomService._instance;
  }

  static async setupLoom() {
    const params = {
      publicAppId: LOOM_APP_ID,
      mode: 'standard',
    };

    switch (ENV_NAME) {
      case 'prod':
        params.environment = 'production';
        break;

      case 'develop':
        params.environment = 'production';
        break;

      default:
        break;
    }

    const result = await createInstance(params);

    return result;
  }

  trigger(button, callback) {
    const sdkButton = this._instance?.configureButton({ element: button });

    sdkButton && sdkButton.on('insert-click', callback);
  }
}

// 由于 Loom 数据存在不一致性: https://github.com/Aladia-Frontend/Main-Frontend-Project/issues/2495
// 这里准备了一些工具方法，以便模板处理这些数据
export function isMediaItemLoom(item) {
  // console.log('item', item);
  const url =
    typeof item === 'string' ? item : item?.embedUrl || item?.url || '';
  if (!item || !url) {
    return false;
  }
  if (item?.type === 'loom') {
    return true;
  } else if (url.startsWith('https://www.loom.com/embed/')) {
    return true;
  } else {
    return false;
  }
}

export function getLoomTitle(item) {
  // console.log('item', item);
  const defaultTitle = 'Loom Message';
  if (isMediaItemLoom(item)) {
    return item.title || defaultTitle;
  } else {
    return defaultTitle;
  }
}

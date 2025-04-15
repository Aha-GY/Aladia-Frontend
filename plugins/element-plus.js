import ElementPlus from 'element-plus';

import { defineNuxtPlugin } from '#app';
import 'element-plus/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus);
});

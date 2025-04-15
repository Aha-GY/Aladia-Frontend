import Toast, { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// https://github.com/Maronato/vue-toastification
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    position: 'top-right',
    maxToasts: 20,
    newestOnTop: true,
    // timeout: 300000,
  });

  return {
    provide: {
      toast: useToast(),
    },
  };
});

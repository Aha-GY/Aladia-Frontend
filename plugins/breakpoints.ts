import vuePluginBreakpoints from '@/assets/vue-plugins/breakpoints';

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    nuxtApp.vueApp.use(vuePluginBreakpoints);
    // console.log('[Vue Plugin Breakpoints] Plugin installed!');
  }
});

import VueClipboard from 'vue-clipboard2';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueClipboard);
});

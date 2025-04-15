import { setConfig } from '~/constant';

export default defineNuxtPlugin(() => {
  const { BRANCH_NAME } = useRuntimeConfig().public;
  setConfig({ BRANCH_NAME });
});

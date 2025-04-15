<template>
  <NuxtLoadingIndicator :height="2" />
  <NuxtPage />
  <BaseSplash />
  <client-only>
    <LazyAuth />
    <LazyPaymentCheckout v-if="authStore.logged" />
    <LazyAuthGoogle v-if="!authStore.logged" />
    <LazyBaseVconsole v-if="$device.isMobile" />
    <LazyPaymentAddCardDialog v-if="authStore.logged" />
    <LazyFluxesReelPopup v-if="fluxesStore.reelPopup.state" />
    <LazyFluxesStoryPopup v-if="fluxesStore.storyPopup.state" />
    <LazyPostsPopupAttachment v-if="socialStore.attachmentPopupVisible" />
    <LazyCommonFullscreenPreview />
  </client-only>
</template>

<script setup>
const authStore = useAuthStore();
const appStore = useAppStore();
const fluxesStore = useFluxesStore();
const globalStore = useGlobalStore();
const socialStore = useSocialStore();

useUserAgentWatch();
useMentionLink();

onBeforeMount(() => {
  globalStore.getLanguages();
  if (authStore.logged) {
    authStore.getInfo();
    appStore.checkOnline();
  }
});
</script>

<template>
  <div
    class="fixed inset-0 z-[999] flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#101010]"
  >
    <div
      v-if="reelPreview.loading"
      class="absolute inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-80"
    >
      <BaseSpinner />
    </div>
    <FluxesReelPreviewWrapper v-else :id="reelId" />
    <FluxesCreation v-if="fluxesStore.creationVisible" />
  </div>
</template>
<script setup>
const route = useRoute();
const fluxesStore = useFluxesStore();

const reelPreview = computed(() => fluxesStore.reelPreview);
fluxesStore.reelPreview.visible = true;

const reelId = computed(
  () => route.params.reel_Id || fluxesStore.reelPopup.reel_Id,
);

useEventListener(window, 'popstate', () => {
  if (!location.pathname.startsWith('/reels/')) {
    fluxesStore.reelPopup.state = false;
    fluxesStore.reelPreview.visible = false;
  }
});
</script>

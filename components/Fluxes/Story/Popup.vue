<template>
  <div
    class="fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#101010]"
  >
    <div
      v-if="storiesPreview.loading"
      class="absolute inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-80"
    >
      <BaseSpinner />
    </div>
    <FluxesPreviewStoryWrapper
      v-else
      :id="userId"
      :story-id="storyId"
      :source="source"
    />
    <FluxesCreation v-if="fluxesStore.creationVisible" />
    <SocialContextSwitchPopup />
  </div>
</template>

<script setup>
const route = useRoute();
const fluxesStore = useFluxesStore();
const storiesPreview = computed(() => fluxesStore.storiesPreview);

const userId = computed(
  () => route.params.user_id || fluxesStore.storyPopup.user_id,
);

const storyId = computed(
  () => route.params.story_id || fluxesStore.storyPopup.story_id,
);

const source = computed(() =>
  fluxesStore.storyPopup.isHighlight ? 'highlight' : 'stories',
);

useEventListener(window, 'popstate', () => {
  if (!location.pathname.startsWith('/stories/')) {
    fluxesStore.storyPopup.state = false;
  }
});
</script>

<template>
  <Head>
    <Title>Aladia - Highlight Stories</Title>
  </Head>
  <div
    class="!z-[109] flex h-screen w-screen items-center justify-center bg-[#101010]"
    data-cy="390133433d0025de"
  >
    <div
      ref="wrapperContent"
      class="flex h-full w-full flex-col items-center justify-center overflow-hidden"
    >
      <div
        v-if="storiesPreview.loading"
        class="absolute inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-80"
      >
        <BaseSpinner />
      </div>
      <FluxesPreviewStoryWrapper
        v-else
        :id="highlightId"
        :story-id="storyId"
        source="highlight"
      />
      <FluxesCreation v-if="fluxesStore.creationVisible" />
      <SocialContextSwitchPopup />
    </div>
  </div>
</template>
<script setup>
const route = useRoute();
const fluxesStore = useFluxesStore();
const storiesPreview = computed(() => fluxesStore.storiesPreview);
const highlightId = route.params.highlightId;
const storyId = route.params.story_id;
</script>

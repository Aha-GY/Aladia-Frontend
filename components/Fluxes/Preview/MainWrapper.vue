<!-- eslint-disable vue/require-toggle-inside-transition -->
<template>
  <Transition name="slide-fade-in" mode="out-in">
    <div>
      <div
        v-if="storiesPreview.visible"
        ref="previewWrapper"
        class="__story-preview fixed bottom-0 left-0 right-0 top-0 flex items-center bg-[#101010]"
        :class="storiesPreview.isCreatePreview ? 'z-[102]' : 'z-[10000]'"
        data-cy="390133433d0025de"
        @click="closeStories($event)"
      >
        <div
          ref="wrapperContent"
          class="flex h-full w-full items-center overflow-hidden"
        >
          <div
            v-if="storiesPreview.loading"
            v-loading="storiesPreview.loading"
            class="h-screen w-screen"
          />
          <FluxesPreviewStoryWrapper
            v-else-if="storiesPreview.isCreatePreview"
            :id="storiesPreview.id"
            :story-id="storiesPreview.storyId"
          />
          <FluxesPreviewMainSlider v-else ref="storiesMainSlider" />
        </div>
      </div>
      <div v-else />
    </div>
  </Transition>
</template>

<script setup>
const fluxesStore = useFluxesStore();

const storiesPreview = computed(() => fluxesStore.storiesPreview);

const wrapperContent = ref(null);
const storiesMainSlider = ref(null);
const previewWrapper = ref(null);

const closeStories = (e) => {
  const storiesSlider = storiesMainSlider.value?.$refs.storiesMainSlider.$el;
  const storiesSliderWrapper =
    storiesMainSlider.value?.$refs.storiesMainSlider.$el.firstElementChild;

  e.target === wrapperContent.value ||
  e.target === storiesSlider ||
  e.target === storiesSliderWrapper
    ? storiesMainSlider.value.closeStory()
    : false;
};

watch(
  () => storiesPreview.value.visible,
  (value) => {
    nextTick(() => {
      if (value) {
        disableScroll(previewWrapper.value);
      } else {
        enableAllScroll();
      }
    });
  },
);
</script>

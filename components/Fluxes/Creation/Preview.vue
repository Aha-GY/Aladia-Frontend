<template>
  <div class="relative flex h-[80vh] flex-col">
    <FluxesCreationHeader />
    <div
      class="h-[calc(100%-4rem)] flex-1 rounded-b-lg border-[1px] border-t-0 border-white/10 bg-[#060606]"
    >
      <div class="h-full w-[90vw] overflow-hidden lg:w-[63.5rem] 2xl:w-[75rem]">
        <Transition name="slide-fade-in" mode="out-in">
          <FluxesCreationStoryMain v-if="fluxesStore.creationTab === 'story'" />
          <FluxesCreationReel v-else-if="fluxesStore.creationTab === 'reel'" />
          <FluxesCreationHighLight v-else />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const fluxesStore = useFluxesStore();
    return { fluxesStore };
  },
};
</script>

<style lang="scss">
.pintura-editor-wrapper {
  .pintura-editor {
    border-color: #e0b92c;
    border-radius: 0;
    background: #060606;
  }
}
.pintura-editor-without-border {
  .pintura-editor {
    border-color: transparent !important;
    border-radius: 0 !important;
    background: #060606 !important;
  }
}
</style>

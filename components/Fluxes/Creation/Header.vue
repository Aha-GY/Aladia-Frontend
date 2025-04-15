<template>
  <div
    class="flex h-[3.5rem] flex-row items-center justify-between rounded-t-lg border-[1px] border-b-0 border-white/10 bg-[#0C0C0C] p-4"
  >
    <div
      class="flex items-center justify-center gap-6 border-b border-transparent"
    >
      <div
        v-for="menu in menus"
        :key="menu.value"
        class="flex cursor-pointer items-center justify-center border-b px-6 text-sm leading-6 transition-all"
        :class="
          fluxesStore.creationTab === menu.value
            ? 'border-[#E0B92C] text-base font-medium text-[#E0B92C]'
            : 'border-transparent font-normal text-[#707070] hover:border-[#D9D9D9] hover:text-[#D9D9D9]'
        "
        :data-cy="`${menu.label}-tab-button`"
        @click="handleClick(menu.value)"
      >
        {{ menu.label }}
      </div>
    </div>
    <div class="flex items-center gap-2">
      <!-- <FluxesCreationVisibility
        :active="fluxesStore.creationVisibility"
        @select="handleSelectVisible"
      /> -->
      <BaseIconClose data-cy="57ab683b6cbefdc4" @click="onClose" />
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const fluxesStore = useFluxesStore();
    return { fluxesStore };
  },
  data() {
    return {
      menus: [
        {
          label: 'Story',
          value: 'story',
        },
        {
          label: 'Reel',
          value: 'reel',
        },
        {
          label: 'Highlight',
          value: 'highlight',
        },
      ],
    };
  },
  methods: {
    onClose() {
      if (this.fluxesStore.hasActiveProgress()) {
        this.fluxesStore.closePopupCheck = true;
        return;
      }
      this.fluxesStore.resetCreationStories();
      this.fluxesStore.resetCreationReels();
      this.fluxesStore.resetHighlightCreation();
      this.fluxesStore.currentUserStories = [];
      this.fluxesStore.storyIsPublished = false;
      this.fluxesStore.deletedStoryList = [];
    },
    handleSelectVisible(type) {
      this.fluxesStore.creationVisibility = type;
    },
    handleClick(menu) {
      if (this.fluxesStore.hasActiveProgress()) {
        this.fluxesStore.tempCreationTab = menu;
        this.fluxesStore.closePopupCheck = true;
        return;
      }
      this.fluxesStore.creationTab = menu;
    },
  },
};
</script>

<template>
  <client-only>
    <el-dialog
      ref="creationDialog"
      v-model="fluxesStore.creationVisible"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="fit-content"
      class="!absolute bottom-0 left-0 right-0 top-0 !m-[auto] h-fit !rounded-lg !bg-transparent md:!w-fit"
    >
      <FluxesCreationPreview />
    </el-dialog>
    <el-dialog
      v-model="fluxesStore.closePopupCheck"
      :show-close="false"
      append-to-body
      destroy-on-close
      width="24rem"
    >
      <div class="flex flex-col">
        <div
          class="flex items-center justify-between rounded-t-sm bg-white/5 p-3"
        >
          <div class="flex items-center gap-2 text-sm">
            <i class="fa-regular fa-floppy-disk" />
            {{ $t('course.changeConfirmation.title') }}
          </div>
          <BaseIconClose @click="fluxesStore.closePopupCheck = false" />
        </div>
        <div
          class="flex flex-col gap-5 px-5 py-7 text-sm font-light text-white/70"
        >
          <div>{{ $t('course.changeConfirmation.contentOne') }}</div>
          <div>{{ $t('course.changeConfirmation.contentTwo') }}</div>
        </div>
        <div class="flex items-center justify-end gap-4 p-3">
          <BaseButton
            type="tertiary"
            :label="$t('course.changeConfirmation.quit')"
            icon="fa-regular fa-arrow-left-from-bracket"
            @click="onCancel"
          />

          <BaseButton
            :label="$t('payment.continue')"
            icon="fa-solid fa-edit"
            @click="onContinueEditing"
          />
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>

<script>
export default {
  setup() {
    const fluxesStore = useFluxesStore();
    const creationDialog = ref(null);
    const isClickOutSide = ref(false);

    onClickOutside(
      creationDialog,
      () => {
        if (fluxesStore.hasActiveProgress()) {
          isClickOutSide.value = true;
          fluxesStore.closePopupCheck = true;
        } else {
          fluxesStore.creationVisible = false;
          fluxesStore.creationTab = 'story';
        }
      },
      {
        ignore: ['.el-dialog', '.el-popper', '.__story-preview'],
      },
    );

    return { fluxesStore, creationDialog, isClickOutSide };
  },
  methods: {
    onCancel() {
      this.fluxesStore.closePopupCheck = false;
      this.fluxesStore.storyIsPublished = false;
      if (this.fluxesStore.creationTab === 'highlight') {
        // remove if we have an uploaded stories
        this.handleRemovingHighlightTab();
      } else if (this.fluxesStore.creationTab === 'reel') {
        // reset the reel status
        this.fluxesStore.resetCreationReels(
          this.fluxesStore.creationTab,
          !this.isClickOutSide,
        );
      } else {
        this.fluxesStore.storyVisibility = 'public';
      }

      if (this.isClickOutSide) {
        // if click outside the popup close the popup
        this.fluxesStore.creationVisible = false;
        this.this.fluxesStore.creationTab = 'story';
        this.isClickOutSide = false;
      } else {
        // if not outside don't close the popup
        if (this.fluxesStore.tempCreationTab) {
          // if switching tab

          this.fluxesStore.creationTab = this.fluxesStore.tempCreationTab;
          this.fluxesStore.tempCreationTab = null;
        } else {
          // not switching tab close the popup
          this.handelClose();
        }
      }
    },
    onContinueEditing() {
      this.fluxesStore.closePopupCheck = false;
    },
    handleRemovingHighlightTab() {
      const data = [];
      this.fluxesStore.createMediaList.data.forEach((item) => {
        data.push(item.id);
      });
      if (
        !this.fluxesStore.storyIsPublished &&
        data.length &&
        !this.fluxesStore.createMediaList.isFromHighlight
      ) {
        this.fluxesStore.deleteAllStories(data);
      }
    },
    handelClose() {
      this.fluxesStore.resetCreationStories();
      this.fluxesStore.resetCreationReels();
      this.fluxesStore.resetHighlightCreation();
      this.fluxesStore.currentUserStories = [];
      this.fluxesStore.storyIsPublished = false;
      this.fluxesStore.deletedStoryList = [];
      this.fluxesStore.creationVisible = false;
    },
  },
};
</script>

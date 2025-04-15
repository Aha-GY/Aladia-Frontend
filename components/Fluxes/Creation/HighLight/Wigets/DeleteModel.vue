<template>
  <div
    class="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-black/20"
  >
    <div
      class="w-full rounded-5 border-[0.5px] border-[#ffffff]/20 bg-black p-3 md:w-[25rem]"
    >
      <div class="mb-5 flex items-center justify-between text-sm">
        <div class="flex items-center gap-3">
          <i class="fa-sharp fa-solid fa-trash" />
          {{ $t('flux.highlight.story.delete.confirm') }}
        </div>
        <BaseIconClose data-cy="80a1c48728fc98db" @click="$emit('close')" />
      </div>
      <div class="mb-5 text-sm text-white/50">
        {{ $t('flux.highlight.story.delete.description') }}
      </div>
      <div class="flex justify-end">
        <BaseButton
          type="error"
          class="font-medium"
          data-cy="b3b93185b301c880"
          @click="handleDeleteStory"
        >
          <i
            v-if="fluxesStore.deleteStory.loading"
            class="fa-light fa-loader animate-spin text-base"
          />
          {{ $t('flux.highlight.story.delete.title') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const fluxesStore = useFluxesStore();
    const profileStore = useProfileStore();

    return { fluxesStore, profileStore };
  },
  methods: {
    async handleDeleteStory() {
      try {
        this.fluxesStore.deleteStory.loading = true;
        if (
          !this.fluxesStore.deleteStory.item._isFromGallery &&
          !this.fluxesStore.createMediaList.editingHighlightId
        ) {
          await this.fluxesStore.deleteStories(
            this.fluxesStore.deleteStory.item.id,
          );
        }
        this.fluxesStore.createMediaList.data =
          this.fluxesStore.createMediaList.data.filter(
            (item) => item.id !== this.fluxesStore.deleteStory.item.id,
          );

        this.fluxesStore.currentUserStories =
          this.fluxesStore.currentUserStories.filter(
            (item) => item.id !== this.fluxesStore.deleteStory.item.id,
          );
        this.fluxesStore.onceGetLastestStories();
        if (this.fluxesStore.currentUserStories.length === 0) {
          // This is to refresh the story list and profile data based on source page
          if (!this.fluxesStore.sourcePageIsProfile) {
            this.getLatestStories();
          }
          this.profileStore.fetchProfile(this.profileStore.myProfileDetail);
        }

        if (this.fluxesStore.createMediaList.editingHighlightId) {
          this.fluxesStore.deletedStoryList.push(
            this.fluxesStore.deleteStory.item.id,
          );
        }
        this.$toast.success(this.$t('post.highlight.delete.success'));
        this.$emit('close');
      } finally {
        this.fluxesStore.deleteStory.loading = false;
        this.fluxesStore.deleteStory.visible = false;
      }
    },
    async getLatestStories() {
      this.fluxesStore.storiesData.data = [];
      this.fluxesStore.storiesData.next = null;
      this.fluxesStore.storiesData.loading = false;
      this.fluxesStore.storiesData.totalItems = 0;
      await this.fluxesStore.getLastestStories();
    },
  },
};
</script>

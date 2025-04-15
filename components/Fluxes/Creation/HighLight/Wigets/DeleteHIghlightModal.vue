<template>
  <div
    class="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-black/40"
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
        {{ $t('post.highlight.delete.content') }}
        <br />
        {{ $t('post.highlight.delete.dialog') }}
      </div>
      <div class="flex justify-end">
        <BaseButton
          type="error"
          class="font-medium"
          data-cy="b3b93185b301c880"
          @click="handleDeleteStory"
        >
          <i
            v-if="fluxesStore.deleteHighlight.loading"
            class="fa-light fa-loader animate-spin text-base"
          />
          {{ $t('post.highlight.delete.label') }}
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
        this.fluxesStore.deleteHighlight.loading = true;
        this.fluxesStore.storyIsPublished = false;

        if (!this.fluxesStore.deleteHighlight.item._isFromGallery) {
          await this.fluxesStore.deleteStoryGroup({
            id: this.fluxesStore.deleteHighlight.item,
          });
        }
        if (this.fluxesStore.storiesPreview.data.length === 1) {
          this.profileStore.gotoProfilePage({
            id: this.profileStore.myProfileDetail.id,
            entityType: this.profileStore.myProfileDetail?.type,
          });
        }
        this.fluxesStore.storiesPreview.data =
          this.fluxesStore.storiesPreview.data.filter(
            (item) => item.id !== this.fluxesStore.deleteHighlight.item,
          );
        this.$toast.success(this.$t('post.highlight.delete.success'));
        this.$emit('close');
      } finally {
        this.fluxesStore.deleteHighlight.loading = false;
      }
    },
  },
};
</script>

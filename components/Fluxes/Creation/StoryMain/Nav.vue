<template>
  <div class="relative w-full flex-1">
    <div
      class="flex h-full w-full items-center justify-center border-[1px] border-dashed border-[#E0B92C]"
    >
      <div
        class="mx-3 flex w-[12.375rem] flex-none items-center justify-center text-xl text-[#FAFAFA]"
      >
        <div
          class="flex aspect-[9/16] w-full cursor-pointer items-center justify-center rounded-5 border-[1px] border-white/40 transition-all duration-300"
        >
          <div class="flex flex-col gap-4 text-center">
            <BaseButton type="tertiary" class="!opacity-100">
              <span class="w-[1rem]">
                <i class="fa-regular fa-photo-film" />
              </span>
              <span>{{ $t('base.upload.media') }}</span>
              <input
                ref="file"
                type="file"
                accept="image/*,video/*"
                class="absolute inset-0 z-10 opacity-0"
                data-cy="baec569824bf2923"
                @change="uploadMedia"
              />
            </BaseButton>
            <BaseButton
              type="tertiary"
              class="!opacity-100"
              data-cy="0301b56158c2c519"
              @click="handleCreateStory('text')"
            >
              <span class="w-[1rem]">
                <i class="fa-regular fa-plus" />
              </span>
              <span>{{ $t('flux.highlight.story.blank.title') }}</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-end gap-5 p-4">
    <BaseButton type="tertiary" data-cy="66514fdc5ec8230e" @click="handleClose">
      {{ $t('flux.discard') }}
    </BaseButton>
    <BaseButton
      :disabled="true"
      class="!bg-[#737373]/[0.3] font-medium !text-[#D4D4D4]"
    >
      {{ $t('flux.publish') }}
    </BaseButton>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const fluxesStore = useFluxesStore();
    return { authStore, fluxesStore };
  },
  methods: {
    handleCreateStory(type) {
      this.fluxesStore.isCreatingStory = true;
      this.fluxesStore.storyType = type;
    },
    async getMediaUrl(file) {
      return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
          resolve(this.result);
        };
      });
    },
    async uploadMedia(event) {
      const file = event.target.files[0];
      if (!(file.type.startsWith('image/') || file.type.startsWith('video/'))) {
        return this.$toast.error(this.$t('base.upload.error'));
      }

      if (file.type.startsWith('image/')) {
        if (file.size > 1024 * 1024 * 6) {
          this.$toast.error(
            this.$t('flux.error.image.limit.exceed', { size: '6MB' }),
          );
          return false;
        }

        this.fluxesStore.createMediaStory.type = 'image';
      }

      if (file.type.startsWith('video/')) {
        if (file.size > 1024 * 1024 * 30) {
          this.$toast.error(
            this.$t('flux.error.image.limit.exceed', { size: '30MB' }),
          );
          return false;
        }

        this.fluxesStore.createMediaStory.type = 'video';
      }

      file.src = await this.getMediaUrl(file);

      this.fluxesStore.createMediaStory.file = file;

      this.handleCreateStory('media');

      event.target.value = '';
    },
    handleClose() {
      this.fluxesStore.resetCreationStories();
    },
  },
};
</script>

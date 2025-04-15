<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div
      class="flex h-full w-full items-center justify-center border border-dashed border-[#E0B92C] md:h-[90%]"
    >
      <div
        v-if="fluxesStore.createMediaReel.file"
        class="h-full w-full flex-1 shrink-0"
      >
        <div
          v-loading="createLoading"
          class="relative flex h-full w-full items-center rounded-5 transition-colors"
        >
          <div class="absolute bottom-0 left-0 right-0 top-0">
            <FluxesCreationMediaStoryVideoEditor
              ref="videoEditor"
              :src="mediaData.file.src || mediaData.file.url"
              :options="options"
              :file="mediaData.file"
              :url="mediaData.file.src || mediaData.file.url"
              @set-cover="$emit('setCover', $event)"
            />
          </div>
        </div>
      </div>
      <div
        v-else
        class="mx-3 flex w-[12.375rem] flex-none items-center justify-center text-xl text-[#FAFAFA]"
      >
        <div
          class="flex aspect-[9/16] w-full cursor-pointer items-center justify-center rounded-5 border border-white/40 transition-all duration-300"
        >
          <div class="flex flex-col gap-4 text-center">
            <BaseButton type="tertiary" class="!opacity-100">
              <span class="w-[1rem]">
                <i class="fa-regular fa-photo-film" />
              </span>
              <span>Upload media</span>
              <input
                ref="file"
                type="file"
                :data-cy="`${dataCy}-media-input`"
                accept="image/*,video/*"
                class="absolute inset-0 z-10 opacity-0"
                @change="handleChange"
              />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div class="flex w-full items-center justify-end gap-5 pt-4">
      <BaseButton type="tertiary" @click="handleBackNav">Discard</BaseButton>

      <BaseButton
        label="Upload Media"
        type="outline"
        icon="fa-regular fa-photo-film"
      >
        <input
          ref="file"
          type="file"
          accept="video/*"
          class="absolute inset-0 z-10 opacity-0"
          @change="handleChange"
        />
      </BaseButton>
      <BaseButton
        :disabled="isDisabled"
        :data-cy="`${dataCy}-publish-button`"
        @click="handlePublish"
      >
        <i
          v-if="fluxesStore.createMediaReel.loading"
          class="fa-light fa-loader animate-spin"
        />
        {{
          fluxesStore.isEditingReel
            ? $t('base.editor.update')
            : $t('flux.publish')
        }}
      </BaseButton>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    dataCy: {
      type: String,
      default: 'default-reel-editor',
    },
  },
  setup() {
    const fluxesStore = useFluxesStore();
    const socialStore = useSocialStore();
    return { socialStore, fluxesStore };
  },
  data() {
    return {
      options: {
        rounded: true,
        imageCropAspectRatio: 9 / 16,
        cropSelectPresetOptions: [],
      },
      createLoading: false,
      mockFile: null,
    };
  },
  computed: {
    mediaData() {
      return this.fluxesStore.createMediaReel;
    },
    currReelItem() {
      return this.fluxesStore.currReelItem;
    },
    isDisabled() {
      if (this.fluxesStore.createMediaReel.file) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    async handleChange(event) {
      this.$emit('mediaUpload', event);
    },
    handleBackNav() {
      this.$emit('back');
    },
    async handlePublish() {
      if (this.fluxesStore.isEditingReel) {
        this.fluxesStore.createMediaReel.loading = true;

        if (this.fluxesStore.isNewReelMedia) {
          const file = await this.$refs.videoEditor.getCurrentImg();
          if (!file) {
            this.createLoading = false;
            return;
          }
          const { files } = file;
          this.$emit('publishMediaReel', files);
        } else {
          this.$emit('publishMediaReel', this.fluxesStore.createMediaReel.file);
        }
      } else {
        try {
          this.fluxesStore.createMediaReel.loading = true;
          const file = await this.$refs.videoEditor.getCurrentImg();
          if (!file) {
            this.createLoading = false;
            return;
          }
          const { files } = file;

          this.$emit('publishMediaReel', files);
        } finally {
          this.fluxesStore.createMediaReel.loading = false;
        }
      }
    },
  },
};
</script>

<template>
  <div class="relative flex h-full w-full flex-col items-center justify-center">
    <div class="h-full w-full flex-1 shrink-0">
      <div
        class="relative flex h-full w-full items-center rounded-5 transition-colors"
      >
        <div class="absolute bottom-0 left-0 right-0 top-0">
          <FluxesCreationMediaStoryImageEditor
            v-if="isImage"
            ref="imageEditor"
            :class="withoutFooter ? 'pintura-editor-without-border' : ''"
            :options="options"
            :file="mediaData.file"
            :url="mediaData.file?.src || mediaData.file?.url"
            :is-edit="isEdit"
            :image-state="mediaData.imageState"
            @ready="show = true"
          />
          <FluxesCreationHighLightWigetsVideoEditor
            v-if="isVideo"
            ref="imageEditor"
            :class="withoutFooter ? 'pintura-editor-without-border' : ''"
            :options="options"
            :file="mediaData.file"
            :url="mediaData.file?.src || mediaData.file?.url"
            :is-edit="isEdit"
            :image-state="mediaData.imageState"
            @ready="show = true"
          />
        </div>
      </div>
    </div>

    <div v-if="withoutFooter && showButton">
      <template v-if="show">
        <div
          class="absolute left-[50%] top-[0.875rem] z-10 h-[1.875rem] w-[1.875rem] translate-x-[calc(-50%-120px)] cursor-pointer"
          data-cy="a2fced3528c20c5c"
          @click="handleBack"
        >
          <i class="fa-solid fa-xmark text-[#ED3C28]" />
        </div>
        <div
          class="absolute right-[50%] top-[0.875rem] z-10 h-[1.875rem] w-[1.875rem] translate-x-[calc(-50%+160px)] cursor-pointer"
          data-cy="bfe721fd736ba81b"
          @click="handleSave"
        >
          <i
            v-if="fluxesStore.createMediaStory.loading"
            class="fa-light fa-loader animate-spin text-base"
          />
          <i v-else class="fa-solid fa-check text-[#35A823]" />
        </div>
      </template>
    </div>
    <div
      v-else-if="showButton"
      class="flex w-full items-center justify-end gap-4 rounded-5 bg-[#0c0c0c] pt-4"
    >
      <BaseButton
        type="tertiary"
        data-cy="906165a144732e84"
        @click="handleBack"
      >
        {{ $t('base.upload.cancel') }}
      </BaseButton>
      <BaseButton data-cy="56c4f5d3557ed433" @click="handleSave">
        <div class="flex size-3 items-center justify-center">
          <i
            v-if="fluxesStore.createMediaStory.loading"
            class="fa-light fa-loader animate-spin text-base"
          />
          <i v-else class="fa-solid fa-save text-sm" />
        </div>
        {{ $t('flux.save') }}
      </BaseButton>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    withoutFooter: Boolean,
    isEdit: Boolean,
    showButton: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const fluxesStore = useFluxesStore();
    return { fluxesStore };
  },
  data() {
    return {
      options: {
        rounded: true,
        imageCropAspectRatio: 9 / 16,
        cropSelectPresetOptions: [],
        imageCropMinSize: { width: 200, height: 356 },
      },
      show: false,
    };
  },
  computed: {
    mediaData() {
      return this.fluxesStore.createMediaStory;
    },
    isImage() {
      return this.fluxesStore.createMediaStory.type === 'image';
    },
    isVideo() {
      return this.fluxesStore.createMediaStory.type === 'video';
    },
  },
  mounted() {
    this.fluxesStore.createMediaList.loading = false;
  },
  methods: {
    handleBack() {
      this.fluxesStore.resetMediaStory();
      this.$emit('close');
    },
    async handleSave() {
      this.fluxesStore.createMediaStory.loading = true;
      if (this.isImage) {
        await this.handleImage();
      }

      if (this.isVideo) {
        await this.handleVideo();
      }
    },
    async getMediaUrl(file) {
      return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        resolve(url);
      });
    },
    async handleVideo() {
      try {
        const file = await this.$refs.imageEditor.getCurrentImg();

        if (!file) {
          this.fluxesStore.createMediaStory.loading = false;
          return;
        }
        const { imageState, info } = file;

        const params = {
          visibility: this.fluxesStore.creationVisibility,
          imageState: imageState[imageState.length - 1],
        };

        if (info) {
          const { fileId } = await upload({ file: info.blob });

          params.cover = {
            fileId,
            metadata: {
              mimetype: info.blob.type,
              size: info.blob.size,
              name: this.mediaData.file.name,
            },
          };
        }

        this.$emit('createMediaStory', params, this.mediaData.file, 'video');
      } catch (error) {
        this.fluxesStore.createMediaStory.loading = false;
        this.$toast.error(
          error.message ||
            error.error.message ||
            this.$t('flux.error.image.failed.process'),
        );
      }
    },
    async handleImage() {
      try {
        const file = await this.$refs.imageEditor.getCurrentImg();

        if (!file) {
          this.fluxesStore.createMediaStory.loading = false;
          return;
        }
        const { imageState } = file;

        const { fileId } = await upload({ file: imageState });
        const files = [
          {
            fileId,
            metadata: {
              mimetype: imageState.type,
              size: imageState.size,
              name: imageState.name,
            },
          },
        ];

        const params = {
          visibility: this.fluxesStore.creationVisibility,
          files,
        };

        this.$emit('createMediaStory', params, file, 'image');
      } catch (error) {
        this.fluxesStore.createMediaStory.loading = false;
        this.$toast.error(
          error.message ||
            error.error.message ||
            this.$t('flux.error.image.failed.process'),
        );
      }
    },
  },
};
</script>

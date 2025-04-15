<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="h-full w-full flex-1 shrink-0 p-4">
      <div
        v-loading="createloading"
        class="relative flex h-full w-full items-center rounded-5 transition-colors"
      >
        <div class="absolute bottom-0 left-0 right-0 top-0">
          <FluxesCreationMediaStoryImageEditor
            v-if="isImage"
            ref="imageEditor"
            :options="options"
            :file="mediaData.file"
            :url="mediaData.file.src || mediaData.file.url"
          />
          <FluxesCreationMediaStoryVideoEditor
            v-if="isVideo"
            ref="imageEditor"
            :src="mediaData.file.src || mediaData.file.url"
            :options="options"
            :file="mediaData.file"
            :url="mediaData.file.src || mediaData.file.url"
          />
        </div>
      </div>
    </div>
    <div class="flex w-full items-center justify-end gap-5 p-4">
      <BaseButton
        type="tertiary"
        data-cy="e1eb4f1b54a88aaa"
        @click="handleBackNav"
      >
        {{ $t('flux.discard') }}
      </BaseButton>
      <BaseButton data-cy="d89a74dbdd61e7f7" @click="handleSave">
        <i
          v-if="fluxesStore.createMediaStory.loading"
          class="fa-light fa-loader animate-spin"
        />
        {{ $t('flux.publish') }}
      </BaseButton>
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
      options: {
        rounded: true,
        imageCropAspectRatio: 9 / 16,
        cropSelectPresetOptions: [],
        // imageCropMinSize: { width: 200, height: 200 },
      },
      createloading: false,
      mockFile: null,
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
  methods: {
    handleBackNav() {
      this.fluxesStore.resetMediaStory();
      this.$emit('back');
    },
    async handleSave() {
      try {
        this.fluxesStore.createMediaStory.loading = true;

        const file = await this.$refs.imageEditor.getCurrentImg();

        if (!file) {
          this.createloading = false;
          return;
        }

        if (this.isImage) {
          const { dest, imageState } = file;

          const files = [];

          let text = '';
          if (imageState?.annotation?.length) {
            imageState?.annotation.forEach((annotation) => {
              text += annotation.text || '';
            });
          }
          const { fileId } = await upload({ file: dest });

          const url = await this.getMediaUrl(dest);

          files.push({
            fileId,
            metadata: {
              mimetype: dest.type,
              size: dest.size,
              name: dest.name,
            },
            url,
          });

          const params = {
            // source: 'platform-story',
            content: text,
            visibility: this.fluxesStore.creationVisibility,
            files,
          };

          this.$emit('createMediaStory', params);
        }

        if (this.isVideo) {
          const { imageState, info, files } = file;

          const params = {
            // source: 'platform-story',
            visibility: this.fluxesStore.creationVisibility,
            files,
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

          this.$emit('createMediaStory', params);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getMediaUrl(file) {
      return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        resolve(url);
      });
    },
  },
};
</script>

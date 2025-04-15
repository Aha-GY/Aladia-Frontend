<template>
  <div class="relative h-full w-full flex-1">
    <div
      class="flex h-full w-full items-center justify-center border border-dashed border-[#E0B92C] md:h-[90%]"
    >
      <div
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
                @change="uploadMedia"
              />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!fluxesStore.createMediaReel?.uploadOpen"
      class="absolute bottom-0 right-0 flex items-end justify-center gap-4 rounded-5 pl-5"
    >
      <div class="flex items-center justify-end gap-4">
        <BaseButton type="tertiary" @click="handleClose">Discard</BaseButton>
        <BaseButton
          label="Upload Media"
          type="outline"
          icon="fa-regular fa-photo-film"
          @click="uploadMedia"
        >
          <input
            ref="file"
            type="file"
            accept="video/*"
            class="absolute inset-0 z-10 opacity-0"
            @change="uploadMedia"
          />
        </BaseButton>
        <BaseButton :disabled="true" label="Publish" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    uploadedFile: {
      type: Object,
      default: null,
    },
    dataCy: {
      type: String,
      default: 'default-reel-nav',
    },
  },
  setup() {
    const authStore = useAuthStore();
    const fluxesStore = useFluxesStore();
    return { authStore, fluxesStore };
  },
  watch: {
    uploadedFile(newFile) {
      if (newFile) {
        this.uploadMediaFile(newFile); // Handle the file as you would in the uploadMedia method
      }
    },
  },
  mounted() {
    if (this.fluxesStore.currentReelFile?.file) {
      this.uploadMediaFileFromUrl(this.fluxesStore.currentReelFile.file);
    }
  },
  methods: {
    // Handle file upload when URL is provided (e.g., signed Google Storage URL)
    async uploadMediaFileFromUrl(url) {
      if (!url) {
        return;
      }

      // In this case, we treat the URL directly without re-uploading
      this.fluxesStore.createMediaReel.file = { src: url };
      this.fluxesStore.isCreatingReal = true;
      this.fluxesStore.createMediaReel.metadata = {
        mimetype: 'video/mp4', // You can adjust mimetype based on actual video type
        size: null, // You can update the size if known
        name: 'video.mp4', // You can set the name of the video if known
      };
      this.fluxesStore.createMediaReel.uploadOpen = true;

      // this.fluxesStore.currentReelFile = null;
    },

    // This method remains for handling file uploads
    async uploadMediaFile(file) {
      if (!file) {
        return;
      }

      // Check if the file is a video (optional)
      if (!file.type.startsWith('video/')) {
        return this.$toast.error('Only video files are allowed');
      }

      // Handle file upload progress
      if (file.size > 1024 * 1024 * 30) {
        this.$toast.error('The video size should not exceed 30MB');
        return false;
      }

      // Process the file (just like in uploadMedia)
      file.src = await this.getMediaUrl(file);
      this.fluxesStore.createMediaReel.file = file;
      this.fluxesStore.isCreatingReal = true;
      this.fluxesStore.createMediaReel.metadata = {
        mimetype: file.type,
        size: file.size,
        name: file.name,
      };
      this.fluxesStore.createMediaReel.uploadOpen = true;
    },
    handleCreateReal() {
      this.fluxesStore.isCreatingReal = true;
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

      if (!file.type.startsWith('video/')) {
        return this.$toast.error(this.$t('course.upload.error.video'));
      }

      if (file.type.startsWith('video/')) {
        if (file.size > 1024 * 1024 * 30) {
          this.$toast.error('The video size should not exceed 30MB');
          return false;
        }
      }
      file.src = await this.getMediaUrl(file);
      this.fluxesStore.createMediaReel.file = file;
      this.fluxesStore.isCreatingReal = true;
      this.fluxesStore.createMediaReel.metadata = {
        mimetype: file.type,
        size: file.size,
        name: file.name,
      };
      this.fluxesStore.createMediaReel.uploadOpen = true;

      event.target.value = '';
    },
    handleClose() {
      this.fluxesStore.resetCreationReels();
    },
  },
};
</script>

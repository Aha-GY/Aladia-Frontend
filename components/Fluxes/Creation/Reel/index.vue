<template>
  <div class="flex h-full w-full flex-col">
    <div
      class="flex w-full flex-1 flex-col items-center overflow-y-auto p-4 md:gap-3 lg:flex-row"
    >
      <div
        class="relative flex h-screen w-full shrink-0 flex-col gap-4 rounded-5 md:h-full md:w-[18.125rem]"
      >
        <BaseAvatarSwitchVisiblity
          :visbility="fluxesStore.createMediaList.visibility"
          @select="handleSelectVisible"
        />

        <div class="__cover-preview-box h-96 rounded-5">
          <div
            class="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[0.313rem] bg-[#141414cc] px-10"
            :style="{ background: bg }"
          >
            <div
              class="__shadow-top pointer-events-none absolute inset-0 top-0 z-[5] h-16 w-full bg-gradient-to-t from-transparent to-black/60"
            />

            <div
              class="__video-container relative aspect-[9/16] h-full bg-[#222222cc]"
            >
              <img
                v-if="activeFrame"
                ref="$cover"
                :src="activeFrame.url"
                crossorigin="anonymous"
                class="h-full w-full object-cover object-center"
              />
            </div>
            <div
              class="absolute left-0 top-0 z-10 flex h-fit w-full items-center justify-between px-3 pt-3"
            >
              <div class="flex items-center gap-2">
                <BaseAvatarNext
                  :picture="profileStore.myProfileDetail.picture"
                  :show-story="true"
                  :online="true"
                  size="sm"
                />
                <div class="flex flex-col justify-center">
                  <div
                    class="_text-shadow max-w-32 cursor-pointer truncate text-xs text-[#D4D4D4] hover:underline"
                  >
                    {{ profileStore.myProfileDetail.fullName }}
                  </div>
                  <div class="_text-shadow text-xs text-[#D4D4D4]">Now</div>
                </div>
              </div>

              <div class="px-1">
                <div
                  class="group relative flex cursor-pointer items-center justify-center rounded-md p-1.5 text-[#d9d9d9] transition-all hover:bg-[#B0B0B0]/30 active:scale-95"
                  @click="handleWatchReel"
                >
                  <i class="fa-regular fa-expand _text-shadow" />
                </div>
              </div>
            </div>

            <div
              v-if="!isExpanded"
              class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-1"
            >
              <BaseButton
                type="outline"
                icon="fa-regular fa-upload"
                label="Upload Cover"
                size="small"
                class="flex min-w-[7rem] items-center gap-2"
              >
                <input
                  ref="file"
                  type="file"
                  accept="image/*"
                  class="absolute inset-0 z-10 cursor-pointer opacity-0"
                  data-cy="create-reel-form-cover-input"
                  @change="uploadCoverPhoto"
                />
              </BaseButton>
              <BaseButton
                type="outline"
                icon="fa-regular fa-pen-to-square"
                label="Description"
                size="small"
                class="flex min-w-[7rem] items-center gap-2"
                @click="descriptionPopup = true"
              />
            </div>
            <div class="max-h-42 absolute bottom-10 right-0 px-3">
              <div
                class="flex flex-col items-center text-[#d9d9d9]"
                data-cy="53469bddc29dbf52"
              >
                <div
                  class="group relative flex cursor-pointer items-center justify-center rounded-md p-1.5 text-[#d9d9d9] transition-all hover:bg-[#B0B0B0]/30 active:scale-95"
                >
                  <i class="fa-regular fa-heart _text-shadow" />
                </div>
                <div class="_text-shadow text-xs">0</div>
              </div>
              <div
                class="flex flex-col items-center text-[#d9d9d9]"
                data-cy="53469bddc29dbf52"
              >
                <div
                  class="group relative flex cursor-pointer items-center justify-center rounded-md p-1.5 text-[#d9d9d9] transition-all hover:bg-[#B0B0B0]/30 active:scale-95"
                >
                  <i class="fa-regular fa-comment _text-shadow" />
                </div>
                <div class="_text-shadow text-xs">0</div>
              </div>
              <div class="flex flex-col items-center text-white">
                <div
                  class="group relative flex cursor-pointer items-center justify-center rounded-md p-1.5 text-[#d9d9d9] transition-all hover:bg-[#E5E5E51A]/30 active:scale-95"
                >
                  <i class="fa-regular fa-share-nodes _text-shadow" />
                </div>
                <div class="_text-shadow text-xs">0</div>
              </div>

              <div class="flex flex-col items-center">
                <BaseAvatarNext
                  :picture="profileStore.myProfileDetail.picture"
                  :show-online="false"
                  :show-story="false"
                  size="sm"
                >
                  <template #button>
                    <div
                      class="flex size-full scale-75 items-center justify-center rounded-full bg-black"
                    >
                      <i class="fas fa-heart text-[10px] text-red-500" />
                    </div>
                  </template>
                </BaseAvatarNext>

                <div class="_text-shadow text-xs text-white">0</div>
              </div>
            </div>

            <div class="absolute bottom-1 left-0 z-10 flex w-full px-3">
              <div
                v-if="isExpanded"
                ref="content"
                class="hide-scrollbar max-h-[15rem] w-full overflow-y-scroll text-justify"
              >
                <p class="_text-shadow h-full w-[84%] pb-1 pl-1 text-xs">
                  <span class="block w-full" v-html="reelDescription" />
                  <span
                    class="cursor-pointer font-['Inter'] text-sm font-normal leading-[1.181rem] text-[#e0b92c] underline"
                    @click="toggleExpand"
                  >
                    {{ $t('post.content.less') }}
                  </span>
                </p>
              </div>

              <div v-else class="flex w-full">
                <p
                  class="_text-shadow pb-1 pl-1 text-xs"
                  :class="[
                    reelDescription.length > 46
                      ? 'w-[62%] truncate'
                      : 'w-[85%] truncate',
                  ]"
                >
                  {{ removeHtmlTags(reelDescription) || 'No Description' }}
                </p>

                <span
                  v-if="reelDescription.length > 46"
                  class="cursor-pointer pb-1 text-xs text-[#e0b92c] underline"
                  @click="toggleExpand"
                >
                  See more
                </span>
              </div>
            </div>

            <div
              class="__shadow-bottom pointer-events-none absolute inset-0 top-auto h-12 w-full bg-gradient-to-b from-transparent to-black/60"
            />
          </div>
        </div>

        <el-dialog
          v-model="descriptionPopup"
          append-to-body
          :show-close="false"
          width="30rem"
          align-center
        >
          <div class="flex flex-col gap-2 rounded-5 bg-black p-3">
            <div class="flex items-center justify-between rounded-t-sm">
              <div class="flex items-center gap-2 text-lg">
                <span>
                  <i class="fa-solid fa-pen-to-square" />
                </span>
                <span>Description</span>
              </div>
              <BaseIconClose
                data-cy="45f32f027e930e93"
                @click="descriptionPopup = false"
              />
            </div>

            <div class="relative flex-1">
              <BaseEditor
                v-model="reelDescription"
                :options="{
                  placeholder: 'Add Description',
                  moreThanOneLine: true,
                  characters: 77,
                  showStoryMedia: true,
                }"
                type="area"
                :auto-clear="false"
                :send-whitespace="false"
                :show-gif="true"
                :is-action="false"
                limit-character
                :characters-limit="500"
                area-height="11rem"
                :show-send="false"
                @change="onChange"
              />
            </div>
            <div class="flex items-center justify-end gap-4 rounded-b">
              <BaseButton
                type="tertiary"
                label="Reset"
                @click="resetTextField"
              />
              <BaseButton label="Save" @click="addDescription" />
            </div>
          </div>
        </el-dialog>
      </div>

      <div
        class="relative flex h-full w-full items-center px-2 md:flex-1 md:overflow-hidden"
      >
        <client-only>
          <div class="absolute bottom-0 left-0 right-0 top-0 pb-0">
            <div class="relative h-full w-[99.9%] rounded-5 bg-[#060606]">
              <FluxesCreationReelEditor
                class="pintura-editor-wrapper h-full w-full"
                data-cy="create-reel-form-editor"
                @publish-media-reel="handleCreateMediaReel"
                @media-upload="uploadMedia"
                @back="handleCancel"
                @set-cover="setActiveFrame"
              />
            </div>
          </div>
        </client-only>
      </div>
    </div>

    <FluxesCreationReelWatch
      v-if="isWatchingReel && selectedMedia"
      :selected-media="selectedMedia"
      @close="isWatchingReel = false"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const profileStore = useProfileStore();
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();
    return { profileStore, socialStore, fluxesStore };
  },
  data() {
    return {
      frames: [],
      videoSrc: '',
      frameLoading: true,
      coverPhoto: null,
      activeFrame: null,
      isWatchingReel: false,
      selectedMedia: this.fluxesStore.createMediaReel.file || null,
      showEmoji: false,
      defaultFrame: '',
      imageUploaded: false,
      descriptionPopup: false,
      reelDescription: this.fluxesStore.createMediaReel.content,
      isExpanded: false,
      bg: '#141414cc',
    };
  },

  computed: {
    mediaData() {
      return this.fluxesStore.createMediaReel;
    },
  },
  watch: {
    activeFrame(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          const cover = this.$refs.$cover;
          if (cover) {
            cover.onload = () => {
              const color = getAverageColor(cover);
              this.bg = color;
            };
          }
        });
      }
    },
  },
  unmounted() {
    this.handleCancel();
  },
  methods: {
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

      if (file.size > 1024 * 1024 * 30) {
        this.$toast.error('The video size should not exceed 30MB');
        return false;
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
    resetTextField() {
      this.reelDescription = '';
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
      this.$nextTick(() => {
        const content = this.$refs.content;
        if (content) {
          content.scrollTop = content.scrollHeight;
        }
      });
    },
    onChange(content) {
      this.reelDescription = removeHtmlTags(content);
    },
    addDescription() {
      this.fluxesStore.createMediaReel.content = removeHtmlTags(
        this.reelDescription,
      );
      this.descriptionPopup = false;
    },
    onCloseClick() {
      this.coverPhoto = null;
      this.imageUploaded = false;
      this.activeFrame = null;
    },
    setActiveFrame(frame) {
      if (this.imageUploaded) {
        this.activeFrame = this.coverPhoto;
        this.imageUploaded = false;
      } else {
        this.activeFrame = frame;
        this.imageUploaded = false;
        this.coverPhoto = null;
      }
    },
    async uploadCoverPhoto(event) {
      this.fluxesStore.isNewCoverPhoto = true;
      const file = event.target.files[0];

      this.coverPhoto = {
        url: URL?.createObjectURL(file) || '',
        blob: file,
        type: file.type,
        size: file.size,
        name: file.name,
      };

      this.activeFrame = this.coverPhoto;
      this.imageUploaded = true;
    },

    onEmoji(emoji) {
      this.fluxesStore.createMediaReel.content += emoji.i;
      this.showEmoji = false;
    },

    async handleCreateMediaReel(files) {
      if (!this.activeFrame && !this.fluxesStore.isEditingReel) {
        this.$toast.error(this.$t('flux.error.empty.cover'));
        this.fluxesStore.createMediaReel.loading = false;
        return;
      }

      const id = this.socialStore.addPostProgress();
      const timeout = setTimeout(() => {
        this.fluxesStore.creationVisible = false;
        this.socialStore.updatePostProgress(id, { show: true });
      }, 3000);

      if (this.fluxesStore.isEditingReel) {
        this.fluxesStore.createMediaReel.loading = true;
        try {
          const data = {
            content: this.fluxesStore.createMediaReel.content,
          };

          if (this.fluxesStore.isNewCoverPhoto) {
            const { fileId } = await upload({ file: this.activeFrame.blob });

            data.cover = {
              fileId,
              metadata: {
                mimetype: this.activeFrame.blob.type,
                size: this.activeFrame.blob.size,
                name: this.mediaData.metadata.name,
              },
            };
          }

          if (this.fluxesStore.isNewReelMedia) {
            const { fileId } = await upload({
              file: this.activeFrame.blob,
              onProgress: (progress) => {
                this.socialStore.updatePostProgress(id, { progress });
              },
            });
            data.cover = {
              fileId,
              metadata: {
                mimetype: this.activeFrame.blob.type,
                size: this.activeFrame.blob.size,
                name: this.mediaData.metadata.name,
              },
            };
            data.files = files;
          }

          await this.socialStore.updatePost({
            postId: this.fluxesStore.currReelItem.id,
            ...data,
          });

          this.$toast.success('Reel Successfully Updated');
          this.socialStore.updatePostProgress(id, { success: true });
          clearTimeout(timeout);
        } catch (error) {
          this.fluxesStore.reelCreated = false;
          this.$toast.error(this.$t('flux.reel.create.failed'));
          if (this.socialStore.getPostProgress(id)?.show) {
            this.socialStore.updatePostProgress(id, { failed: true });
          }
          this.fluxesStore.reelCreated = false;
        } finally {
          clearTimeout(timeout);
          this.fluxesStore.isNewCoverPhoto = false;
          this.fluxesStore.createMediaReel.loading = false;
          this.fluxesStore.resetCreationReels();
          this.fluxesStore.getLatestReels();
        }
      } else {
        try {
          const { fileId } = await upload({
            file: this.activeFrame.blob,
            onProgress: (progress) => {
              this.socialStore.updatePostProgress(id, { progress });
            },
          });

          const params = {
            type: 'reel',
            cover: {
              fileId,
              metadata: {
                mimetype: this.activeFrame.blob.type,
                size: this.activeFrame.blob.size,
                name: this.mediaData.file.name,
              },
            },
            visibility: this.fluxesStore.creationVisibility,
            files,
            content: this.fluxesStore.createMediaReel.content,
          };

          this.fluxesStore.createMediaReel.loading = true;
          await this.fluxesStore.createReels(params);
          this.$toast.success(this.$t('flux.reel.create.success'));
          this.fluxesStore.reelCreated = true;
          clearTimeout(timeout);
          this.socialStore.updatePostProgress(id, { success: true });
        } catch (error) {
          this.fluxesStore.reelCreated = false;
          if (this.socialStore.getPostProgress(id)?.show) {
            this.socialStore.updatePostProgress(id, { failed: true });
          }
          this.$toast.error(this.$t('flux.reel.create.failed'));
        } finally {
          clearTimeout(timeout);
          this.fluxesStore.createMediaReel.loading = false;

          this.fluxesStore.resetCreationReels();
          this.fluxesStore.getLatestReels();
        }
      }
    },
    handleWatchReel() {
      if (this.mediaData.file) {
        this.isWatchingReel = true;
        this.selectedMedia = this.mediaData.file.src || this.mediaData.file.url;
      }
    },

    handleSelectVisible(type) {
      this.fluxesStore.createMediaList.visibility = type;
    },

    handleClose() {
      this.handleCancel();
      this.fluxesStore.resetCreationReels();
    },
    handleCancel() {
      this.fluxesStore.createMediaReel.uploadOpen = false;
      this.fluxesStore.createMediaReel.file = null;
      this.fluxesStore.createMediaReel.metadata = {
        mimetype: '',
        size: '',
        name: '',
      };
      this.fluxesStore.isEditingReel = false;
      this.fluxesStore.isNewReelMedia = false;
      this.activeFrame = null;
      this.bg = '#141414cc';
    },
  },
};
</script>

<style scoped>
.el-textarea__inner {
  padding: 7rem;
  /* Adjust padding as needed */
  background: red;
}

._text-shadow {
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.5);
}
</style>

<template>
  <div class="relative flex h-full w-full flex-col">
    <div
      class="relative flex w-full flex-1 flex-col items-center overflow-y-auto px-4 pt-4 md:flex-row md:gap-3"
    >
      <div
        class="relative flex h-full w-full shrink-0 flex-col gap-4 rounded-5 md:h-full md:w-[18.125rem]"
      >
        <BaseAvatarSwitchVisiblity
          :visbility="visibilityComputed"
          @select="handleSelectVisible"
        />
        <div
          class="flex flex-col gap-3 rounded-5 bg-[#0D0D0D] px-4 py-1 pt-4"
          :class="$device.isMobile ? '' : 'small-screen-gap'"
        >
          <p class="text-sm font-normal leading-4 text-white">
            Title and Cover
          </p>

          <div
            data-cy="create-highlight-form-avatar-trigger"
            class="relative"
            @click="open = true"
          >
            <div class="flex items-center justify-center">
              <div class="group z-[100] rounded-[5rem]" @click="open = true">
                <div
                  class="relative h-full w-full overflow-hidden rounded-full"
                >
                  <BaseAvatar
                    size="lg"
                    :show-online="false"
                    :picture="fluxesStore.createMediaList.highlightCover"
                  />
                  <i
                    class="fa-regular fa-camera absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 scale-125 cursor-pointer text-white/80 transition-all duration-200 group-hover:scale-[1.5] group-hover:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="relative flex items-center justify-between gap-0.5">
            <BaseInput
              v-model="fluxesStore.createMediaList.title"
              class="center-input h-8 flex-1 !text-center"
              data-cy="create-highlight-form-title"
              :placeholder="$t('flux.highlight.hint')"
              :max-length="12"
            >
              <template #prefix>
                <i class="fa-regular fa-text text-xs text-white/50" />
              </template>
              <template #suffix>
                <div
                  class="text-xs"
                  :class="
                    length >= maxLength ? 'text-red-500' : 'text-white/50'
                  "
                >
                  {{ length || 0 }}/{{ maxLength }}
                </div>
                <el-popover
                  v-model:visible="showEmoji"
                  trigger="click"
                  placement="bottom-end"
                  width="275"
                >
                  <template #reference>
                    <div
                      data-tooltip="Emoji"
                      class="mb-1 ml-1 flex cursor-pointer items-center justify-center rounded transition-all active:scale-95"
                      :class="
                        showEmoji
                          ? 'text-white'
                          : 'text-white/50 hover:text-white'
                      "
                    >
                      <i class="fa-regular fa-face-smile text-base" />
                    </div>
                  </template>
                  <LazyBaseEmojiPicker
                    class="!h-[15.625rem] !text-xs 2xl:!h-[18.125rem]"
                    @change="onEmoji"
                  />
                </el-popover>
              </template>
            </BaseInput>
          </div>
        </div>

        <div
          class="flex h-full flex-1 flex-col overflow-hidden rounded-5 bg-[#0D0D0D]"
        >
          <p class="px-2 py-4 text-sm font-normal leading-4 text-white">
            {{ $t('flux.highlight.story.list') }}
          </p>

          <div class="custom-scroll flex-1 overflow-y-auto px-2">
            <Transition
              v-if="cardList.length"
              name="slide-fade-in"
              mode="out-in"
            >
              <FluxesCreationHighLightWigetsStoryList
                :active-index="activeSliderIndex"
                :card-list="cardList"
                @swap-end="onEnd"
                @new-blank="handleBlank"
                @new-gallery="handleGallery"
                @new-media="uploadMedia"
                @edit="handleEdit"
              />
            </Transition>
            <div
              v-else
              class="flex h-full flex-col items-center justify-center gap-1 lg:gap-2"
            >
              <span
                class="flex size-[3.5rem] items-center justify-center rounded-full bg-[#1C1C1C] lg:size-[4.5rem] xl:size-[4rem] 2xl:size-[6.25rem]"
              >
                <i
                  class="fa-regular fa-file text-[1rem] text-[#d9d9d9]/50 xl:text-[1.5rem] 2xl:text-[2rem]"
                />
              </span>

              <p
                class="text-center text-xs font-normal leading-3 text-[#d9d9d9]/50"
              >
                {{ $t('base.data.noData') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="relative flex h-full w-full items-center border-[1px] border-dashed border-[#E0B92C] md:flex-1 md:overflow-hidden"
      >
        <div ref="mainRef" class="relative w-full">
          <Swiper
            class="stories-slider overflow-visible"
            :slides-per-view="slidesPerView"
            :space-between="spaceBetween"
            :centered-slides="true"
            :slide-to-clicked-slide="true"
            no-swiping-class="swiper-no-swiping"
            @swiper="setMainSlider"
          >
            <SwiperSlide
              v-for="(card, i) in cardList"
              :key="card.id"
              class="relative"
            >
              <FluxesCreationHighLightWigetsSlideItem
                :card="card"
                :curr-index="i"
                :list-count="cardList.length"
                class="w-[11rem]"
                @select="handleSetPos"
                @duplicate="handleDuplicate"
                @edit="handleEdit"
              />
              <div v-if="i === activeSliderIndex" class="stories-slider__nav">
                <div
                  v-show="isPrevBtnHidden"
                  class="absolute left-0 top-1/2 flex h-12 w-7 cursor-pointer items-center justify-center text-black sm:!left-2 2xl:!left-8"
                  @click="slidePrev"
                >
                  <div
                    class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
                  />
                  <i
                    class="fa-light fa-chevron-left pointer-events-none relative z-10 text-base text-white"
                  />
                </div>
                <div
                  v-show="isNextBtnHidden"
                  class="group absolute right-0 top-1/2 z-50 flex h-12 w-7 cursor-pointer items-center justify-center rounded-5 sm:right-2 2xl:!right-8"
                  @click="slideNext"
                >
                  <div
                    class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
                  />
                  <i
                    class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
                  />
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide class="relative">
              <FluxesCreationHighLightWigetsNewPanel
                class="mt-[2rem] w-[11rem]"
                @new-blank="handleBlank"
                @new-gallery="handleGallery"
                @new-media="uploadMedia"
              />
              <div
                v-if="cardList.length === activeSliderIndex"
                class="stories-slider__nav"
              >
                <div
                  v-show="isPrevBtnHidden"
                  class="absolute left-0 top-1/2 flex h-12 w-7 cursor-pointer items-center justify-center text-black sm:!left-2 2xl:!left-8"
                  @click="slidePrev"
                >
                  <div
                    class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
                  />
                  <i
                    class="fa-light fa-chevron-left pointer-events-none relative z-10 text-base text-white"
                  />
                </div>
                <div
                  v-show="isNextBtnHidden"
                  class="group absolute right-0 top-1/2 z-50 flex h-12 w-7 cursor-pointer items-center justify-center rounded-5 sm:right-2 2xl:right-8"
                  @click="slideNext"
                >
                  <div
                    class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
                  />
                  <i
                    class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
                  />
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <client-only>
          <div
            v-if="fluxesStore.createMediaList.uploadOpen"
            class="absolute bottom-0 left-0 right-0 top-0 z-10 pb-0"
          >
            <div
              class="relative mx-auto h-full w-full max-w-[87.5rem] rounded-5 bg-[#060606]"
            >
              <Transition name="slide-fade-in" mode="out-in">
                <FluxesCreationHighLightEditorBlank
                  v-if="newType === 'blank'"
                  :without-footer="true"
                  :is-edit="fluxesStore.editStory.visible"
                  @close="handleCloseCreation"
                  @save="handleSaveBlank"
                />
                <FluxesCreationHighLightEditorMedia
                  v-else-if="newType === 'media'"
                  :without-footer="true"
                  :is-edit="fluxesStore.editStory.visible"
                  @close="handleCloseCreation"
                  @create-media-story="handleCreateMediaStory"
                />
                <FluxesCreationHighLightEditorGallery
                  v-else-if="newType === 'gallery'"
                  data-cy="highlight-editor-gallery"
                  @close="handleCloseCreation"
                  @save="handleSaveGallery"
                />
                <div v-else />
              </Transition>
            </div>
          </div>
          <Transition name="slide-fade-in" mode="out-in">
            <FluxesCreationHighLightWigetsDeleteHIghlightModal
              v-if="isDeleteHighlightVisible"
              @close="handleCloseDeleteHighlight"
              @cancel="handleCancelHighlightDelete"
            />
            <FluxesCreationHighLightWigetsDeleteModel
              v-else-if="isDeleteStoryVisible"
              @close="handleCloseDeleteStory"
            />
          </Transition>
        </client-only>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4 rounded-5 p-4">
      <BaseButton
        type="error-outline"
        data-cy="352d347bea7899e6"
        :disabled="!isPublished"
        @click="handleDeleteHighlight"
      >
        Delete Highlight
      </BaseButton>
      <div class="flex items-center justify-end gap-4">
        <BaseButton type="tertiary" data-cy="352d347bea7899e6" @click="onClose">
          {{ $t('flux.discard') }}
        </BaseButton>
        <BaseButton
          v-if="cardList.length"
          :disabled="fluxesStore.createMediaStory.isCreatingStory"
          type="tertiary"
          data-cy="9d99ea6db0b37240"
          @click="handlePreview"
        >
          <i class="fa-regular fa-play" />
          <span>{{ $t('flux.watch.preview') }}</span>
        </BaseButton>
        <BaseButton
          :class="
            !cardList.length || fluxesStore.createMediaStory.isCreatingStory
              ? '!bg-[#737373]/[0.3] font-medium !text-[#D4D4D4]'
              : ''
          "
          :disabled="
            !cardList.length || fluxesStore.createMediaStory.isCreatingStory
          "
          data-cy="create-highlight-form-publish-button"
          @click="handleCreateHighLight"
        >
          <i
            v-if="fluxesStore.createMediaList.loading"
            class="fa-light fa-loader animate-spin"
          />
          {{ $t('flux.publish') }}
        </BaseButton>
      </div>
    </div>

    <client-only>
      <BaseDialog
        v-model="open"
        :destroy-on-close="true"
        :title="$t('flux.highlight.edit.cover')"
        class="!w-[90%] md:!w-[51.25rem]"
      >
        <ProfileSettingDialogCompsImageEditor
          ref="imageEditor"
          :options="options"
          :url="fluxesStore.createMediaList.highlightCover"
          data-cy="create-highlight-form-avatar-dialog"
          @result="handleResult"
        />
      </BaseDialog>
    </client-only>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const authStore = useAuthStore();
    const fluxesStore = useFluxesStore();
    const profileStore = useProfileStore();

    const mainRef = ref(null);
    const { width } = useElementSize(mainRef);
    const slidesPerView = computed(() => width.value / 324);
    const spaceBetween = computed(() => {
      if (width.value < 500) {
        return 0;
      }
      return -80;
    });

    return {
      authStore,
      fluxesStore,
      slidesPerView,
      mainRef,
      profileStore,
      spaceBetween,
    };
  },
  data() {
    return {
      swiper: null,
      uploadOpen: false,
      createloading: false,
      options: {
        rounded: true,
        imageCropAspectRatio: 1,
        cropSelectPresetOptions: [],
        imageCropMinSize: { width: 200, height: 200 },
      },
      showEmoji: false,
      newType: 'media',
      cover: '',
      open: false,
      view: 'list',
      visibility: 'public',
      initName: '',
      maxLength: 12,
    };
  },
  computed: {
    length() {
      return Array.from(this.fluxesStore.createMediaList.title).length;
    },
    cardList() {
      return this.fluxesStore.createMediaList.data;
    },
    activeSliderIndex() {
      return this.swiper?.activeIndex;
    },
    isPrevBtnHidden() {
      return !this.swiper?.isBeginning;
    },
    isNextBtnHidden() {
      return !this.swiper?.isEnd;
    },
    visibilityComputed() {
      return this.visibility;
    },
    isPublished() {
      return this.fluxesStore.storyIsPublished;
    },
    hasHighlight() {
      return (
        this.fluxesStore.createMediaList.data.length ||
        this.fluxesStore.createMediaList.highlightCover ||
        this.fluxesStore.createMediaList.title
      );
    },
    isDeleteHighlightVisible() {
      return this.fluxesStore.deleteHighlight.visible;
    },
    isDeleteStoryVisible() {
      return this.fluxesStore.deleteStory.visible;
    },
  },
  mounted() {
    this.initName = this.fluxesStore.createMediaList.title;
  },
  unmounted() {
    this.fluxesStore.resetHighlightCreation();
  },
  methods: {
    handleCloseDeleteHighlight() {
      this.fluxesStore.deleteHighlight.visible = false;
      this.fluxesStore.creationVisible = false;
      this.fluxesStore.storyPopup.state = false;
      history.back();
      this.$nextTick(() => {
        this.fluxesStore.resetHighlightCreation();
        this.fluxesStore.onceGetUserLastestStoriesGroup({
          ownerId: this.profileStore.myProfileDetail.id,
        });
      });
    },
    handleCancelHighlightDelete() {
      this.fluxesStore.deleteHighlight.visible = false;
    },
    handleCloseDeleteStory() {
      this.fluxesStore.deleteStory.visible = false;
    },
    slidePrev() {
      this.swiper?.slidePrev();
    },
    slideNext() {
      this.swiper?.slideNext();
    },
    onEmoji(emoji) {
      if (this.length >= 12) {
        return;
      }
      this.fluxesStore.createMediaList.title =
        this.fluxesStore.createMediaList.title + emoji.i;

      this.showEmoji = false;
    },
    handleSelectVisible(menu) {
      this.fluxesStore.createMediaList.visibility = menu;
      this.visibility = menu;
    },
    async uploadMedia(event) {
      const file = event.target.files[0];

      if (!this.isValidMediaType(file)) {
        this.$toast.error(this.$t('base.upload.error'));
        return;
      }

      const isValidSize = this.checkFileSize(file);
      if (!isValidSize) {
        return false;
      }

      this.setMediaType(file);

      file.src = await this.getMediaUrl(file);

      this.fluxesStore.createMediaStory.file = file;
      this.fluxesStore.createMediaList.uploadOpen = true;
      this.newType = 'media';

      event.target.value = ''; // Clear file input for potential re-upload
    },

    // Helper Methods
    isValidMediaType(file) {
      return file.type.startsWith('image/') || file.type.startsWith('video/');
    },

    checkFileSize(file) {
      const sizeLimits = {
        image: 1024 * 1024 * 6, // 6MB
        video: 1024 * 1024 * 30, // 30MB
      };

      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      if (file.size > sizeLimits[fileType]) {
        this.$toast.error(
          this.$t('flux.error.image.limit.exceed', {
            size: fileType === 'image' ? '6MB' : '30MB',
          }),
        );
        return false;
      }

      return true;
    },

    setMediaType(file) {
      if (file.type.startsWith('image/')) {
        this.fluxesStore.createMediaStory.type = 'image';
      } else if (file.type.startsWith('video/')) {
        this.fluxesStore.createMediaStory.type = 'video';
      }
    },
    async getMediaUrl(file) {
      return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        resolve(url);
      });
    },
    handleBlank() {
      this.fluxesStore.createMediaList.uploadOpen = true;
      this.newType = 'blank';
    },
    handleGallery() {
      this.fluxesStore.createMediaList.uploadOpen = true;
      this.newType = 'gallery';
    },
    handleCloseCreation() {
      this.resetVisblity();
      this.fluxesStore.createMediaList.uploadOpen = false;
      this.newType = '';
    },
    resetVisblity() {
      this.visibility = 'public';
    },
    async handleSaveBlank(file) {
      try {
        this.initializeStoryCreation();
        const templateId = this.addMediaToStore(file);

        const uploadedFile = await this.uploadFile(file);
        const params = this.prepareStoryParams([uploadedFile]);
        this.fluxesStore.createMediaList.uploadOpen = false;

        const realData = await this.fluxesStore.createStories(params);
        this.updateMediaCard(templateId, realData);
      } catch (error) {
        console.error(error);
      } finally {
        this.finalizeStoryCreation();
      }
    },

    async handleCreateMediaStory(params, file, type) {
      try {
        this.initializeStoryCreation();
        const visibility = this.visibilityComputed;
        this.resetVisblity();

        const uploadedFiles = await this.handleFileUpload(file, type);
        this.fluxesStore.createMediaList.uploadOpen = false;
        params.files = uploadedFiles;
        params.visibility = visibility;
        this.newType = '';

        if (this.fluxesStore.editStory.visible) {
          await this.updateExistingStory(params);
        } else {
          const templateId = this.addMediaToStore(file);
          const realData = await this.fluxesStore.createStories({
            ...params,
            isHighlight: true,
          });
          this.updateMediaCard(templateId, realData);
          this.fluxesStore.resetMediaStory();
        }
      } finally {
        this.finalizeStoryCreation();
      }
    },

    initializeStoryCreation() {
      this.fluxesStore.createMediaStory.isCreatingStory = true;
    },

    finalizeStoryCreation() {
      this.fluxesStore.createMediaStory.isCreatingStory = false;
      this.fluxesStore.createMediaList.loading = false;
      this.fluxesStore.createMediaStory.loading = false;
      this.fluxesStore.editStory.visible = false;
    },

    addMediaToStore(file) {
      const templateId = Date.now();
      const item = { loading: true, id: templateId, _original: file };
      this.fluxesStore.createMediaList.data.push(item);

      this.slideToEnd();
      return templateId;
    },

    async uploadFile(file) {
      const { dest } = file;
      const { fileId } = await upload({ file: dest });

      return {
        fileId,
        metadata: {
          mimetype: dest.type,
          size: dest.size,
          name: dest.name,
        },
      };
    },

    prepareStoryParams(files) {
      return {
        visibility: this.visibilityComputed,
        files,
        isHighlight: true,
      };
    },

    updateMediaCard(templateId, realData) {
      this.fluxesStore.createMediaList.data.forEach((card) => {
        if (card.id === templateId) {
          Object.assign(card, { loading: false }, realData);
        }
      });
    },

    async handleFileUpload(file, type) {
      if (type === 'video') {
        const res = await upload({ file });
        return [
          {
            fileId: res.fileId,
            metadata: {
              mimetype: res.file.type,
              size: res.file.size,
              name: res.file.name,
            },
          },
        ];
      } else {
        return [await this.uploadFile(file)];
      }
    },

    async updateExistingStory(params) {
      this.fluxesStore.editStory.item.loading = true;
      const {
        type,
        item: { id: storyId },
      } = this.fluxesStore.editStory;

      const readyParams = {
        storyId,
        visibility: params.visibility,
      };

      if (type === 'image') {
        readyParams.files = params.files;
      } else if (type === 'video') {
        readyParams.imageState = params.imageState;
      }

      try {
        const realData = await this.fluxesStore.updateStories(readyParams);

        const mediaListItem = this.fluxesStore.createMediaList.data.find(
          (card) => card.id === storyId,
        );
        if (mediaListItem) {
          Object.assign(mediaListItem, realData, { loading: false });
        }

        this.fluxesStore.storiesPreview.data.forEach((preview) => {
          if (Array.isArray(preview._stories)) {
            const storyItem = preview._stories.find(
              (story) => story.id === storyId,
            );
            if (storyItem) {
              Object.assign(storyItem, realData, { loading: false });
            }
          }
        });

        this.fluxesStore.editStory.item.loading = false;
        this.fluxesStore.createMediaList.uploadOpen = false;
        this.fluxesStore.resetMediaStory();
      } catch (error) {
        console.error('Error updating story:', error);
      }
    },
    onClose() {
      const data = [];
      if (!this.hasHighlight) {
        this.fluxesStore.creationVisible = false;
        return;
      }
      this.fluxesStore.createMediaList.data.forEach((item) => {
        data.push(item.id);
      });
      if (!this.fluxesStore.storyIsPublished && data.length) {
        this.fluxesStore.deleteAllStories(data);
      }
      this.resetVisblity();
      this.fluxesStore.resetHighlightCreation();
      this.fluxesStore.storyIsPublished = false;
      this.fluxesStore.deletedStoryList = [];
    },
    setMainSlider(swiper) {
      this.swiper = swiper;
    },
    handlePreview() {
      this.fluxesStore.storiesPreview.index = 0;
      this.fluxesStore.storiesPreview.visible = true;
      this.cardList.map(() => ({
        owner: this.profileStore.myProfileDetail,
      }));

      this.fluxesStore.storiesPreview.data = [
        {
          _stories: this.cardList,
          owner: this.profileStore.myProfileDetail,
          title: this.fluxesStore.createMediaList.title,
          cover: {
            ...this.fluxesStore.createMediaList.cover,
            url: this.fluxesStore.createMediaList.highlightCover,
          },
          visibility: this.visibilityComputed,
        },
      ];
    },
    slideToEnd() {
      this.$nextTick(() => {
        this.swiper.update();
        this.swiper.slideTo(this.fluxesStore.createMediaList.data.length);
      });
    },
    handleSaveGallery(list) {
      this.fluxesStore.createMediaList.uploadOpen = false;
      this.fluxesStore.createMediaList.isFromHighlight = true;
      this.newType = '';

      list.forEach((item) => {
        this.fluxesStore.createMediaList.data.push(item);
      });
      this.slideToEnd();
    },
    async handleCreateHighLight() {
      if (!this.cardList.length) {
        return;
      }
      try {
        this.fluxesStore.createMediaList.loading = true;

        const params = {
          title: this.fluxesStore.createMediaList.title,
          cover: this.fluxesStore.createMediaList.cover,
          stories: this.fluxesStore.createMediaList.data.map((item) => item.id),
          visibility: this.fluxesStore.createMediaList.visibility,
        };

        if (
          !params.title &&
          !this.fluxesStore.createMediaList.editingHighlightId
        ) {
          this.fluxesStore.createMediaList.loading = false;
          this.$toast.error(this.$t('flux.error.empty.title'));
          return;
        }

        if (
          !params.cover &&
          !this.fluxesStore.createMediaList.editingHighlightId
        ) {
          this.fluxesStore.createMediaList.loading = false;
          this.$toast.error(this.$t('flux.error.empty.cover'));
          return;
        }
        if (this.fluxesStore.createMediaList.editingHighlightId) {
          // This is to delete the url field as the backend does not accept it
          delete params.cover.url;
          if (this.initName === this.fluxesStore.createMediaList.title) {
            // This is to prevent the title from being sent when it is not changed
            delete params.title;
          }
          await this.fluxesStore.updateStoriesGroup({
            highlightId: this.fluxesStore.createMediaList.editingHighlightId,
            ...params,
          });
          this.$toast.success('Update highlight successfully');
          const index = this.fluxesStore.storiesPreview.data.findIndex(
            (item) =>
              item.id === this.fluxesStore.createMediaList.editingHighlightId,
          );

          if (index !== -1) {
            // This is to update the preview data
            const story = await this.fluxesStore.getStoriesGroupById(
              this.fluxesStore.createMediaList.editingHighlightId,
            );

            story._stories = story.stories;
            story._stories.forEach((item) => {
              item.owner = story.owner;
            });
            this.fluxesStore.storiesPreview.data[index] = story;
          }
          this.fluxesStore.resetStoryEditing();
        } else {
          await this.fluxesStore.createStoryGroup(params);
          this.$toast.success(this.$t('flux.success.share'));
          this.$nextTick(() => {
            this.fluxesStore.onceGetUserLastestStoriesGroup({
              ownerId: this.profileStore.myProfileDetail.id,
            });
          });
          this.fluxesStore.resetHighlightCreation();
        }

        if (this.fluxesStore.deletedStoryList.length) {
          this.fluxesStore.deleteAllStories(this.fluxesStore.deletedStoryList);
        }
        this.fluxesStore.creationVisible = false;
      } finally {
        this.fluxesStore.createMediaList.loading = false;
        this.fluxesStore.storyIsPublished = false;
        this.fluxesStore.createMediaList.isFromHighlight = false;
      }
    },
    async handleResult(res) {
      const { fileId } = await upload({ file: res });
      this.open = false;
      this.fluxesStore.createMediaList.highlightCover =
        await this.getMediaUrl(res);
      this.fluxesStore.createMediaList.cover = {
        fileId,
        metadata: {
          mimetype: res.type,
          size: res.size,
          name: res.name,
        },
      };
    },
    handleSetPos({ target, currIndex }) {
      this.fluxesStore.createMediaList.data = this.swapArrayElements(
        this.cardList,
        currIndex,
        target,
      );

      this.$nextTick(() => {
        this.swiper.update();
        this.swiper.slideTo(target);
      });
    },
    swapArrayElements(arr, oldIndex, newIndex) {
      // 检查索引是否有效
      if (
        oldIndex >= arr.length ||
        newIndex >= arr.length ||
        oldIndex < 0 ||
        newIndex < 0
      ) {
        console.error('Invalid index provided.');
        return arr;
      }

      // 使用解构赋值交换两个索引位置的元素
      [arr[oldIndex], arr[newIndex]] = [arr[newIndex], arr[oldIndex]];

      return arr;
    },
    async onEnd({ newIndex }) {
      await this.$nextTick();

      this.swiper.update();

      await this.$nextTick();
      this.swiper.slideTo(newIndex);
    },
    async handleDuplicate({ item, index }) {
      const deepCloneItem = cloneDeep(item);
      if (deepCloneItem._isFromGallery) {
        delete deepCloneItem._isFromGallery;
      }

      const templateId = Date.now();
      const targetIndex = index + 1;
      const newItem = {
        ...deepCloneItem,
        isDuplicate: true,
        id: templateId,
        _originId: item.id,
        loading: true,
      };

      this.fluxesStore.createMediaList.data.splice(targetIndex, 0, newItem);
      const files = deepCloneItem.files;
      delete files[0]?.url;

      if (files[0].metadata.mimetype === 'video/mp4') {
        delete files[0].metadata.videoDuration;
      }

      const cover = deepCloneItem.cover;
      if (files[0].metadata.mimetype === 'video/mp4' && cover.url) {
        delete cover.url;
      }
      const params = {
        visibility: 'public',
        content: deepCloneItem.content,
        cover: deepCloneItem.cover,
        files,
        isHighlight: true,
      };

      try {
        const realData = await this.fluxesStore.createStories(params);

        this.fluxesStore.createMediaList.data.forEach((card) => {
          if (card.id === templateId) {
            card = Object.assign(card, { loading: false }, realData);
          }
        });

        this.$nextTick(() => {
          this.swiper.update();
          this.swiper.slideTo(targetIndex);
        });
      } catch (error) {
        this.fluxesStore.createMediaList.data =
          this.fluxesStore.createMediaList.data.filter(
            (card) => card.id !== templateId,
          );
      }
    },
    handleEdit({ item, index }) {
      this.resetVisblity();
      const { cover } = item;

      const isPhoto = !cover;
      const isVideo = !!cover;

      if (isPhoto) {
        this.newType = 'media';
        this.fluxesStore.createMediaStory.type = 'image';
        this.fluxesStore.editStory.file = item.files[0];
        this.fluxesStore.editStory.type = 'image';
        this.fluxesStore.createMediaStory.file = item.files[0];
      } else if (isVideo) {
        this.newType = 'media';
        this.fluxesStore.createMediaStory.type = 'video';
        this.fluxesStore.createMediaStory.file = item.files[0];
        this.fluxesStore.editStory.file = item.files[0];
        this.fluxesStore.editStory.type = 'video';
      }

      this.fluxesStore.editStory.visible = true;
      this.fluxesStore.editStory.index = index;
      this.fluxesStore.editStory.item = item;
      this.fluxesStore.createMediaList.uploadOpen = true;
      this.visibility = this.fluxesStore.editStory.item.visibility;
    },
    handleDeleteHighlight() {
      this.fluxesStore.deleteHighlight.visible = true;
      this.fluxesStore.deleteHighlight.item =
        this.fluxesStore.createMediaList.editingHighlightId;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '~/assets/style/mixins' as *;
$sm: 767;
$md: 991;
$lg: 1199;
$xl: 1339;

.stories-slider {
  .swiper-slide {
    aspect-ratio: 9 / 16;
    transform: scale(0.9);
    opacity: 0.6;
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    &.swiper-slide-active {
      transform: scale(1);
      opacity: 1;

      :deep(.stories-group-slider__pagination) {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  &__nav {
    position: absolute;
    top: 49%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    z-index: 100;
    cursor: pointer;

    &-prev,
    &-next {
      width: 2rem;
      height: 3.4375rem;
      background-color: #101010;
      border-radius: 0.6875rem;

      display: flex;
      align-items: center;
      justify-content: center;

      position: absolute;
      color: #fff;
      transition: background-color 0.3s ease;
      border: 1px solid #565656;

      &:hover {
        background-color: black;
      }
    }
    &-prev {
      left: 0;
      @include r($sm) {
        justify-content: flex-start;
        .icon {
          margin-left: 0.5rem;
        }
      }
    }
    &-next {
      right: 0;
      @include r($sm) {
        justify-content: flex-end;
        .icon {
          margin-right: 0.5rem;
        }
      }
    }
  }
}

:deep(.center-input) {
  input {
    text-align: center;
    text-indent: 1.75rem;
  }
}

@media only screen and (max-height: 750px) {
  .small-screen-gap {
    gap: 0.375rem;
  }
  .small-screen-cover {
    width: 6.25rem;
  }
  .small-screen-pad {
    padding: 0.375rem 0.75rem;
  }
}

.custom-scroll::-webkit-scrollbar {
  display: none;
}

/* For Firefox */
.custom-scroll {
  scrollbar-width: none;
}
</style>

<template>
  <div class="relative flex h-full w-full flex-col">
    <div
      class="relative flex w-full flex-1 flex-col items-center overflow-y-auto px-4 pt-4 md:flex-row md:gap-3"
    >
      <div
        class="relative flex h-full w-full shrink-0 flex-col gap-4 rounded-5 md:w-[18.125rem]"
      >
        <BaseAvatarSwitchVisiblity
          :visbility="visibilityComputed"
          @select="handleSelectVisible"
        />
        <div
          class="flex flex-1 flex-col overflow-hidden rounded-5 bg-[#0D0D0D]"
        >
          <p class="px-2 py-4 text-sm font-normal leading-4 text-white">
            {{ $t('flux.highlight.story.hour') }}
          </p>

          <div class="custom-scroll flex-1 overflow-y-auto px-2">
            <FluxesCreationHighLightWigetsStoryListWithoutDrag
              v-if="cardList?.length"
              :active-index="activeSliderIndex"
              :card-list="cardList"
              @edit="handleEdit"
            />
            <div
              v-else
              class="flex h-full flex-col items-center justify-center gap-3"
            >
              <span
                class="flex h-[6.25rem] w-[6.25rem] items-center justify-center rounded-full"
                :class="[
                  $device.isMobile ? '' : 'small-screen-pad',
                  loading ? '' : 'bg-[#1C1C1C]',
                ]"
              >
                <i
                  v-if="loading"
                  class="fa-solid fa-spinner animate-spin text-2xl text-[#d9d9d9]/50"
                />
                <i
                  v-else
                  class="fa-regular fa-file text-[2rem] text-[#d9d9d9]/50"
                />
              </span>

              <p
                v-if="!loading"
                class="text-center text-xs font-normal leading-3 text-[#d9d9d9]/50"
              >
                {{ $t('base.data.noData') }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        :class="[
          'relative flex h-full w-full items-center border-[1px] border-dashed border-[#E0B92C] md:flex-1 md:overflow-hidden',
        ]"
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
              v-for="(card, i) in cardList && Array.isArray(cardList)
                ? cardList.slice().reverse()
                : []"
              :key="card.id"
            >
              <FluxesCreationHighLightWigetsSlideItem
                :card="card"
                :curr-index="i"
                :list-count="cardList.length"
                :show-button="false"
                class="w-[12.375rem]"
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
            <SwiperSlide>
              <FluxesCreationHighLightWigetsNewPanel
                class="w-[12.375rem]"
                :show-gallery="false"
                data-cy="main-story"
                @new-blank="handleBlank"
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
                  ref="blankEditor"
                  :without-footer="true"
                  :show-button="false"
                  :is-edit="fluxesStore.editStory.visible"
                  @save="handleCreateTextStory"
                  @close="handleBack"
                />
                <FluxesCreationHighLightEditorMedia
                  v-else-if="newType === 'media'"
                  ref="mediaEditor"
                  :without-footer="true"
                  :show-button="false"
                  :is-edit="fluxesStore.editStory.visible"
                  @create-media-story="handleCreateMediaStory"
                />
                <div v-else />
              </Transition>
            </div>
          </div>
          <Transition name="slide-fade-in" mode="out-in">
            <FluxesCreationHighLightWigetsDeleteModel
              v-if="isDeleteStoryVisible"
              @close="handleCloseDeleteStory"
            />
          </Transition>
        </client-only>
      </div>
    </div>

    <div class="flex items-center justify-end gap-4 rounded-5 p-4">
      <div class="flex items-center justify-end gap-4">
        <BaseButton type="tertiary" data-cy="352d347bea7899e6" @click="onClose">
          {{ fluxesStore.editStory.visible ? 'Discard' : $t('flux.discard') }}
        </BaseButton>
        <BaseButton
          :class="
            !fluxesStore.createMediaList.uploadOpen
              ? '!bg-[#737373]/[0.3] font-medium !text-[#D4D4D4]'
              : ''
          "
          :disabled="!fluxesStore.createMediaList.uploadOpen"
          data-cy="story-publish-button"
          @click="handleSave"
        >
          <i
            v-if="fluxesStore.createMediaStory.loading"
            class="fa-light fa-loader animate-spin"
          />
          {{ $t('flux.publish') }}
        </BaseButton>
      </div>
    </div>
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
    const socialStore = useSocialStore();

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
      socialStore,
      spaceBetween,
    };
  },
  data() {
    return {
      swiper: null,
      uploadOpen: false,
      newType: 'media',
      open: false,
      visibility: 'public',
      loading: false,
    };
  },
  computed: {
    cardList() {
      return this.fluxesStore.currentUserStories;
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
      return this.fluxesStore.storyVisibility;
    },
    isDeleteStoryVisible() {
      return this.fluxesStore.deleteStory.visible;
    },
  },
  watch: {
    cardList(newValue) {
      if (this.swiper && newValue.length > 0) {
        this.$nextTick(() => {
          this.swiper.slideTo(newValue.length, 0);
        });
      }
    },
  },
  mounted() {
    this.getStories();
  },
  unmounted() {
    this.fluxesStore.resetHighlightCreation();
  },
  methods: {
    async getStories() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      await this.fluxesStore.getCurrentUserStories({
        userId: this.profileStore.myProfileDetail.id,
      });
      this.loading = false;
    },
    slideToEnd() {
      this.$nextTick(() => {
        this.swiper.update();
        this.swiper.slideTo(this.fluxesStore.currentUserStories.length);
      });
    },
    addMediaToStore(file) {
      const templateId = Date.now();
      const item = {
        loading: true,
        id: templateId,
        _original: file,
        createdAt: new Date(),
      };
      this.fluxesStore.currentUserStories.unshift(item);
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
    updateMediaCard(templateId, realData) {
      this.fluxesStore.currentUserStories.forEach((card) => {
        if (card.id === templateId) {
          Object.assign(card, { loading: false }, realData);
        }
      });
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
    handleSelectVisible(menu) {
      this.fluxesStore.storyVisibility = menu;
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
        this.fluxesStore.isCreatingStory = true;
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

      this.fluxesStore.createMediaList.uploadOpen = true;
      this.newType = 'media';

      event.target.value = '';
    },
    async getMediaUrl(file) {
      return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        resolve(url);
      });
    },
    handleBlank() {
      this.fluxesStore.isCreatingStory = true;
      this.fluxesStore.createMediaList.uploadOpen = true;
      this.newType = 'blank';
    },
    onClose() {
      this.resetVisblity();
      if (this.fluxesStore.editStory.visible) {
        if (this.fluxesStore.editStory.fromStory) {
          this.fluxesStore.creationVisible = false;
        }
        this.handleBack();
        return;
      }

      if (this.fluxesStore.isCreatingStory) {
        this.fluxesStore.resetCreationStories();
        return;
      }

      this.fluxesStore.resetCreationStories();
      this.fluxesStore.creationVisible = false;
      this.fluxesStore.currentUserStories = [];
    },
    setMainSlider(swiper) {
      this.swiper = swiper;
    },
    handleBack() {
      this.fluxesStore.isCreatingStory = false;
      this.fluxesStore.resetCreationStories();
      this.newType = '';
      this.fluxesStore.editStory.fromStory = false;
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

      const params = {
        visibility: 'public',
        cover: deepCloneItem.cover,
        files: deepCloneItem.files,
        autoArchiveDate: timeBefore24Hours(),
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
      this.fluxesStore.storyVisibility =
        this.fluxesStore.editStory.item.visibility;
      this.fluxesStore.storiesPreview.isCreatePreview = false;
    },
    resetVisblity() {
      this.fluxesStore.storyVisibility = 'public';
    },
    async handleCreateTextStory() {
      const file = await this.$refs.blankEditor.getCurrentImg();
      const visibility = this.visibilityComputed;
      this.resetVisblity();
      if (!file) {
        this.fluxesStore.createTextStory.loading = false;
        return;
      }
      try {
        this.fluxesStore.createTextStory.loading = true;
        const templateId = this.addMediaToStore(file);

        const uploadedFile = await this.uploadFile(file);
        this.fluxesStore.createMediaList.uploadOpen = false;
        const files = [uploadedFile];

        const params = {
          visibility,
          files,
        };

        const realData = await this.fluxesStore.createStories(params);
        this.updateMediaCard(templateId, realData);
        // This is to update the current users information after creating a story
        this.profileStore.fetchProfile(this.profileStore.myProfileDetail);
        this.$toast.success(this.$t('flux.success.share'));
        this.fluxesStore.onceGetLastestStories();
      } finally {
        this.fluxesStore.createTextStory.loading = false;
        this.fluxesStore.resetCreationStories();
        this.onClose();
      }
    },
    async handleCreateMediaStory(params, file, type) {
      try {
        this.fluxesStore.createMediaStory.loading = true;
        const visibility = this.visibilityComputed;
        this.resetVisblity();

        const uploadedFiles = await this.handleFileUpload(file, type);

        params.files = uploadedFiles;
        params.visibility = visibility;

        if (this.fluxesStore.editStory.visible) {
          this.fluxesStore.editStory.item.loading = true;
          const readyParams = {
            storyId: this.fluxesStore.editStory.item.id,
            visibility,
          };

          if (this.fluxesStore.editStory.type === 'image') {
            readyParams.files = params.files;
          }
          if (this.fluxesStore.editStory.type === 'video') {
            readyParams.imageState = params.imageState;
          }

          await this.fluxesStore.updateStories(readyParams);
          const ownerId = this.profileStore.myProfileDetail.id;
          const index = this.fluxesStore.storiesPreview.data.findIndex(
            (story) => story.owner.id === ownerId,
          );

          this.fluxesStore.onceGetLastestStories();
          if (this.fluxesStore.storiesPreview.isCreatePreview) {
            const data = await this.fluxesStore.getStoryById(
              this.fluxesStore.editStory.item.id,
            );

            if (index !== -1) {
              data._stories = [data];
              this.fluxesStore.storiesPreview.data[index] = data;
            }
          } else {
            await this.fluxesStore.getCurrentUserStories({
              userId: this.profileStore.myProfileDetail.id,
            });

            if (index !== -1) {
              this.fluxesStore.storiesPreview.data[index]._stories =
                this.fluxesStore.currentUserStories;
            }
          }

          this.$toast.success('Successfully updated');
          this.fluxesStore.editStory.item.loading = false;
          this.fluxesStore.createMediaList.uploadOpen = false;

          if (this.fluxesStore.editStory.fromStory) {
            await sleep(500);
            this.fluxesStore.creationVisible = false;
          }
          this.fluxesStore.resetCreationStories();
          return;
        }
        const templateId = this.addMediaToStore(file);
        await sleep(1000);
        this.fluxesStore.createMediaList.uploadOpen = false;

        const realData = await this.fluxesStore.createStories(params);
        this.updateMediaCard(templateId, realData);
        // This is to update the current users information after creating a story
        this.profileStore.fetchProfile(this.profileStore.myProfileDetail);
        this.$toast.success(this.$t('flux.success.share'));
        this.fluxesStore.onceGetLastestStories();
      } finally {
        this.fluxesStore.resetCreationStories();
        this.fluxesStore.createMediaStory.loading = false;
        this.fluxesStore.createMediaList.uploadOpen = false;
        this.onClose();
      }
    },
    handleDelete() {
      this.fluxesStore.deleteStory.visible = false;
    },
    async handleSave() {
      this.fluxesStore.createMediaStory.loading = true;

      if (this.newType === 'blank') {
        this.$refs.blankEditor.handleSave();
      } else {
        await this.$refs.mediaEditor.handleSave();
      }
      const index = this.fluxesStore.editStory.index || 0;
      this.swiper.slideTo(index);
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
    top: 46%;
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
      left: 1.875rem;
      @include r($sm) {
        justify-content: flex-start;
        .icon {
          margin-left: 0.5rem;
        }
      }
    }
    &-next {
      right: 1.875rem;
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

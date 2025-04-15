<template>
  <Swiper
    v-if="storiesData.length"
    ref="storiesMainSlider"
    class="stories-main-slider relative w-full overflow-visible !rounded-5"
    :slides-per-view="slidesPerView"
    :centered-slides="swiperOptions.centeredSlides"
    :slide-to-clicked-slide="true"
    :modules="swiperOptions.modules"
    :space-between="0"
    :allow-touch-move="false"
    @swiper="setMainSlider"
    @slide-change="onSlideChange"
  >
    <SwiperSlide
      v-for="(story, i) in storiesData"
      :key="i"
      class="stories-main-slider__item relative"
      data-cy="7c7dd61c5fbb30aa"
      @click="slideTo(i, speed)"
    >
      <!-- prev -->
      <div
        v-show="isPrevBtnHidden && activeIndex === i"
        class="absolute !-left-11 top-1/2 flex h-12 w-7 cursor-pointer items-center justify-center text-black"
        @click.stop="slidePrev"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-light fa-chevron-left pointer-events-none relative z-10 text-base text-white"
        />
      </div>

      <FluxesPreviewGroupSlider
        :main-story="story"
        :initial-slide="initialSlide"
        :is-on-view="activeIndex !== i"
        :loading="loading && activeIndex === i"
        @swiper="setGroupSlider"
        @slide-change="onGroupSlideChange"
        @share-visible="handleShare"
      >
        <div @click="closeCommentPopup" />
        <div
          class="absolute top-[1rem] z-[200] mt-1 flex w-full items-center justify-between pl-3 pr-4 text-white md:pt-0"
        >
          <div class="relative flex flex-1 items-center">
            <div
              v-if="activeIndex === i"
              class="flex w-full items-center gap-2 truncate text-sm"
            >
              <BaseAvatarNext
                :show-online="false"
                :picture="story.title ? story.cover?.url : story.owner?.picture"
                size="md"
                @click="handleProfileClick(story.owner)"
              />
              <div class="flex flex-1 flex-col">
                <p
                  class="z-50 max-w-[9.375rem] cursor-pointer truncate font-semibold hover:underline"
                  @click="handleProfileClick(story.owner)"
                >
                  {{ story.title ? story.title : story.owner?.name }}
                </p>
                <div class="flex items-center gap-1">
                  <span>
                    {{ timeAgo2(currentStory.createdAt) }}
                  </span>
                  <span>•</span>
                  <PostsItemWidgetsVisibility :visibility="story.visibility" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              v-if="activeIndex === i"
              class="relative z-[101] flex size-6 cursor-pointer items-center justify-center"
              data-cy="5321d984a22bc5c0"
            >
              <FluxesCreationStoryMainWigetsOptions
                v-if="!loading && story._stories"
                :key="groupActiveIndex"
                :item="story._stories[groupActiveIndex]"
                :stories="story._stories"
                :highlight-id="story?.id"
                :source="source"
                @deleted="handleDeleteStory"
                @option-open="onOptionOpen"
                @option-close="onOptionClose"
                @close-story="closeStory"
                @loading="toggleLoading"
                @all-deleted="handleAllDeleted"
                @hide-story="slideNext"
              />
            </span>
            <span
              v-if="activeIndex === i"
              class="relative z-[101] flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
              data-cy="5321d984a22bc5c0"
              @click="handleClickPause"
            >
              <i v-if="!isPaused" class="fa-light fa-pause text-shadow" />
              <i v-if="isPaused" class="fa-light fa-play text-shadow" />
            </span>
            <span
              v-if="activeIndex === i && currVideo"
              class="relative z-[101] flex size-6 cursor-pointer items-center rounded-5 hover:bg-white/5"
              data-cy="579a742924f6e17c"
              @click="handleClickMute"
            >
              <i v-if="isMute" class="fa-regular fa-volume-xmark text-shadow" />
              <i v-if="!isMute" class="fa-regular fa-volume text-shadow" />
            </span>

            <BaseIconClose
              class="text-shadow stories-main-slider__item-btn !flex !size-6 hover:!bg-white/5"
              data-cy="6bcaa1e5ec656ffb"
              @click="closeStory"
            />
          </div>
        </div>
      </FluxesPreviewGroupSlider>
      <!-- next -->
      <div
        v-show="isNextBtnHidden && activeIndex === i"
        class="group absolute !-right-11 top-1/2 z-50 flex h-12 w-7 cursor-pointer items-center justify-center rounded-5 2xl:right-16"
        @click.stop="slideNext"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
        />
      </div>
    </SwiperSlide>

    <div
      class="fixed left-0 top-6 z-[110] hidden rounded-md px-6 py-1.5 hover:bg-[#101010]/40 md:block"
    >
      <div class="flex items-center gap-2">
        <div class="rounded-full bg-[#FFFFFF1A]/10 p-3" @click="closeStory">
          <BaseIconClose
            class="!bg-transparent text-xl"
            data-cy="04c4d606d66f2bc8"
          />
        </div>
        <p>
          {{
            source === 'stories'
              ? $t('flux.highlight.story.plural')
              : $t('flux.highlight.label')
          }}
        </p>
      </div>
    </div>
  </Swiper>
</template>

<script setup>
import { Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  storyId: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    default: 'stories',
  },
});
const fluxesStore = useFluxesStore();
const profileStore = useProfileStore();
const mainSlider = ref(null);
const groupSlider = ref(null);
const autoplayDelay = ref(5000);
const speed = ref(500);
const isPaused = ref(false);
const initialSlide = ref(0);
const interval = ref(null);
const storiesMainSlider = ref(null);
const storiesData = computed(() => fluxesStore.storiesPreview.data);
const groupActiveIndex = ref(0);
const currVideo = ref(null);
const isMute = ref(true);
const router = useRouter();
const loading = ref(false);
const { width, height } = useWindowSize();
const setActiveIndex = () => {
  fluxesStore.storiesPreview.index = activeIndex.value;
};

const setMainSlider = (swiper) => {
  mainSlider.value = swiper;
  if (fluxesStore.storiesPreview.data.length) {
    setProgress();
    slideTo(fluxesStore.storiesPreview.index);
  }
};

const handleProfileClick = (item) => {
  fluxesStore.storyPopup.state = false;
  profileStore.gotoProfilePage({
    id: item.id,
    entityType: item.type,
  });
};

const slidesPerView = computed(() => {
  if (width.value > 648 && height.value < 900) {
    return Math.ceil(
      width.value / ((9 * height.value + height.value * 0.2) / 16),
    );
  }

  return Math.ceil(width.value / 560);
});

const activeIndex = computed(() => mainSlider.value?.activeIndex);
const activeSlide = computed(() => mainSlider.value?.slides[activeIndex.value]);
const sliderGroup = computed(() =>
  activeSlide.value?.querySelector('.stories-group-slider'),
);
const currentStory = computed(() => {
  const _currentStory = storiesData.value[activeIndex.value || 0];

  if (!_currentStory) {
    return null;
  }

  if (_currentStory._stories && _currentStory._stories.length) {
    return _currentStory._stories[groupActiveIndex.value];
  }

  return _currentStory;
});

watch(
  () => currentStory.value,
  (val) => {
    if (!val) {
      return;
    }
    fluxesStore.currentPreviewStory = val.id;
  },
  {
    immediate: true,
  },
);

watch(
  () => fluxesStore.createMediaList.editingHighlightId,
  (newValue, _oldValue) => {
    // This is to reset the story status after adding or deleting a story from highlight
    if (!newValue) {
      loading.value = true;
      slidesChange();
      setTimeout(() => {
        loading.value = false;
        mainSlider.value ? (stopProgress(), setProgress()) : false;
        groupActiveIndex.value = sliderGroup.value.swiper.activeIndex;
      }, 1000);
    }
  },
);
const setGroupSlider = (swiper) => {
  groupSlider.value = swiper;
};

const swiperOptions = ref({
  centeredSlides: true,
  modules: [Keyboard],
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
});

const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowRight':
      slideNext();
      break;
    case 'ArrowLeft':
      slidePrev();
      break;
    default:
      break;
  }
};

const closeStory = () => {
  stopProgress();
  if (fluxesStore.storyViewStartingRoute) {
    fluxesStore.storyPopup.state = false;
    history.replaceState(null, '', fluxesStore.storyViewStartingRoute);
    fluxesStore.storyViewStartingRoute = null;
  } else {
    const profileType = profileStore.myProfileDetail.entityType;
    if (profileType === 'profile') {
      router.push(`/user/hub/${profileStore.myProfileDetail.id}/feed`);
    } else {
      router.push(`/organization/hub/${profileStore.myProfileDetail.id}/feed`);
    }
  }

  fluxesStore.storiesPreview.index = null;
  fluxesStore.storiesPreview.data = [];
  fluxesStore.storiesPreview.loading = false;
  fluxesStore.storiesPreview.startingIndex = 0;
  fluxesStore.isCommentPopupOpen = false;
  fluxesStore.isShareContentVisible = false;
  fluxesStore.reactListPopupVisible = false;
  fluxesStore.storiesPreview.visible = false;
  fluxesStore.storiesPreview.isCreatePreview = false;
  fluxesStore.storyPopup.isHighlight = false;
};

const slideNext = () => {
  const curStory = fluxesStore.storiesPreview.data[activeIndex.value];

  if (!sliderGroup.value.swiper.isEnd) {
    curStory.startingIndex += 1;
    sliderGroup.value.swiper.slideNext(speed.value);
    return;
  }
  curStory.startingIndex = 0;
  mainSlider.value.slideNext();
};

const slidePrev = () => {
  const curStory = fluxesStore.storiesPreview.data[activeIndex.value];
  if (!sliderGroup.value.swiper.isBeginning) {
    curStory.startingIndex -= 1;
    sliderGroup.value.swiper.slidePrev(speed.value);
    return;
  }
  mainSlider.value.slidePrev();
};

const changeStory = () => {
  const curStory = fluxesStore.storiesPreview.data[activeIndex.value];

  const ownerID = curStory.owner.id;
  const highlightId = curStory?.id;
  const storyID = curStory._stories[groupActiveIndex.value].id;
  if (props.source === 'stories') {
    replaceUrl(ownerID, storyID);
  } else {
    replaceUrl(highlightId, storyID);
  }
};

const isPrevBtnHidden = computed(() => {
  if (mainSlider.value) {
    if (sliderGroup.value.swiper.isBeginning && mainSlider.value.isBeginning) {
      return false;
    }
    return true;
  }
  return true;
});

const isNextBtnHidden = computed(() => {
  if (mainSlider.value) {
    if (sliderGroup.value.swiper.isEnd && mainSlider.value.isEnd) {
      return false;
    }
    return true;
  }
  return true;
});

const slideTo = (i, speed = 0) => {
  mainSlider.value.slideTo(i, speed);
};

const setProgress = () => {
  const bullets = sliderGroup.value.querySelectorAll(
    '.swiper-pagination-bullet',
  );
  bullets.forEach((bullet, index) => {
    const span = bullet.querySelector('span');
    span.style.transform = 'translateX(-100%)';
    if (index < sliderGroup.value.swiper.activeIndex) {
      bullet.classList.add('completed');
    } else {
      bullet.classList.remove('completed');
    }
    if (index === sliderGroup.value.swiper.activeIndex) {
      let transform = -100;
      clearInterval(interval.value);
      interval.value = setInterval(() => {
        if (transform < 0 && !isPaused.value) {
          transform += 1;
        }
        span.style.transform = `translateX(${transform}%)`;
        if (transform === 0) {
          stopProgress();
          if (sliderGroup.value.swiper.isEnd) {
            if (mainSlider.value.isEnd) {
              closeStory();
            } else {
              mainSlider.value.slideNext(speed.value);
            }
          } else {
            sliderGroup.value.swiper.slideNext(speed.value);
          }
        }
      }, autoplayDelay.value / 100);
    }
  });
};

const stopProgress = () => {
  clearInterval(interval.value);
};

const onSlideChange = async () => {
  stopProgress();
  isPaused.value = true;
  const curStory = fluxesStore.storiesPreview.data[activeIndex.value];
  const ownerID = curStory.owner.id;
  if (!curStory._stories) {
    loading.value = true;
    await fetchStories(ownerID);
  }

  if (fluxesStore.storiesPreview.data.length) {
    initialSlide.value =
      parseInt(
        fluxesStore.storiesPreview.data[activeIndex.value].startingIndex,
      ) || 0;
  }

  const index = parseInt(curStory.startingIndex);
  const storyID = curStory._stories[index].id;
  const highlightID = curStory?.id;
  if (props.source === 'stories') {
    replaceUrl(ownerID, storyID);
  } else {
    replaceUrl(highlightID, storyID);
  }

  mainSlider.value ? (stopProgress(), setProgress()) : false;
  groupActiveIndex.value = sliderGroup.value.swiper.activeIndex;
  slidesChange();
  loading.value = false;
};

const replaceUrl = (ownerID, storyID) => {
  if (props.source === 'stories') {
    window.history.replaceState(null, '', `/stories/${ownerID}/${storyID}`);
  } else {
    window.history.replaceState(
      null,
      '',
      `/stories/highlights/${ownerID}/${storyID}`,
    );
  }
};

const onGroupSlideChange = () => {
  const curStory = fluxesStore.storiesPreview.data[activeIndex.value];

  if (curStory._stories && curStory.startingIndex < curStory._stories.length) {
    curStory.startingIndex += 1;
  }
  mainSlider.value ? (stopProgress(), setProgress()) : false;
  groupActiveIndex.value = sliderGroup.value.swiper.activeIndex;
  slidesChange();
  changeStory();
};

const slidesChange = () => {
  isPaused.value = false;
  fluxesStore.isCommentPopupOpen = false;
  fluxesStore.isShareContentVisible = false;
  fluxesStore.reactListPopupVisible = false;
  setActiveIndex();
  stopProgress();
  setProgress();
};

const handleClickPause = () => {
  const currIsPaused = isPaused.value;

  isPaused.value = !isPaused.value;

  if (currVideo.value) {
    currVideo.value[currIsPaused ? 'play' : 'pause']();
  }
};

const handleShare = (status) => {
  isPaused.value = !isPaused.value;

  if (currVideo.value) {
    currVideo.value[!status ? 'play' : 'pause']();
  }
};

const handleClickMute = () => {
  const currisMute = isMute.value;

  isMute.value = !isMute.value;

  if (!currVideo.value) {
    return;
  }

  if (currisMute) {
    currVideo.value.muted = false;
  } else {
    currVideo.value.muted = true;
  }
};

const setPause = () => {
  isPaused.value = true;
};

const setPlay = () => {
  isPaused.value = false;
};

provide('SliderTools', {
  stopProgress,
  setProgress,
  setPause,
  setPlay,
  closeStory,
});

const closeCommentPopup = () => {
  fluxesStore.isCommentPopupOpen = false;
};

const fetchStoriesWithPagination = async (
  id,
  limit = 20,
  nextCursor = null,
) => {
  let allRelatedStories = [];

  do {
    const { data: relatedStories, cursor } = await fluxesStore.searchStories({
      ownerId: id,
      status: 'active',
      limit,
      next: nextCursor,
    });

    allRelatedStories = [...allRelatedStories, ...relatedStories];
    nextCursor = cursor?.next || null;
  } while (nextCursor);

  return allRelatedStories;
};

// Refactored fetchStories method
const fetchStories = async (id) => {
  try {
    if (props.source === 'stories') {
      const allRelatedStories = await fetchStoriesWithPagination(id);

      const owner = allRelatedStories[0]?.owner;
      const data = {
        _stories: allRelatedStories,
        startingIndex: 0,
      };

      if (owner?.story?.status === 'active') {
        const nextIndex = fluxesStore.findActiveIndex({
          data: allRelatedStories,
          storyId: owner.story.nextStoryId,
        });
        data.startingIndex = Math.max(0, parseInt(nextIndex));
      }

      fluxesStore.storiesPreview.data.forEach((story) => {
        if (story.owner.id === id) {
          story._stories = data._stories;
          story.startingIndex = data.startingIndex;
        }
      });
    } else {
      const data = await fluxesStore.getStoriesGroupById(id);
      data.stories.forEach((item) => {
        item.owner = data.owner;
      });

      const highlightIndex = fluxesStore.storiesPreview.data.findIndex(
        (story) => story.id === id,
      );

      if (highlightIndex > -1) {
        fluxesStore.storiesPreview.data[highlightIndex]._stories = data.stories;
      }
    }
  } catch (error) {
    console.log(`Failed to fetch related stories for owner ID`, error);
    return [];
  }
};

const getStories = async () => {
  const { id, storyId, source } = props;

  if (!fluxesStore.storiesPreview.data.length) {
    fluxesStore.storiesPreview.loading = true;
    loading.value = true;

    try {
      if (source === 'stories') {
        const allRelatedStories = await fetchStoriesWithPagination(id);

        const owner = allRelatedStories[0]?.owner;
        const nextIndex = fluxesStore.findActiveIndex({
          data: allRelatedStories,
          storyId,
        });

        const data = {
          owner,
          _stories: allRelatedStories,
          startingIndex: Math.max(0, nextIndex),
        };

        fluxesStore.storiesPreview.data = [data];
      } else {
        const data = await fluxesStore.getStoriesGroupById(id);

        data.stories.forEach((item) => {
          item.owner = data.owner;
        });

        data._stories = data.stories;
        data.startingIndex = '0';

        const index = data.stories.findIndex((s) => s.id === storyId);
        if (index > -1) {
          data.startingIndex = index;
        }

        fluxesStore.storiesPreview.data = [data];
      }
    } catch (error) {
      console.log(`Failed to fetch related stories for owner ID`, error);
      return [];
    } finally {
      fluxesStore.storiesPreview.loading = false;
      loading.value = false;
    }
  }
};

const onOptionOpen = () => {
  isPaused.value = true;

  if (currVideo.value) {
    currVideo.value['pause']();
  }
};

const onOptionClose = () => {
  isPaused.value = false;

  if (currVideo.value) {
    currVideo.value['play']();
  }
};
const handleDeleteStory = async (ownerId) => {
  await fetchStories(ownerId);
  mainSlider.value ? (stopProgress(), setProgress()) : false;
  groupActiveIndex.value = sliderGroup.value.swiper.activeIndex;
  loading.value = false;
  isPaused.value = false;
  changeStory();
};

const toggleLoading = (status) => {
  loading.value = status;
};

const handleAllDeleted = (ownerId) => {
  // if it's on last swipper close the story
  if (mainSlider.value.isEnd) {
    closeStory();
    return;
  }

  // Else fetch the next story
  mainSlider.value ? (stopProgress(), setProgress()) : false;
  groupActiveIndex.value = sliderGroup.value.swiper.activeIndex;
  slidesChange();
  loading.value = false;
  fluxesStore.storiesPreview.data = fluxesStore.storiesPreview.data.filter(
    (story) => story.owner.id !== ownerId,
  );
};

const activeGroupSlide = computed(() => {
  const swiper = sliderGroup.value?.swiper;
  if (!swiper) {
    return null;
  }
  const activeIndex = swiper.activeIndex;
  return swiper?.slides?.[activeIndex];
});

onMounted(() => {
  watch(
    () => activeGroupSlide.value,
    async (val) => {
      if (currVideo.value) {
        currVideo.value.muted = true;
        currVideo.value.pause();
        currVideo.value.currentTime = 0;
      }
      if (!isMute.value) {
        isMute.value = true;
      }
      currVideo.value = null;
      await nextTick();
      const video = val?.querySelector('video');
      if (video) {
        isPaused.value = true;
        stopProgress();
        currVideo.value = video;
        if ([2, 3, 4].includes(video.readyState)) {
          video.currentTime = 0;
          video.muted = true;
          video.play();
          autoplayDelay.value = Math.round(video.duration * 1000);
          isPaused.value = false;
          setProgress();
        } else {
          video.addEventListener('loadeddata', () => {
            video.play();
            autoplayDelay.value = Math.round(video.duration * 1000);
            isPaused.value = false;
            setProgress();
          });
        }
      } else {
        if (autoplayDelay.value !== 5000) {
          isPaused.value = true;
          autoplayDelay.value = 5000;
          stopProgress();
          await nextTick();
          isPaused.value = false;
          setProgress();
        }
      }
    },
    { immediate: true },
  );
  getStories();
  document.addEventListener('keydown', handleKeydown);

  // [CU-86c1c73u7] 避免进页面时第一个 story 出现放大动画（脚本部分）
  // console.log('storiesMainSlider', storiesMainSlider.value);
  setTimeout(() => {
    const slider = storiesMainSlider.value?.$el;
    // console.log('slider', slider);
    if (slider) {
      slider.classList.add('--ready');
    }
  }, 100);
});

onUnmounted(() => {
  stopProgress();
  currVideo.value = null;
  document.removeEventListener('keydown', handleKeydown);
});

defineExpose({
  closeStory,
});
</script>
<style lang="scss" scoped>
@use '~/assets/style/mixins' as *;
$xs-width: 480px; // Extra small screens (mobile)
$sm-width: 768px; // Small screens (tablet)
$md-width: 1024px; // Medium screens
$lg-width: 1440px; // Large screens (desktop)

$sm: 767;
$md: 991;
$lg: 1199;
$xl: 1339;

.stories-main-slider {
  overflow: visible !important;
  width: 100% !important;

  &__item {
    width: 35rem;
    aspect-ratio: 9 / 16 !important;
    border-radius: 5px !important;
    transform: scale(0.6) !important;
    opacity: 0.8 !important;
    position: relative !important;
    max-height: 90vh !important;
    will-change: transform, opacity !important;

    @include r($md) {
      width: 50rem;
    }

    @include r($sm) {
      margin: 0 !important;
      border-radius: 0 !important;
      display: flex !important;
      flex-direction: column !important;
    }

    &-btn {
      opacity: 0;
      visibility: hidden;

      @include r($sm) {
        display: none;
      }
    }
  }

  .swiper-slide-prev,
  .swiper-slide-next {
    cursor: pointer !important;
    &:hover {
      opacity: 0.9 !important;
    }
  }

  // [CU-86c1c73u7] 避免进页面时第一个 story 出现放大动画（样式部分）
  &.--ready .swiper-slide-active {
    transition: all 0.6s ease !important;
  }

  .swiper-slide-active {
    transform: scale(1) !important;
    opacity: 1 !important;

    :deep(.stories-group-slider__pagination) {
      opacity: 1 !important;
      visibility: visible !important;
    }

    .stories-main-slider__item-btn {
      opacity: 1 !important;
      visibility: visible !important;
    }
  }

  &__nav {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45rem;
    z-index: 100;
    cursor: pointer;

    @include r($md) {
      width: 58rem;
    }

    @include h($sm) {
      // width: 90% ;
    }

    @include r($sm) {
      width: 100%;
      height: 100%;
    }

    &-prev,
    &-next {
      padding: 0.5rem;
      width: 5rem;
      height: 5rem;
      background-color: #fff;
      border-radius: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      position: absolute;

      transition: background-color 0.3s ease;

      &:hover {
        @include rmin($sm) {
          background-color: #e8e8e8;
        }
      }

      @include r($sm) {
        width: 50%;
        height: 100%;
        background: transparent;

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          background-color: rgba(#fff, 0.5);
          border-radius: 100%;
        }
      }
    }

    &-prev {
      @include r($sm) {
        justify-content: flex-start;

        .icon {
          margin-left: 0.5rem;
        }
      }
    }

    &-next {
      @include r($sm) {
        justify-content: flex-end;

        .icon {
          margin-right: 0.5rem;
        }
      }
    }
  }

  &__btn {
    display: none;

    @include r($sm) {
      position: absolute;
      display: flex;
      top: 1rem;
      right: 0;
      width: 3rem;
      height: 3rem;
      z-index: 200;
    }
  }
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 14.5rem;

  background: linear-gradient(
    0deg,
    rgba(38, 38, 38, 0) 0%,
    rgba(38, 38, 38, 0.7) 100%
  );

  z-index: 10;
}

.text-shadow {
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.5);
}
</style>

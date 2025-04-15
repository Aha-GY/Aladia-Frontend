<template>
  <Swiper
    ref="storiesMainSlider"
    class="stories-main-slider relative w-full overflow-visible"
    :slides-per-view="slidesPerView"
    :centered-slides="swiperOptions.centeredSlides"
    :slide-to-clicked-slide="true"
    :space-between="40"
    :allow-touch-move="false"
    @swiper="setMainSlider"
    @slide-change="onSlideChange"
  >
    <SwiperSlide
      v-for="(story, i) in storiesData"
      :key="i"
      class="stories-main-slider__item !relative"
      data-cy="7c7dd61c5fbb30aa"
      @click="slideTo(i, speed)"
    >
      <FluxesPreviewGroupSlider
        :main-story="story"
        :initial-slide="initialSlide"
        :is-on-view="activeIndex !== i"
        :loading="loading"
        @swiper="setGroupSlider"
        @slide-change="onGroupSlideChange"
        @share-visible="handleShare"
      >
        <div @click="closeCommentPopup" />
        <div
          class="absolute !top-[1.5rem] z-[200] mt-1 flex w-full items-center justify-between pl-3 pr-3 text-white md:pt-0"
        >
          <div
            v-if="activeIndex === i"
            class="flex w-full items-center gap-2 truncate text-sm"
          >
            <BaseAvatarNext
              :show-online="false"
              :picture="story.cover?.url"
              size="md"
              @click="handleProfileClick(story.owner?.id)"
            />
            <div class="flex flex-1 flex-col items-start">
              <p
                class="z-50 max-w-[9.375rem] cursor-pointer truncate font-semibold hover:underline"
                @click="handleProfileClick(story.owner?.id)"
              >
                {{ story?.title || 'Highlight title' }}
              </p>
              <div class="flex items-center gap-1">
                <span>
                  {{ timeAgo2(Date.now()) }}
                </span>
                <span>•</span>
                <PostsItemWidgetsVisibility :visibility="story.visibility" />
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <span
              v-if="activeIndex === i"
              class="relative z-[101] flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
              data-cy="5321d984a22bc5c0"
              @click="handleClickPause"
            >
              <i v-if="!isPaused" class="fa-solid fa-pause text-shadow" />
              <i v-if="isPaused" class="fa-regular fa-play text-shadow" />
            </span>
            <span
              v-if="activeIndex === i && currVideo"
              class="relative z-[101] flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
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
        <div
          v-show="isPrevBtnHidden && activeIndex === i"
          class="absolute !-left-14 top-1/2 flex h-12 w-7 cursor-pointer items-center justify-center text-black"
          @click.stop="slidePrev"
        >
          <div
            class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
          />
          <i
            class="fa-light fa-chevron-left pointer-events-none relative z-10 text-base text-white"
          />
        </div>

        <div
          v-show="isNextBtnHidden && activeIndex === i"
          class="group absolute !-right-14 top-1/2 z-50 flex h-12 w-7 cursor-pointer items-center justify-center rounded-5 2xl:right-16"
          @click.stop="slideNext"
        >
          <div
            class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
          />
          <i
            class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
          />
        </div>
      </FluxesPreviewGroupSlider>
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
        <p>Story Preview</p>
      </div>
    </div>
  </Swiper>
</template>

<script setup>
import { Keyboard } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

const fluxesStore = useFluxesStore();
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
  setProgress();
  slideTo(fluxesStore.storiesPreview.index);
};

const handleProfileClick = (id) => {
  router.push(`/profile/${id}`);
  fluxesStore.storiesPreview.visible = false;
};

const slidesPerView = computed(() => {
  if (width.value > 648 && height.value < 800) {
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
  fluxesStore.storiesPreview.index = null;
  fluxesStore.storiesPreview.visible = false;
  fluxesStore.storiesPreview.data = [];
  fluxesStore.storiesPreview.loading = false;
  fluxesStore.storiesPreview.startingIndex = 0;
  fluxesStore.isCommentPopupOpen = false;
  fluxesStore.isShareContentVisible = false;
  fluxesStore.reactListPopupVisible = false;
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
  initialSlide.value =
    fluxesStore.storiesPreview.data[activeIndex.value].startingIndex;
  mainSlider.value ? (stopProgress(), setProgress()) : false;
  groupActiveIndex.value = sliderGroup.value.swiper.activeIndex;
  setActiveIndex();

  isPaused.value = false;
  stopProgress();
  setProgress();
};

const onGroupSlideChange = () => {
  const curStory = fluxesStore.storiesPreview.data[activeIndex.value];

  if (curStory._stories && curStory.startingIndex < curStory._stories.length) {
    curStory.startingIndex += 1;
  }
  mainSlider.value ? (stopProgress(), setProgress()) : false;
  groupActiveIndex.value = sliderGroup.value.swiper.activeIndex;
  setActiveIndex();
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
  document.addEventListener('keydown', handleKeydown);
  setTimeout(() => {
    const slider = storiesMainSlider.value?.$el;
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
// stories-main-slider__nav-nex
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

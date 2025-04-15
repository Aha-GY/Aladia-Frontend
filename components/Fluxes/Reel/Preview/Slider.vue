<template>
  <div
    class="card relative flex aspect-[9/16] h-full w-full max-w-fit rounded-5"
  >
    <button
      v-show="canSlidePrev"
      class="swiper-button-prev-custom absolute !-left-12 top-1/2 z-10 flex h-12 w-7 scale-100 items-center justify-center rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
      @click="onSlideChange"
    >
      <i
        class="fa-solid fa-chevron-left pointer-events-none relative z-10 text-base text-white"
      />
    </button>
    <button
      v-show="canSlideNext"
      class="swiper-button-next-custom absolute !-right-12 top-1/2 z-10 flex h-12 w-7 scale-100 items-center justify-center rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
      @click="onSlideChange"
    >
      <i
        class="fa-solid fa-chevron-right pointer-events-none relative z-10 text-base text-white"
      />
    </button>

    <Swiper
      class="reels-slider w-fit"
      :allow-touch-move="false"
      :modules="[Navigation, Pagination]"
      :pagination="swiperOptions.pagination"
      :navigation="{
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom',
      }"
      @swiper="onSwiper"
      @slide-change="updateNavigationState"
    >
      <SwiperSlide
        v-for="(reel, i) in slideSource"
        :key="reel.id || i"
        class="reels-slider__item !m-0 !p-0"
      >
        <div class="w-full">
          <FluxesReelPreviewSlideItem ref="sliderRef" :item="reel" :index="i" />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref, computed } from 'vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const props = defineProps({
  id: {
    type: String,
  },
});

const fluxesStore = useFluxesStore();
const socialStore = useSocialStore();

const slideSource = computed(() => fluxesStore.reelPreview.data);

const getReels = async () => {
  if (slideSource.value.length === 0) {
    fluxesStore.reelPreview.loading = true;
    try {
      const currentReel = await socialStore.retreivePost(props.id);

      const data = await socialStore.getPosts({
        type: 'reel',
        limit: 10,
      });

      const filteredData = data.filter((reel) => reel.id !== currentReel.id);

      fluxesStore.reelPreview.data = [currentReel, ...filteredData];
    } catch (error) {
      console.error('Error fetching reels:', error);
    } finally {
      fluxesStore.reelPreview.loading = false;
    }
  }
};

const swiperOptions = ref({
  slidesPerView: 1,
  autoHeight: true,
  centeredSlides: true,
  pagination: {
    el: '.reels-slider__pagination',
    type: 'bullets',
    clickable: false,
    renderBullet: (index, className) =>
      `<div class="${className}"><span></span></div>`,
  },
});

const reelsSlider = ref(null);
const activeIndex = ref(0);

defineExpose({
  activeIndex,
});

const canSlidePrev = computed(() => activeIndex.value > 0);
const canSlideNext = computed(
  () => activeIndex.value < slideSource.value?.length - 1,
);

const onSwiper = (swiperInstance) => {
  reelsSlider.value = swiperInstance;
  updateNavigationState();
};

let timeoutId = null;

const updateNavigationState = async () => {
  if (reelsSlider.value) {
    activeIndex.value = reelsSlider.value.activeIndex;
    pauseVideos();
    playActiveVideo();

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    timeoutId = setTimeout(() => {
      setViewer(fluxesStore.reelPreview.data[activeIndex.value].id);
      timeoutId = null;
    }, 3000);

    const reelId = fluxesStore.reelPreview.data[activeIndex.value].id;
    replaceUrl(reelId);
  }
};

const onSlideChange = () => {
  fluxesStore.reelPreview.isCommentPopupOpen = false;
  fluxesStore.reelPreview.index = -1;
  fluxesStore.reelPreview.isCommentPopupOpen = null;
  fluxesStore.reelPreview.isSharePopupOpen = null;
  fluxesStore.reelPreview.isReactionListPopupOpen = null;
};

const replaceUrl = (reelId) => {
  window.history.replaceState(null, '', `/reels/${reelId}`);
};

// Pause all videos except the current active one
const pauseVideos = async () => {
  const allSlides = document.querySelectorAll('.reels-slider__item video');
  allSlides.forEach((video) => {
    video.pause();
  });
};
// Play the video on the current active slide
const playActiveVideo = () => {
  const activeVideo = document.querySelector(
    `.reels-slider__item:nth-child(${reelsSlider.value.activeIndex + 1}) video`,
  );
  if (activeVideo) {
    activeVideo.play();
  }
};

onMounted(async () => {
  if (slideSource.value.length === 0) {
    await getReels();
  }
});
const setViewer = async (reelId) => {
  await fluxesStore.setSocialReaction({
    entity: {
      id: reelId,
      type: 'reel',
    },
  });
};
</script>

<style lang="scss" scoped>
@use '~/assets/style/mixins' as *;

$sm: 767;
$md: 991;
$lg: 1199;
$xl: 1339;

.reels-slider {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
  @include r($sm) {
    border-radius: 0;
  }

  &__item {
    padding: 0.5rem;
    width: 100%;
    height: 100%;

    &-body {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;

      @include r($sm) {
        font-size: 25px;
      }
    }
  }

  &__pagination {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 2rem;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.8s ease;

    @include r($sm) {
      top: 2rem;
    }

    :deep(.swiper-pagination-bullet) {
      position: relative;
      width: 100%;
      flex-shrink: 10;
      border-radius: 999px;
      height: 4px;
      background-color: rgba(#fff, 0.16);
      overflow: hidden;
      box-shadow: 0 0 1px #00000059;

      margin-right: 0.9rem;

      &:first-child {
        margin-left: 2rem;
      }

      &:last-child {
        margin-right: 2rem;
      }

      span {
        position: absolute;
        background-color: rgba(#fff, 0.8);
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 999px;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
    }
  }
}
</style>

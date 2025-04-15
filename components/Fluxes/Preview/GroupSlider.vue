<template>
  <Swiper
    class="stories-group-slider relative !overflow-visible !overflow-y-clip sm:h-[100%]"
    :allow-touch-move="false"
    :modules="swiperOptions.modules"
    :pagination="swiperOptions.pagination"
    :space-between="40"
    :effect="'fade'"
    @swiper="setSwiperRef"
  >
    <div
      class="swiper-pagination stories-group-slider__pagination !absolute !-top-2 z-[102] h-5 py-5 lg:!-top-1 2xl:!-top-2"
    />
    <SwiperSlide
      v-for="(story, i) in slideSource"
      :key="story.id || i"
      class="stories-group-slider__item relative !flex !items-center !overflow-visible"
    >
      <div
        v-if="loading"
        class="absolute inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80"
      >
        <BaseSpinner />
      </div>

      <FluxesCreationStoryMainCard
        :key="story.id"
        :item="story"
        :loading="loading"
        :is-on-view="isOnView"
        :is-preview-active="fluxesStore.currentPreviewStory === story.id"
        @share-visible="shareVisible"
      >
        <slot />
      </FluxesCreationStoryMainCard>
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Pagination, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

const props = defineProps({
  mainStory: {
    type: Object,
    default: () => ({}),
  },
  initialSlide: {
    type: Number,
    default: 0,
  },
  isOnView: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['share-visible']);
const fluxesStore = useFluxesStore();
let swiperRef = null;

const setSwiperRef = (swiper) => {
  swiperRef = swiper;
  nextTick(() => {
    swiperRef.slideTo(props.mainStory.startingIndex);
  });
};

const slideSource = computed(() => {
  if (props.mainStory.title) {
    props.mainStory._stories.forEach((story) => {
      story.title = props.mainStory.title;
      story.cover = props.mainStory.cover;
    });
  }
  if (props.mainStory._stories) {
    if (!props.mainStory._stories.length) {
      return [props.mainStory];
    }
    return props.mainStory._stories;
  }

  return [props.mainStory];
});

const swiperOptions = ref({
  modules: [Pagination, EffectFade],
  pagination: {
    el: '.stories-group-slider__pagination',
    type: 'bullets',
    clickable: false,
    renderBullet(index, className) {
      return `<div class="${className}">` + `<span>` + `</span>` + `</div>`;
    },
  },
});

const shareVisible = (status) => {
  emit('share-visible', status);
};
</script>

<style lang="scss" scoped>
@use '~/assets/style/mixins' as *;

$sm: 767;
$md: 991;
$lg: 1199;
$xl: 1339;

.stories-group-slider {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 5px;
  @include r($sm) {
    border-radius: 0;
  }

  &__item {
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
    gap: 0.01rem !important;
    align-items: inline-flex !important;
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transition: opacity 1s ease;
    box-sizing: border-box;
    padding-inline: 1rem;

    :deep(.swiper-pagination-bullet) {
      position: relative;
      width: 100%;
      flex-shrink: 10;
      border-radius: 999px;
      height: 2px;
      background-color: rgba(#fff, 0.2);
      overflow: hidden;
      box-shadow: 0 0 1px #00000059;
      opacity: 1;
      margin: 0.07rem !important;

      &:first-child {
        margin-left: 2rem;
      }

      &:last-child {
        margin-right: 2rem;
      }

      &:only-child {
        display: block !important;
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

    :deep(.swiper-pagination-bullet.completed) {
      opacity: var(--swiper-pagination-bullet-opacity, 1);
      background-color: rgba(255, 255, 255, 0.9);
    }
  }
}

.stories-group-slider {
  .swiper-slide {
    opacity: 0;
    z-index: 0;
    visibility: hidden;
  }

  .swiper-slide-active {
    opacity: 1;
    z-index: 1;
    visibility: visible;
  }
}
</style>

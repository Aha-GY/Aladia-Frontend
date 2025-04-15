<template>
  <div class="__media-carousel relative aspect-[1.3] w-full rounded-5">
    <Swiper
      class="size-full"
      :slides-per-view="1"
      :space-between="20"
      :modules="modules"
      :allow-touch-move="false"
      :pagination="paginationOptions"
      @swiper="setSwiper"
    >
      <SwiperSlide
        v-for="(media, index) in mediaList"
        :key="index"
        class="flex items-center justify-center overflow-hidden rounded-5 bg-[#111]"
      >
        <div
          v-if="media.metadata.mimetype.includes('image')"
          class="relative size-full cursor-pointer"
          @click="onMediaClick(media.fileId)"
        >
          <img
            :src="media.url"
            :alt="$t('post.image')"
            class="absolute inset-0 z-20 size-full object-contain"
          />
          <img
            :src="media.url"
            :alt="$t('post.image')"
            class="absolute inset-0 z-10 size-full object-cover blur-[30px]"
          />
        </div>

        <PostsItemWidgetsPlayerPost
          v-else-if="media.metadata.mimetype.includes('video')"
          :video="media"
          custom-style="h-full"
          :options="{
            playbackRate: false,
            aspectRatio: false,
            setting: false,
            pip: false,
            fullscreenWeb: false,
            miniProgressBar: false,
          }"
          class="size-full"
        />

        <PostsItemWidgetsLoomItem
          v-else-if="media.metadata.mimetype.includes('loom')"
          class="size-full overflow-hidden rounded-5"
          :src="media.url"
        />

        <PostsItemWidgetsLocation
          v-else-if="media.metadata.mimetype.includes('location')"
          :location-item="media.location"
          class="!h-full"
        />
      </SwiperSlide>
    </Swiper>

    <!-- navigation buttons -->
    <template v-if="mediaList.length > 1">
      <div
        class="absolute left-4 top-1/2 z-10 flex h-12 w-7 -translate-y-1/2 items-center justify-center"
        @click="slidePrev"
      >
        <div
          :class="
            $isBeginning
              ? 'pointer-events-none !scale-100 opacity-30'
              : 'cursor-pointer opacity-100'
          "
          class="absolute inset-0 z-0 flex h-full w-full scale-100 items-center justify-center rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        >
          <i
            class="fa-light fa-chevron-left pointer-events-none relative z-10 text-base text-white"
          />
        </div>
      </div>

      <div
        class="absolute right-4 top-1/2 z-10 flex h-12 w-7 -translate-y-1/2 items-center justify-center"
        @click="slideNext"
      >
        <div
          :class="
            $isEnd
              ? 'pointer-events-none !scale-100 opacity-30'
              : 'cursor-pointer opacity-100'
          "
          class="absolute inset-0 z-0 flex h-full w-full scale-100 items-center justify-center rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        >
          <i
            class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
          />
        </div>
      </div>
    </template>

    <!-- Numbers -->
    <div
      v-if="mediaList.length > 1"
      class="pointer-events-none absolute right-4 top-4 z-10 whitespace-nowrap rounded-lg bg-black/75 px-2 py-1.5 font-light leading-none text-white/50 shadow-md transition-all duration-300"
    >
      <span>{{ $swiper?.activeIndex + 1 }}</span>
      of
      <span>{{ mediaList.length }}</span>
    </div>
  </div>
</template>

<script setup>
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css/pagination';

const _props = defineProps({
  mediaList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['mediaClick']);

const modules = [Navigation, Pagination];
const $swiper = ref(null);
const paginationOptions = {
  clickable: true,
  enabled: _props.mediaList.length > 1,
};

const $isBeginning = computed(() => $swiper.value?.isBeginning ?? true);
const $isEnd = computed(() => $swiper.value?.isEnd ?? true);

const setSwiper = (swiperInstance) => {
  $swiper.value = swiperInstance;
};

const slidePrev = () => {
  $swiper.value?.slidePrev();
};

const slideNext = () => {
  $swiper.value?.slideNext();
};

const onMediaClick = (fileId) => {
  emit('mediaClick', fileId);
};
</script>

<style lang="scss" scoped>
.__media-carousel {
  :deep(.swiper-pagination) {
    @apply absolute bottom-4 left-1/2 -translate-x-1/2;
    @apply size-auto p-2;
    @apply flex items-center justify-center gap-1.5;
    @apply rounded-full bg-black/50;

    // 当只有一张轮播图时，需要把分页器隐藏
    // 暂时没有找到通过配置来隐藏，所以这里通过 CSS 来隐藏
    &:empty {
      display: none;
    }

    .swiper-pagination-bullet {
      width: 10px;
      height: 10px;
      transform: scale(0.8);
      margin: 0;
      background: rgba(255, 255, 255, 0.5);
      opacity: 1;
      transition: all 0.3s ease;
      cursor: pointer;

      &-active {
        background: rgba(255, 255, 255, 1);
        transform: scale(1);
      }

      &:hover {
        background: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>

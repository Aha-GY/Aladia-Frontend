<!--
Purpose: a carousel to show images, videos and looms attached in a post or a comment
用途：以全屏轮播的方式来展示 Post 或各类评论中的图片、视频和 Loom

设计思路：
- 全屏预览是一个单例，因此放在顶层（`app.vue`）
- 由 `useFullscreenPreview` 管理状态、提供操作方法
-->

<template>
  <div
    v-show="$shouldOpen"
    class="__fullscreen-preview fixed inset-0 z-[200] size-full bg-[#111] px-4 pb-2 pt-9"
  >
    <BaseButtonClose
      class="absolute right-4 top-4 z-10 !size-[52px]"
      size="lg"
      @click="close"
    />

    <div class="flex size-full flex-col items-stretch justify-between gap-2">
      <!-- media swiper -->
      <div class="__media-swiper relative flex-auto">
        <Swiper
          class="h-full w-full overflow-hidden rounded-5"
          :modules="[Navigation, Thumbs]"
          :slides-per-view="1"
          :space-between="12"
          :thumbs="{ swiper: $swiperThumbs }"
          :allow-touch-move="false"
          :initial-slide="$activeIndex"
          @swiper="setMainSwiper"
          @slide-change="onSlideChange"
          @reach-beginning="onReachBeginning"
          @reach-end="onReachEnd"
        >
          <SwiperSlide
            v-for="item in $mediaList"
            :key="item.fileId || item.url"
            class="flex size-full items-center justify-center overflow-hidden rounded-5 bg-[#222]"
          >
            <div
              v-if="item.type === 'image'"
              class="relative size-full cursor-pointer"
            >
              <img
                :src="item.url"
                :alt="$t('post.image')"
                class="absolute inset-0 z-20 size-full object-contain"
              />
              <img
                :src="item.url"
                :alt="$t('post.image')"
                class="absolute inset-0 z-10 size-full object-cover blur-[30px]"
              />
            </div>

            <PostsItemWidgetsPlayerPost
              v-else-if="item.type === 'video'"
              :video="item"
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
              v-else-if="item.type === 'loom'"
              class="size-full overflow-hidden rounded-5"
              :src="item.url"
            />
          </SwiperSlide>
        </Swiper>

        <!-- navigation buttons -->
        <template v-if="$mediaList.length > 1">
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
      </div>

      <!-- thumb swiper -->
      <div class="__thumb-swiper h-[60px] flex-none">
        <Swiper
          :modules="[Thumbs]"
          :slides-per-view="'auto'"
          :space-between="8"
          :watch-slides-progress="true"
          :initial-slide="$activeIndex"
          @swiper="setThumbsSwiper"
        >
          <SwiperSlide
            v-for="item in $mediaList"
            :key="item.fileId || item.url"
            class="!size-[60px] cursor-pointer overflow-hidden rounded-[5px] border border-[#fde030] opacity-30 transition-opacity hover:opacity-50"
          >
            <!-- 图片缩略图 -->
            <img
              v-if="item.type === 'image'"
              :src="item.url"
              class="h-full w-full object-cover"
              alt=""
            />
            <!-- 视频缩略图 -->
            <div
              v-else-if="item.type === 'video'"
              class="relative flex h-full w-full items-center justify-center"
            >
              <video
                :src="item.url"
                class="pointer-events-none absolute z-10 h-full w-full object-cover"
              />
              <i
                class="fa-regular fa-circle-play relative z-20 text-[48px] text-neutral-50/90"
              />
            </div>
            <!-- Loom 缩略图 -->
            <div
              v-else-if="item.type === 'loom'"
              class="flex h-full w-full items-center justify-center bg-gray-800"
            >
              <i
                class="fa-regular fa-circle-play text-[48px] text-neutral-50/90"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const { $shouldOpen, $mediaList, $activeIndex, close } = useFullscreenPreview();

const $swiperMain = ref(null);
const $swiperThumbs = ref(null);

const $isBeginning = ref(true);
const $isEnd = ref(false);

const setMainSwiper = (swiper) => {
  $swiperMain.value = swiper;
  // 初始化状态
  $isBeginning.value = swiper.isBeginning;
  $isEnd.value = swiper.isEnd;
};

const onSlideChange = () => {
  if (!$swiperMain.value) {
    return;
  }
  $isBeginning.value = $swiperMain.value.isBeginning;
  $isEnd.value = $swiperMain.value.isEnd;
};

const onReachBeginning = () => {
  $isBeginning.value = true;
};

const onReachEnd = () => {
  $isEnd.value = true;
};

const setThumbsSwiper = (swiper) => {
  $swiperThumbs.value = swiper;
};

const slidePrev = () => {
  $swiperMain.value?.slidePrev();
};

const slideNext = () => {
  $swiperMain.value?.slideNext();
};

watch($mediaList, () => {
  // 等待 DOM 更新完成后再更新状态
  nextTick(() => {
    if (!$swiperMain.value || !$swiperThumbs.value) {
      return;
    }
    // 滚动到激活的索引
    $swiperMain.value.slideTo($activeIndex.value, 0);
    $swiperThumbs.value.slideTo($activeIndex.value, 0);
    fixThumbActiveClassName();

    $isBeginning.value = $swiperMain.value.isBeginning;
    $isEnd.value = $swiperMain.value.isEnd;
  });
});

// fix: 缩略图的第一项不会自动添加 `.swiper-slide-thumb-active` 这个 class
function fixThumbActiveClassName() {
  const activeIndex = $activeIndex.value;
  const slides = $swiperThumbs.value.slides;
  const activeSlide = slides[activeIndex];
  activeSlide.classList.add('swiper-slide-thumb-active');
}
</script>

<style>
.swiper-button-next,
.swiper-button-prev {
  display: none !important;
}

.swiper-slide-thumb-active {
  opacity: 1 !important;
}
</style>

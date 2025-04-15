<template>
  <div class="relative my-8 px-0 md:my-16 md:px-4">
    <Swiper
      effect="coverflow"
      :grab-cursor="true"
      :centered-slides="true"
      :slides-per-view="'auto'"
      :loop="true"
      :coverflow-effect="{
        rotate: 33,
        stretch: 100,
        depth: 150,
        modifier: 1.5,
        slideShadows: false,
      }"
      :modules="modules"
      class="w-full py-4"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <SwiperSlide
        v-for="(course, index) in courses"
        :key="course.id"
        class="overflow-hidden rounded-md bg-black"
        :style="{
          width: $device.isMobile ? '320px' : '720px',
          height: $device.isMobile ? '240px' : '464px',
        }"
      >
        <MarketVideoItem :course="course" :active="index === activeIndex" />
      </SwiperSlide>
    </Swiper>
    <div
      class="pointer-events-none absolute inset-0 z-30 hidden items-center justify-between px-4 text-[4rem] md:flex"
    >
      <div
        id="prev"
        class="flex size-24 cursor-pointer items-center justify-center"
        data-cy="dd8581db2500c6b5"
        @click="slidePrev"
      >
        <i class="fa-light fa-chevron-left pointer-events-auto" />
      </div>
      <div
        id="next"
        class="flex size-24 cursor-pointer items-center justify-center"
        data-cy="f9f3d5fa30fa4abf"
        @click="slideNext"
      >
        <i class="fa-light fa-chevron-right pointer-events-auto" />
      </div>
    </div>
  </div>
</template>

<script>
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css/effect-coverflow';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const modules = [EffectCoverflow];
    const swiperInstance = ref(null);
    const activeIndex = ref(0);
    const marketStore = useMarketStore();

    const onSwiper = (swiper) => {
      swiperInstance.value = swiper;
      updateActiveIndex();
    };

    const onSlideChange = async () => {
      updateActiveIndex();
      await sleep(300);
      swiperInstance.value.loopFix();
    };

    const updateActiveIndex = () => {
      if (swiperInstance.value) {
        activeIndex.value = swiperInstance.value.realIndex;
      }
    };

    const slidePrev = () => {
      if (swiperInstance.value) {
        swiperInstance.value.slidePrev();
      }
    };

    const slideNext = () => {
      if (swiperInstance.value) {
        swiperInstance.value.slideNext();
      }
    };

    return {
      modules,
      onSwiper,
      onSlideChange,
      activeIndex,
      slidePrev,
      slideNext,
      marketStore,
    };
  },
  computed: {
    courses() {
      return this.marketStore.common.video;
    },
  },
};
</script>

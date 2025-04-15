<template>
  <div>
    <div
      v-if="courses.length && !marketStore.coursesLoading"
      class="relative px-0 md:my-5"
    >
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
            width: $device.isMobile ? '320px' : '466px',
            height: $device.isMobile ? '240px' : '262px',
          }"
        >
          <MarketVideoItem :course="course" :active="index === activeIndex" />
        </SwiperSlide>
      </Swiper>
      <div
        class="pointer-events-none absolute inset-0 bottom-8 z-20 hidden w-full items-center justify-between text-[4rem] md:flex"
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
    <div
      v-if="!courses.length && !marketStore.coursesLoading"
      class="flex h-[16.5rem] w-full items-center justify-center"
    >
      <BaseNoData />
    </div>
    <div
      v-if="marketStore.coursesLoading"
      class="flex h-[16.5rem] w-full items-center justify-center"
    >
      <div v-loading="marketStore.coursesLoading" class="!z-0" />
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

    const onSlideChange = () => {
      updateActiveIndex();
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
      return this.marketStore.courses;
    },
  },
};
</script>

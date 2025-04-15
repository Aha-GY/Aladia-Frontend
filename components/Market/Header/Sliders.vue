<template>
  <div
    v-if="length"
    class="absolute bottom-0 left-0 right-0 z-20 -mb-12 w-full"
    :class="ready ? 'opacity-100' : 'opacity-0'"
  >
    <Swiper
      ref="swiper"
      :round-lengths="true"
      :slides-per-view="slidesPerView"
      :space-between="24"
      :centered-slides="true"
      :allow-touch-move="$device.isMobile"
      :loop="true"
      class="!pt-5"
      @swiper="onSwiper"
      @touch-start="moving = true"
      @touch-end="onTouchEnd"
    >
      <SwiperSlide v-for="(item, index) in categories" :key="index">
        <MarketHeaderSlider :moving="moving" :item="item" />
      </SwiperSlide>
    </Swiper>
    <div
      v-if="!marketStore.categoriesLoading && !$device.isMobile"
      class="pointer-events-none absolute inset-0 z-20 -mb-4 flex items-center transition-all"
    >
      <div
        class="pointer-events-auto absolute left-5 top-1/2 -mt-4 flex h-12 w-7 cursor-pointer items-center justify-center"
        data-cy="0dd02f1b3430ac0d"
        @click="onLeftClick"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-light fa-chevron-left pointer-events-none relative z-10 text-base text-white"
        />
      </div>
      <div
        class="pointer-events-auto absolute right-5 top-1/2 -mt-4 flex h-12 w-7 cursor-pointer items-center justify-center"
        data-cy="719e51bc273580ab"
        @click="onRightClick"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
        />
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
    const { width } = useWindowSize();
    const slidesPerView = computed(() => Math.ceil(width.value / 300));
    const marketStore = useMarketStore();
    return { marketStore, slidesPerView };
  },
  data() {
    return {
      ready: false,
      swiper: null,
      moving: false,
    };
  },
  computed: {
    categories() {
      return this.marketStore.categories;
    },
    length() {
      return this.categories.length;
    },
    active() {
      return this.marketStore.categoryActive;
    },
    categoryId() {
      return this.$route.query?.categoryId;
    },
  },
  watch: {
    async active(index) {
      if (this.swiper) {
        const realIndex = (index + this.length) % this.length;
        this.swiper.slideToLoop(realIndex, 300, true);
        await sleep(300);
        this.swiper.loopFix();
        await this.$nextTick();
        this.swiper.loopFix();
      }
    },
  },
  async mounted() {
    await sleep(300);
    this.ready = true;
  },
  methods: {
    async onSwiper(swiper) {
      this.swiper = swiper;
      if (this.categoryId) {
        const item = this.categories.find(
          (item) => item.id === this.categoryId,
        );
        this.marketStore.categoryActive = item.index;
      }
    },
    onLeftClick() {
      if (this.active === 0) {
        this.marketStore.categoryActive = this.length - 1;
      } else {
        this.marketStore.categoryActive -= 1;
      }
    },
    onRightClick() {
      if (this.active === this.length - 1) {
        this.marketStore.categoryActive = 0;
      } else {
        this.marketStore.categoryActive += 1;
      }
    },
    async onTouchEnd() {
      this.moving = false;
      if (this.swiper && this.$device.isMobile) {
        await sleep(100);
        const active = this.$el.querySelector('.swiper-slide-active');
        const swiperSlideIndex = parseInt(active.dataset.swiperSlideIndex);
        const item = this.categories[swiperSlideIndex];
        this.marketStore.categoryActive = swiperSlideIndex;
        this.$router.push(`/marketplace?categoryId=${item.id}`);
      }
    },
  },
};
</script>

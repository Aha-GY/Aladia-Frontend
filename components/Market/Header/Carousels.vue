<template>
  <Swiper
    id="carousel"
    ref="swiper"
    v-loading="marketStore.categoriesLoading"
    :loop="true"
    class="w-full transition-all"
    :style="{ height: height }"
    :allow-touch-move="$device.isMobile"
    @swiper="onSwiper"
    @touch-move="onTouchMove"
    @touch-end="onTouchEnd"
  >
    <SwiperSlide v-for="item in marketStore.categories" :key="item.id">
      <MarketHeaderCarousel :item="item" />
    </SwiperSlide>
  </Swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const marketStore = useMarketStore();
    return { marketStore };
  },
  data() {
    return {
      swiper: null,
      moving: false,
    };
  },
  computed: {
    categories() {
      return this.marketStore.categories;
    },
    height() {
      if (this.$device.isMobile) {
        return this.marketStore.subCategoriesOpen ? '30rem' : '19rem';
      } else {
        return this.marketStore.subCategoriesOpen ? '37rem' : '25rem';
      }
    },
    categoryId() {
      return this.$route.query?.categoryId;
    },
  },
  watch: {
    'marketStore.categoryActive'() {
      this.setActiveItem();
    },
  },
  mounted() {
    this.setActiveItem();
  },
  methods: {
    async onSwiper(swiper) {
      this.swiper = swiper;
      await sleep(300);
      if (this.categoryId) {
        const item = this.categories.find(
          (item) => item.id === this.categoryId,
        );
        if (item) {
          this.swiper.slideToLoop(item.index, 300, true);
          await sleep(350);
          this.swiper.loopDestroy();
          this.swiper.loopCreate();
        }
      }
    },
    async setActiveItem() {
      if (this.$refs.swiper) {
        const index = this.marketStore.categoryActive;
        this.swiper.slideToLoop(index, 300, true);
        await sleep(350);
        this.swiper.loopDestroy();
        this.swiper.loopCreate();
      }
    },
    onTouchMove() {
      this.moving = true;
    },
    async onTouchEnd() {
      await sleep(150);
      this.moving = false;
      const $item = this.$el.querySelector('.swiper-slide-active');
      if (!$item) {
        return;
      }
      const item = this.categories[$item.dataset.swiperSlideIndex];
      if (this.marketStore.categoryActive !== item.index) {
        this.marketStore.categoryActive = item.index;
        this.$router.push(`/marketplace?categoryId=${item.id}`);
      }
    },
  },
};
</script>

<template>
  <div ref="siderWrap" class="w-full">
    <Swiper
      class="overflow-visible"
      :slides-per-view="slidesPerView"
      :space-between="10"
      :centered-slides="false"
      :slide-to-clicked-slide="false"
      no-swiping-class="swiper-no-swiping"
      @swiper="setMainSlider"
    >
      <SwiperSlide v-for="(card, i) in cardList" :key="card.id">
        <FluxesCreationHighLightWigetsSlideItem
          class="w-[8.375rem]"
          :card="card"
          :curr-index="i"
          :list-count="cardList.length"
          :only-view="true"
        />
      </SwiperSlide>

      <SwiperSlide>
        <FluxesCreationHighLightWigetsNewPanel
          class="w-[8.375rem]"
          :is-sider="true"
          @new-blank="$emit('new-blank')"
          @new-gallery="$emit('new-gallery')"
          @new-media="($event) => $emit('new-media', $event)"
        />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    cardList: {
      type: Array,
      default: () => [],
    },
    activeIndex: Number,
  },
  setup() {
    const siderWrap = ref(null);
    const { width } = useElementSize(siderWrap);
    const slidesPerView = computed(() => width.value / 144);

    return { slidesPerView, siderWrap };
  },
  data() {
    return {
      swiper: null,
    };
  },
  methods: {
    setMainSlider(swiper) {
      this.swiper = swiper;
    },
  },
};
</script>

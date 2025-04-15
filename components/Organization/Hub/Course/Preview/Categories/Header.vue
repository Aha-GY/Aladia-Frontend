<template>
  <div class="relative mb-4 overflow-hidden">
    <Swiper
      v-if="length"
      ref="swiper"
      :loop="true"
      :round-lengths="true"
      :space-between="12"
      slides-per-view="auto"
      :centered-slides="true"
      class="h-20 w-full !pt-4"
      :allow-touch-move="$device.isMobile"
      @swiper="onSwiper"
    >
      <SwiperSlide
        v-for="(item, index) in categories"
        :key="item.id"
        class="relative !h-16 !w-32 shrink-0 origin-bottom cursor-pointer rounded border transition-all duration-300 active:scale-90"
        :class="
          isActive(item)
            ? 'z-[99] -translate-y-[1px] scale-110 border-white'
            : 'border-white/0 hover:scale-105 hover:border-white'
        "
        data-cy="3696955ae3a59843"
        @click="onRowClick(item, index)"
      >
        <img
          class="absolute inset-0 z-0 h-full w-full rounded object-cover"
          :src="item.image?.url"
        />
        <div
          class="relative z-10 flex h-full w-full items-center justify-center overflow-hidden text-center"
        >
          <div
            class="max-w-[90%] truncate rounded bg-black/5 px-2 text-sm backdrop-blur"
          >
            {{ item.name }}
          </div>
        </div>
        <div
          v-if="isActive(item)"
          class="absolute -right-1.5 -top-1.5 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 transition-all hover:rotate-180 hover:scale-125"
          data-cy="19c4384921d1f209"
          @click.stop.prevent="onClose"
        >
          <i class="fa-regular fa-xmark text-xs text-white" />
        </div>
      </SwiperSlide>
    </Swiper>
    <div v-if="length" class="absolute bottom-[2.4rem] left-0 right-0 z-20">
      <div
        class="absolute left-1 top-0 -mt-5 flex h-10 w-5 cursor-pointer items-center justify-center"
        data-cy="7a7cdf30a9376bb2"
        @click="onLeftClick"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-md border border-white/50 bg-black/80 transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-regular fa-chevron-left pointer-events-none relative z-10 text-sm"
        />
      </div>
      <div
        class="absolute right-1 top-0 -mt-5 flex h-10 w-5 cursor-pointer items-center justify-center"
        data-cy="aaf0f5e8d49110e9"
        @click="onRightClick"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-md border border-white/50 bg-black/80 transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-regular fa-chevron-right pointer-events-none relative z-10 text-sm"
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
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      swiper: null,
    };
  },
  computed: {
    categories() {
      return this.hubCourse.categories;
    },
    length() {
      return this.categories.length;
    },
    active() {
      return this.hubCourse.categoryActive;
    },
  },
  watch: {
    async active(index) {
      if (index !== -1) {
        this.swiper.slideToLoop(index, 300, true);
        await sleep(310);
        this.swiper.loopDestroy();
        this.swiper.loopCreate();
      }
    },
  },
  methods: {
    onSwiper(swiper) {
      this.swiper = swiper;
    },
    async onRowClick(item, index) {
      this.hubCourse.categoryId = item.id;
      this.hubCourse.categoryActive = index;
    },
    isActive(item) {
      return this.hubCourse.categoryId === item.id;
    },
    onClose() {
      this.hubCourse.categoryId = null;
    },
    async onLeftClick() {
      const prev = this.active - 6;
      if (prev < 0) {
        this.hubCourse.categoryActive = this.length - 1 + prev;
      } else {
        this.hubCourse.categoryActive = prev;
      }
      if (this.hubCourse.categoryId) {
        this.hubCourse.categoryId = this.categories[this.active].id;
      }
    },
    onRightClick() {
      const next = this.active + 6;
      if (next > this.length - 1) {
        this.hubCourse.categoryActive = next - this.length - 1;
      } else {
        this.hubCourse.categoryActive = next;
      }
      if (this.hubCourse.categoryId) {
        this.hubCourse.categoryId = this.categories[this.active].id;
      }
    },
  },
};
</script>

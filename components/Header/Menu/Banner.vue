<template>
  <div class="relative w-full overflow-hidden">
    <Swiper
      ref="swiper"
      class="swiper-container"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      space-between="20"
      :slides-per-view="1"
      :modules="modules"
      :pagination="pagination"
      @swiper="onSwiper"
    >
      <SwiperSlide v-for="item in banners" :key="item.type">
        <div class="relative h-[193px] w-full">
          <div class="absolute bottom-0 left-0 right-0 top-0 z-[1]">
            <img
              :src="item.img"
              :alt="item.type"
              class="h-full w-full rounded-5 object-cover"
            />
          </div>
          <div class="relative z-[2] px-3.5 py-2" :class="item.textColor">
            <p class="text-2xl font-semibold">{{ $t(item.title) }}</p>
            <p
              v-if="item.type === 'space'"
              class="mt-1 text-xs font-normal"
              v-html="
                $t(item.content, {
                  spaceHtmlOpen: '&lt;b class=&quot;font-bold&quot;&gt;',
                  spaceHtmlClosed: '&lt;/b&gt;',
                })
              "
            />
            <p
              v-else
              class="mt-1 text-xs font-normal"
              :v-html="$t(item.content)"
            />
            <div
              class="mt-2 flex"
              :class="item.type === 'question' ? 'justify-end' : ''"
            >
              <BaseButton
                :type="item.type === 'space' ? 'primary' : 'tertiary'"
                class="text-[#101010] !opacity-100"
                :class="item.btnClass"
              >
                <i :class="item.icon" />
                <span class="font-medium">{{ $t(item.btnText) }}</span>
              </BaseButton>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script>
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

import bannerCourse from '~/assets/images/menu/banner/course.svg';
import bannerQuestion from '~/assets/images/menu/banner/question.svg';
import bannerSpace from '~/assets/images/menu/banner/space.svg';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      banners: [
        {
          img: bannerCourse,
          title: 'nav.header.notification.banner.course.title',
          content: 'nav.header.notification.banner.course.content',
          icon: 'fa-regular fa-play',
          btnText: 'nav.header.notification.banner.course.btnText',
          btnClass: 'bg-[#D9D9D9]/[80] ',
          type: 'course',
          textColor: 'text-[#FFF]',
        },
        {
          img: bannerQuestion,
          title: 'nav.header.notification.banner.question.title',
          content: 'nav.header.notification.banner.question.content',
          icon: 'fa-light fa-question',
          btnText: 'nav.header.notification.banner.question.btnText',
          btnClass: 'bg-[#D9D9D9]',
          type: 'question',
          textColor: 'text-[#D9D9D9]',
        },
        {
          img: bannerSpace,
          title: 'nav.header.notification.banner.space.title',
          content: 'nav.header.notification.banner.space.content',
          icon: 'fa-light fa-plus',
          btnText: 'nav.header.notification.banner.space.btnText',
          btnClass: '!border-b-[0]',
          type: 'space',
          textColor: 'text-[#101010]',
        },
      ],
      modules: [Pagination],
      swiper: null,
      pagination: {
        clickable: true,
        bulletActiveClass: 'active',
        renderBullet(index, className) {
          return `<span class="${className}" data-index="${index}"><span class="dot"></span></span>`;
        },
      },
    };
  },
  methods: {
    onSwiper(swiper) {
      this.swiper = swiper;
    },
  },
};
</script>

<style lang="scss" scoped>
.swiper-container {
  :deep(.swiper-pagination) {
    margin-top: 6px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 16px;

    .swiper-pagination-bullet {
      cursor: pointer;
      padding: 4px 6px;
      &.active {
        .dot {
          width: 1rem;
          height: 0.25rem;
          border-radius: 4px;
        }
      }
      .dot {
        display: block;
        width: 0.5rem;
        height: 2px;
        border-radius: 2px;
        background-color: #fff;
        transition: all 0.3s;
      }
    }
  }
}
</style>

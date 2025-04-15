<template>
  <div class="relative w-full shrink-0 overflow-hidden px-2">
    <Swiper
      ref="swiper"
      class="swiper-container"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      :space-between="8"
      slides-per-view="auto"
      :centered-slides="true"
      :modules="modules"
      @swiper="onSwiper"
    >
      <SwiperSlide
        v-for="(item, index) in banners"
        :key="item.type"
        class="!w-[21.5rem]"
      >
        <div class="relative h-[12.5rem] w-full overflow-hidden rounded-md">
          <div
            class="absolute bottom-0 left-0 right-0 top-0 z-[1] h-full w-full"
          >
            <img
              :src="item.img"
              :alt="item.type"
              class="h-full w-full rounded-5 object-cover"
            />
          </div>
          <div
            class="relative z-[2] flex flex-col gap-2.5 p-4"
            :class="item.textColor"
          >
            <p class="text-2xl font-semibold">{{ $t(item.title) }}</p>
            <p
              class="text-xs"
              :class="item.type === 'activities' ? 'w-[90%]' : ''"
              v-html="$t(item.content)"
            />
            <div class="flex">
              <div
                class="flex cursor-pointer items-center gap-1.5 rounded-5 bg-[#D9D9D9] p-1.5 text-xs text-black"
                data-cy="e24f084c1d47345e"
                @click="onBannerClick(item.type)"
              >
                <i :class="item.icon" />
                <span class="font-medium">
                  {{ $t(item.btnText) }}
                </span>
              </div>
            </div>
            <div class="flex">
              <div
                v-if="item.type === 'share'"
                class="flex cursor-pointer items-center gap-1.5 rounded-5 bg-[#D9D9D9] p-1.5 text-xs text-black"
                data-cy="bd2d61b2764c2438"
                @click="togglePDF"
              >
                <i class="fa-solid fa-share" />
                <span class="font-medium">
                  {{ $t('meet.screen.share.pdf') }}
                </span>
              </div>
            </div>
          </div>
          <div
            v-if="index === currentIndex"
            class="absolute bottom-0 left-0 z-10 h-1 rounded-full bg-white"
            :style="{ width: `${width}%` }"
          />
        </div>
      </SwiperSlide>
    </Swiper>
    <div
      class="absolute left-3 top-[4.75rem] z-10 flex h-12 w-7 cursor-pointer items-center justify-center"
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
      class="absolute right-3 top-[4.75rem] z-10 flex h-12 w-7 cursor-pointer items-center justify-center"
      @click="onRightClick"
    >
      <div
        class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
      />
      <i
        class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
      />
    </div>
    <div class="mt-1.5 flex h-4 items-center justify-center">
      <div
        v-for="(item, index) in banners"
        :key="index"
        class="cursor-pointer px-1.5 py-1"
        @click="goToSlide(index)"
      >
        <div
          class="rounded-full bg-white transition-all"
          :class="currentIndex === index ? 'h-0.5 w-4' : 'h-[1px] w-2'"
        />
      </div>
    </div>
    <!-- <div
      class="absolute bottom-7 left-2 z-10 h-1 rounded-full bg-white"
      :style="{ width: `${width}px` }"
    /> -->
  </div>
</template>

<script>
import { selectSessionStore } from '@100mslive/hms-video-store';
import { Swiper, SwiperSlide } from 'swiper/vue';

import activities from '~/assets/meet/activities.svg';
import polls from '~/assets/meet/polls.svg';
import quiz from '~/assets/meet/quiz.svg';
import recording from '~/assets/meet/recording.svg';
import share from '~/assets/meet/share.svg';
import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      banners: [
        {
          img: activities,
          title: 'meet.banner.activity.label',
          content: 'meet.banner.activity.content',
          icon: 'fa-regular fa-arrow-right',
          btnText: 'meet.banner.activity.btnText',
          type: 'activities',
          textColor: 'text-[#D9D9D9]',
        },
        {
          img: quiz,
          title: 'meet.banner.quiz.label',
          content: 'meet.banner.quiz.content',
          icon: 'fa-solid fa-plus',
          btnText: 'meet.banner.quiz.btnText',
          type: 'quiz',
          textColor: 'text-[#303030]',
        },
        {
          img: polls,
          title: 'meet.banner.poll.title',
          content: 'meet.banner.poll.content',
          icon: 'fa-solid fa-plus',
          btnText: 'meet.banner.poll.btnText',
          type: 'poll',
          textColor: 'text-[#303030]',
        },
        {
          img: share,
          title: 'meet.banner.share.title',
          content: 'meet.banner.share.content',
          icon: 'fa-solid fa-plus',
          btnText: 'meet.banner.share.btnText',
          type: 'share',
          textColor: 'text-[#303030]',
        },
        {
          img: recording,
          title: 'meet.banner.record.title',
          content: 'meet.banner.record.content',
          icon: 'fa-solid fa-record-vinyl',
          btnText: 'meet.banner.record.btnText',
          type: 'record',
          textColor: 'text-[#303030]',
        },
      ],
      modules: [],
      swiper: null,
      isAdmin: null,
      timer: null,
      width: 0,
      currentIndex: 0,
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    hmsHLSState() {
      return this.hmsStore.hmsHLSState;
    },
    isRunning() {
      return this.hmsHLSState?.running;
    },
    hmsPermissions() {
      return this.hmsStore.hmsPermissions;
    },
    hmsWhiteboard() {
      return this.hmsStore.hmsWhiteboard;
    },
    isOwner() {
      return this.hmsLocalPeer.customerUserId === this.hmsWhiteboard?.owner;
    },
    hmsIsSomeoneScreenSharing() {
      return this.hmsStore.hmsIsSomeoneScreenSharing;
    },
    isShare() {
      return this.hmsStore.hmsIsLocalScreenShared || this.hmsWhiteboard?.open;
    },
  },
  mounted() {
    this.init();
  },
  unmounted() {
    this.timer && clearTimeout(this.timer);
  },
  methods: {
    init() {
      this.startAnimation();
      const permissions = this.hmsPermissions?.whiteboard; // Array<'read' | 'write' | 'admin'>
      this.isAdmin = !!permissions?.includes('admin');
    },
    startAnimation() {
      if (this.width >= 100) {
        this.onRightClick();
      } else {
        this.width += 1;
        this.timer = setTimeout(() => this.startAnimation(), 30);
      }
    },
    onSwiper(swiper) {
      this.swiper = swiper;
    },
    onLeftClick() {
      this.swiper.slidePrev();
      this.width = 0;
      this.currentIndex = this.swiper.realIndex;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.startAnimation(), 100);
    },
    onRightClick() {
      this.swiper.slideNext();
      this.width = 0;
      this.currentIndex = this.swiper.realIndex;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.startAnimation(), 100);
    },
    goToSlide(index) {
      this.swiper.slideTo(index);
      this.width = 0;
      this.currentIndex = this.swiper.realIndex;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.startAnimation(), 100);
    },
    onBannerClick(type) {
      switch (type) {
        case 'activities':
          break;
        case 'quiz':
          this.hmsStore.pollId = null;
          this.hmsStore.openPopup = 'quiz';
          break;
        case 'poll':
          this.hmsStore.pollId = null;
          this.hmsStore.openPopup = 'poll';
          break;
        case 'share':
          this.toggleWhiteboard();
          break;
        case 'record':
          this.toggleRecording();
          break;
        default:
          break;
      }
    },
    async toggleWhiteboard() {
      if (!this.isAdmin) {
        return;
      }
      if (this.hmsWhiteboard?.open) {
        // this.isOwner &&
        //   (await hmsActions.interactivityCenter.whiteboard.close(
        //     this.hmsWhiteboard.id,
        //   ));
      } else {
        await hmsActions.interactivityCenter.whiteboard.open();
        const shareIds =
          hmsStore.getState(selectSessionStore('shareIds')) || [];
        if (!shareIds.includes(this.hmsLocalPeer.id)) {
          hmsActions.sessionStore.set('shareIds', [
            ...shareIds,
            this.hmsLocalPeer.id,
          ]);
        }
      }
    },
    toggleRecording() {
      if (this.isRunning) {
        // this.stopHLS();
      } else {
        this.hmsStore.dialog.hls = true;
      }
    },
    togglePDF() {
      if (!this.isShare) {
        this.hmsStore.dialog.pdf = true;
      }
    },
  },
};
</script>

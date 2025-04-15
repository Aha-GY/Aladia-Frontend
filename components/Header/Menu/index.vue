<template>
  <div style="height: calc(-8.5rem + 100vh + 3.75rem)">
    <div
      class="flex flex-col items-baseline justify-between bg-[#121212] p-4 text-[1.25rem] text-white/80 md:flex-row md:items-center"
    >
      <div class="flex items-center gap-5">
        <i class="fa-regular fa-grid" />
        {{ $t('nav.header.menu') }}
      </div>
    </div>

    <div class="mt-2 px-4">
      <div class="h-[13.625rem]">
        <HeaderMenuBanner />
      </div>
    </div>

    <div class="overflow-y-auto px-2" style="height: calc(100% - 20.5rem)">
      <div class="mt-4">
        <div class="flex items-center gap-4 px-5">
          <span class="text-sm text-[#707070]">
            <i class="fa-light fa-globe-pointer" />
          </span>
          <span class="text-base text-white">
            {{ $t('nav.header.notification.view.general') }}
          </span>
        </div>
        <div class="mt-6 grid grid-cols-4 place-items-center gap-3">
          <div
            v-for="menu in viewsMenus"
            :key="menu.key"
            class="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md transition-all active:scale-95"
            data-cy="5927c57a3e19854b"
            @click="goLink(menu.link)"
          >
            <div
              class="flex h-[4rem] w-[4rem] items-center justify-center rounded-5 bg-[#E2E2E2]/10 transition-all group-hover:bg-[#E2E2E2]/20"
            >
              <img
                :src="menu.icon"
                :alt="$t(menu.name)"
                class="h-8 w-8 object-contain"
              />
            </div>
            <div class="text-base text-[#F1F1F1]">{{ $t(menu.name) }}</div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <div class="flex items-center gap-4 px-5">
          <span class="text-sm text-[#707070]">
            <i class="fa-light fa-circle-bolt" />
          </span>
          <span class="text-base text-white">
            {{ $t('nav.header.actions.quick') }}
          </span>
        </div>
        <div class="mt-6 grid grid-cols-4 place-items-start gap-3">
          <div
            v-for="menu in actionMenus"
            :key="menu.key"
            class="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md transition-all active:scale-95"
          >
            <div
              class="relative flex h-[4rem] w-[4rem] items-center justify-center rounded-5 bg-[#E2E2E2]/10 transition-all group-hover:bg-[#E2E2E2]/20"
            >
              <img
                :src="menu.icon"
                :alt="$t(menu.name)"
                class="h-8 w-8 object-contain"
              />
              <div class="absolute right-0 top-0">
                <span
                  class="flex items-center justify-center rounded-bl-[0.3125rem] bg-[#060606] p-[2px]"
                >
                  <i class="fa-light fa-bolt h-3 w-3 scale-75 text-xs" />
                </span>
              </div>
            </div>
            <div
              class="text-center text-base text-[#F1F1F1]"
              :class="['post'].includes(menu.type) ? 'px-2' : 'px-0.5'"
            >
              {{ $t(menu.name) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActionIconChat from '~/assets/images/menu/actions/chat.svg';
import ActionIconCourse from '~/assets/images/menu/actions/course.svg';
import ActionIconEvent from '~/assets/images/menu/actions/event.svg';
import ActionIconPost from '~/assets/images/menu/actions/post.svg';
import ActionIconSpace from '~/assets/images/menu/actions/space.svg';
import ViewsIconCalendar from '~/assets/images/menu/views/calendar.svg';
import ViewsIconChat from '~/assets/images/menu/views/chat.svg';
import ViewsIconFeed from '~/assets/images/menu/views/feed.svg';
import ViewsIconPayment from '~/assets/images/menu/views/payment.svg';
import ViewsIconQa from '~/assets/images/menu/views/qa.svg';
import ViewsIconReview from '~/assets/images/menu/views/review.svg';
import ViewsIconSpace from '~/assets/images/menu/views/space.svg';

export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  computed: {
    isUser() {
      return this.authStore.isUser;
    },
    viewsMenus() {
      return [
        {
          name: 'index.sidebar.item.feed',
          key: 'Feed',
          icon: ViewsIconFeed,
          link: 'feed',
        },
        {
          name: 'course.header.calender',
          key: 'Calendar',
          icon: ViewsIconCalendar,
          link: 'calendar',
        },
        {
          name: 'nav.header.notification.banner.space.name',
          key: 'Space',
          icon: ViewsIconSpace,
          link: 'spaces',
        },
        {
          name: 'nav.header.notification.banner.payment.name',
          key: 'Payment',
          icon: ViewsIconPayment,
          link: 'payment',
        },
        {
          name: 'course.header.qa',
          key: 'Q&A',
          icon: ViewsIconQa,
          link: 'qa',
        },
        {
          name: 'course.header.chat',
          key: 'Chat',
          icon: ViewsIconChat,
          link: 'chat',
        },
        {
          name: 'course.header.review',
          key: 'Review',
          icon: ViewsIconReview,
          link: 'review',
        },
      ];
    },
    actionMenus() {
      return [
        {
          name: 'nav.header.notification.banner.course.title',
          key: 'Create Course',
          icon: ActionIconCourse,
          type: 'course',
        },
        {
          name: 'nav.header.notification.banner.event.title',
          key: 'New Event',
          icon: ActionIconEvent,
          type: 'event',
        },
        {
          name: 'nav.header.notification.banner.chat.title',
          key: 'Create Chat Room',
          icon: ActionIconChat,
          type: 'chat',
        },
        {
          name: 'nav.header.notification.banner.space.name',
          key: 'New Space',
          icon: ActionIconSpace,
          type: 'space',
        },
        {
          name: 'nav.header.notification.banner.post.title',
          key: 'Create Post',
          icon: ActionIconPost,
          type: 'post',
        },
      ];
    },
  },
  methods: {
    goLink(name) {
      return this.$router.push(`${this.authStore.hub}/${name}`);
    },
  },
};
</script>

<template>
  <div class="relative bg-[#060606]">
    <div
      class="flex flex-col items-baseline justify-between bg-[#121212] p-4 text-[1.25rem] text-white/80 md:flex-row md:items-center"
    >
      <div class="hidden items-center gap-5 md:flex">
        <i class="fa-regular fa-bell" />
        {{ $t('nav.header.notification.list.title') }}
      </div>
      <div class="flex items-center gap-1">
        <BaseButton
          type="tertiary"
          size="small"
          class="!border-[1px] !border-white/30 !px-1 !py-0.5 !leading-normal"
          data-cy="b0d3183797471da8"
          @click="notificationStore.readAll()"
        >
          {{ $t('nav.header.notification.list.markAllAsRead') }}
        </BaseButton>
        <BaseButton
          type="tertiary"
          size="small"
          class="!border-[1px] !border-white/30 !px-1 !py-0.5 !leading-normal"
          data-cy="a74c9da838eb936c"
          @click="notificationStore.toggleAlert()"
        >
          {{
            notificationStore.alert
              ? $t('nav.header.notification.alert.disable')
              : $t('nav.header.notification.alert.enable')
          }}
        </BaseButton>
        <div
          class="ml-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/15 hover:text-white/80"
          data-cy="7d9e48e031060a79"
          @click="showSetting = true"
        >
          <i class="fa-solid fa-gear text-sm" />
        </div>
      </div>
    </div>
    <div ref="container" class="relative flex flex-col">
      <el-scrollbar
        ref="scroll"
        wrap-class="overscroll-contain"
        height="calc(100vh - 8.5rem)"
        @scroll="onScroll"
      >
        <div
          v-if="notificationStore.list.length > 0"
          ref="list"
          class="flex flex-col text-base"
        >
          <template
            v-for="(item, index) in notificationStore.list"
            :key="item.id"
          >
            <div v-if="isNewDate(index)" class="px-6 py-2">
              {{
                isToday(item.updatedAt)
                  ? $t('nav.header.update.today')
                  : isYesterday(item.updatedAt)
                    ? $t('nav.header.update.yesterday')
                    : $t('nav.header.update.later')
              }}
            </div>
            <HeaderNoticeItem :item="item" :open="open" />
          </template>
        </div>

        <div
          v-if="isScroll && !showSetting"
          class="absolute bottom-2 right-3 z-50 flex -translate-y-1/2 cursor-pointer items-center justify-center"
          data-cy="ec5fc0ef7f97f1a8"
          @click="scrollToTop"
        >
          <div
            class="text-white/19 flex size-[1.875rem] items-center justify-center rounded-full bg-[#E0BA2B] text-[#252525] hover:bg-[#B79A29] active:scale-95"
          >
            <i class="fa-solid fa-chevron-up text-xs" />
          </div>
        </div>
        <div v-show="notificationStore.listLoading" class="flex flex-col">
          <div v-for="i in 6" :key="i" class="flex gap-2 p-4">
            <BaseSkeleton :length="1" class="w-10" height="2rem" />
            <BaseSkeleton :length="1" class="flex-1" height="2rem" />
          </div>
        </div>
      </el-scrollbar>
      <BaseNoData v-if="notificationStore.list.length === 0" />
    </div>
    <HeaderNoticeSetting :is-show="showSetting" @hide="showSetting = false" />
    <HeaderNoticeProfileVisitor v-if="notificationStore.showVisitors" />
  </div>
</template>

<script>
import WebSocketService from '~/utils/websocket';

export default {
  props: {
    open: Boolean,
  },
  setup() {
    const websocket = WebSocketService.getInstance();
    const notificationStore = useNotificationStore();
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    return { notificationStore, hubChatStore, websocket, authStore };
  },
  data() {
    return {
      loading: false,
      isScroll: false,
      showSetting: false,
    };
  },
  watch: {
    'notificationStore.show'(val) {
      if (val) {
        this.sendBellClicked();
      }
    },
    'authStore.context'() {
      this.load();
    },
  },
  async mounted() {
    if (this.notificationStore.initialized) {
      return;
    }
    this.load();
  },
  methods: {
    async load() {
      this.notificationStore.params.next = null;
      this.notificationStore.initialized = true;
      this.hubChatStore.getTotalUnreadMessages();
      await this.notificationStore.getSettings();
      await this.getList();
      const events = this.websocket.socket._callbacks;
      if (events && events['$notification']) {
        return;
      }
      this.websocket.on('notification', async (eventData) => {
        const { type } = eventData;
        switch (type) {
          case 'follow':
            this.notificationStore.removeByType('follow');
            break;
          case 'profile-view':
            this.notificationStore.removeByType('profile-view');
            break;
          default:
            break;
        }
        this.notificationStore.list.unshift(eventData);
        this.notificationStore.totalUnread++;
        if (this.notificationStore.show) {
          this.websocket.send('notification-bell-clicked', {
            lastSeenNotificationDate: this.notificationStore.list[0]?.updatedAt,
          });
        }
      });
      this.websocket.on('user', async (eventData) => {
        const {
          type,
          data: { lastSeenNotificationDate },
        } = eventData;
        if (type === 'notification-bell-clicked') {
          this.notificationStore.lastSeenNotificationDate =
            lastSeenNotificationDate;
        }
      });
    },
    sendBellClicked() {
      const lastSeenNotificationDate =
        this.notificationStore.list[0]?.updatedAt;
      this.notificationStore.lastSeenNotificationDate =
        lastSeenNotificationDate;
      this.websocket.send('notification-bell-clicked', {
        lastSeenNotificationDate,
      });
    },
    async getList() {
      this.loading = true;
      try {
        await this.notificationStore.getList();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    onScroll(e) {
      const { scrollTop } = e;
      if (scrollTop > 0) {
        this.isScroll = true;
        if (
          Math.round(this.$refs.container.offsetHeight) + scrollTop >=
            this.$refs.list.clientHeight &&
          this.notificationStore.params.next &&
          !this.notificationStore.listLoading
        ) {
          this.notificationStore.getList(true);
        }
      } else {
        this.isScroll = false;
      }
    },
    scrollToTop() {
      const scroll = this.$refs.scroll;
      scroll.scrollTo({
        top: 0,
        behavior: `smooth`,
      });
    },
    isNewDate(index) {
      if (index === 0) {
        return true;
      }
      const prev = this.notificationStore.list[index - 1];
      if (diffDays(prev.updatedAt) > 1) {
        return false;
      }
      const current = this.notificationStore.list[index];
      return (
        new Date(prev.updatedAt).getDate() !==
        new Date(current.updatedAt).getDate()
      );
    },
  },
};
</script>

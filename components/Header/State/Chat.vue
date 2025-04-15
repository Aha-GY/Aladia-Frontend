<template>
  <el-popover
    :visible="hubChatStore.showPopup"
    trigger="click"
    :show-arrow="false"
    :popper-style="{
      padding: '0px !important',
      width: '30rem',
    }"
    :teleported="false"
  >
    <template #reference>
      <div
        ref="chatRef"
        class="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-base leading-none transition-all hover:bg-white/10 active:scale-95"
        :class="
          hubChatStore.showPopup
            ? 'bg-white/10'
            : 'text-[#D9D9D9]/80 hover:text-[#D9D9D9]'
        "
        data-cy="HeaderStateChat-message-icon"
        @click="hubChatStore.showPopup = !hubChatStore.showPopup"
      >
        <div
          v-if="hubChatStore.totalUnreadMessages"
          class="absolute top-1 z-10 flex items-center justify-center rounded-full bg-[#FFE072] px-1 py-0.5 text-10 leading-none text-[#252525]"
          :class="
            hubChatStore.totalUnreadMessages > 9999
              ? '-right-2'
              : hubChatStore.totalUnreadMessages > 99
                ? '-right-1'
                : hubChatStore.totalUnreadMessages > 9
                  ? 'right-0'
                  : 'right-1'
          "
        >
          {{ badge }}
        </div>
        <BaseRipple class="!rounded-md">
          <i class="fa-solid fa-message" />
        </BaseRipple>
      </div>
    </template>
    <div>
      <div
        class="flex flex-col items-baseline justify-between bg-[#121212] p-4 text-[1.25rem] text-white/80 md:flex-row md:items-center"
      >
        <div class="flex items-center gap-5">
          <i class="fa-regular fa-comment" />
          {{ $t('nav.header.notification.banner.chat.name') }}
        </div>
      </div>
      <OrganizationHubChat :is-popup="true" />
    </div>
  </el-popover>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const hubChatStore = useHubChatStore();
    const chatRef = ref(null);
    onClickOutside(
      chatRef,
      () => {
        hubChatStore.showPopup = false;
      },
      {
        ignore: [
          '.el-popper',
          '.chat-preview',
          '.el-dialog',
          '#loom-sdk-record-overlay-shadow-root-id',
        ],
      },
    );
    return { hubChatStore, authStore, chatRef };
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    badge() {
      if (this.hubChatStore.totalUnreadMessages > 999) {
        return `${(this.hubChatStore.totalUnreadMessages / 1000).toFixed(1)}k`;
      } else {
        return this.hubChatStore.totalUnreadMessages;
      }
    },
    id() {
      return this.authStore.context;
    },
  },
  watch: {
    'hubChatStore.showPopup'(val) {
      if (val && this.hubChatStore.roomsList.length === 0) {
        this.hubChatStore.getListRooms();
      }
    },
  },
  methods: {
    goToChat() {
      return this.$router.push(`${this.authStore.hub}/chat`);
    },
  },
};
</script>
<style lang="scss">
.dialog-popup-chat {
  .el-overlay-dialog {
    background-color: rgba(255, 255, 255, 0);
  }
}
</style>

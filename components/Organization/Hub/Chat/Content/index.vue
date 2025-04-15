<template>
  <div
    class="chat-bg flex h-full flex-1 flex-col truncate max-sm:hidden"
    :class="[
      isPopup
        ? isChat
          ? 'absolute left-0 right-0 top-0 bg-[#101010]'
          : 'absolute right-0 top-0 hidden'
        : '',
      isMobileChat
        ? 'max-sm:absolute max-sm:left-0 max-sm:right-0 max-sm:top-0 max-sm:!flex'
        : '',
    ]"
    :style="{
      userSelect: hubChatStore.dragging ? 'none' : 'auto',
    }"
  >
    <OrganizationHubChatContentHeader
      :is-select="isSelect"
      :on-select="onSelect"
      :actives="actives"
      :is-popup="isPopup"
      :is-lateral="isLateral"
      @locate-message="locateMessage($event, true, true)"
      @on-search="searchShow = $event"
    />
    <OrganizationHubChatContentAnswers
      ref="answers"
      :is-select="isSelect"
      :on-reply="onReply"
      :actives="actives"
      :on-change="onChange"
      :on-select="onSelect"
      :popup-room="popupRoom"
      :is-popup="isPopup"
      :is-lateral="isLateral"
      :search-show="searchShow"
      @read-message="$emit('read-message', $event)"
      @read-reaction="$emit('read-reaction', $event)"
      @sent="scrollToBottom"
    />
    <div
      class="flex min-h-[3.25rem] w-full items-end gap-1 overflow-visible whitespace-normal"
    >
      <OrganizationHubChatContentEditor
        :reply-item="replyItem"
        :on-reply="onReply"
        :name="isPopup ? 'quill-editor-popup' : 'quill-editor'"
        :is-popup="isPopup"
        :class="!isCanSend ? 'pointer-events-none' : ''"
        :is-lateral="isLateral"
        @sent="scrollToBottom"
        @resize="onResize"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    popupRoom: Boolean,
    isLateral: Boolean,
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();

    return { hubChatStore, authStore };
  },
  data() {
    return {
      isSelect: false,
      replyItem: {},
      actives: [],
      searchShow: false,
    };
  },
  computed: {
    chatId() {
      return this.isLateral
        ? this.hubChatStore.lateralChatId
        : this.isPopup
          ? this.hubChatStore.popupChatId
          : this.hubChatStore.chatId;
    },
    chatInfo() {
      return this.isLateral
        ? this.hubChatStore.lateralChatInfo
        : this.isPopup
          ? this.hubChatStore.popupChatInfo
          : this.hubChatStore.chatInfo;
    },
    isCanSend() {
      return (
        this.chatId &&
        !this.chatInfo?.locked &&
        !this.chatInfo?.deleted &&
        this.chatInfo?.userRole !== 'chat-room-readonly'
      );
    },
    isChat() {
      return (
        this.isPopup &&
        this.chatId &&
        ((this.chatInfo && this.chatInfo.type !== 'space') ||
          this.hubChatStore.popupSpace)
      );
    },
    isMobileChat() {
      return (
        this.chatId &&
        this.hubChatStore.rightSiderType === '' &&
        ((this.chatInfo && this.chatInfo.type !== 'space') ||
          this.hubChatStore.popupSpace)
      );
    },
  },
  methods: {
    onSelect(state) {
      this.isSelect = state;
      if (!this.isSelect) {
        this.actives = [];
      }
    },
    onReply(item) {
      this.replyItem = item;
    },
    onChange(id) {
      if (!this.isSelect) {
        return;
      }
      const index = this.actives.indexOf(id);
      if (index === -1) {
        this.actives.push(id);
      } else {
        this.actives.splice(index, 1);
      }
    },
    scrollToBottom(isSmooth = false) {
      this.$refs.answers?.onEnd(isSmooth);
    },
    locateMessage(id, isSmooth = false, isHighlight = false) {
      this.$refs.answers?.onLocateMessage(id, isSmooth, isHighlight);
    },
    observeUnreadMessage() {
      this.$refs.answers?.observeUnreadMessage();
    },
    observeReactionMessage() {
      this.$refs.answers?.observeReactionMessage();
    },
    onResize() {
      if (this.$refs.answers?.isScrollEnd) {
        this.$refs.answers?.scrollToBottom(true);
      }
    },
    isScrollEnd() {
      return this.$refs.answers?.isScrollEnd;
    },
  },
};
</script>
<style>
.chat-bg {
  background-image: radial-gradient(
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.01) 100%
    ),
    url('~/assets/images/chat-bg.svg');

  background-position: center;
  background-repeat: repeat;
}
</style>

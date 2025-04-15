<template>
  <div class="flex flex-shrink-0 items-center gap-0.5">
    <BaseButton
      v-if="isView"
      size="small"
      icon="fa-solid fa-expand"
      data-tip="Open Overview"
      data-cy="3f7b2426644e644a"
      @click="openSpace"
    />
    <BaseButton
      size="small"
      :label="!noLabel ? '$t:flux.chat.go' : ''"
      icon="fa-solid fa-arrow-up-right-from-square"
      data-cy="OrganizationHubChatRightSide-go-to-chatview"
      @click="goToChat"
    />
  </div>
</template>
<script>
export default {
  props: {
    isView: {
      type: Boolean,
      default: false,
    },
    noLabel: {
      type: Boolean,
      default: false,
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
    spaceId: {
      type: String,
      default: '',
    },
  },
  setup() {
    const authStore = useAuthStore();
    const hubChatStore = useHubChatStore();
    return { authStore, hubChatStore };
  },
  computed: {
    id() {
      return this.authStore.context;
    },
  },
  methods: {
    goToChat() {
      this.hubChatStore.showPopup = false;
      return this.$router.push(`${this.authStore.hub}/chat`);
    },
    openSpace() {
      if (this.isPopup) {
        this.hubChatStore.popupChatId = this.spaceId;
        this.hubChatStore.popupSpace = true;
      } else {
        this.hubChatStore.chatId = this.spaceId;
        this.hubChatStore.popupSpace = true;
      }
    },
  },
};
</script>

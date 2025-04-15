<template>
  <div class="z-20 flex items-center gap-1 text-sm text-white/70">
    <BaseButton
      :disabled="!actives.length"
      icon="fa-sold fa-share"
      @click="onForward"
    >
      {{ $t('base.upload.forward') }} {{ actives.length }}
    </BaseButton>
    <BaseButton
      :disabled="!actives.length"
      icon="fa-sold fa-bookmark"
      :loading="saveLoading"
      data-cy="e2d52544e61eb523"
      @click="onSave"
    >
      {{ $t('base.upload.save') }} {{ actives.length }}
    </BaseButton>
    <OrganizationHubChatContentDelete
      v-if="isCanDelete"
      :messages="messages"
      :disabled="!actives.length"
      :is-button="true"
      :room-id="roomId"
      @delete="onDelete"
    >
      {{ $t('base.editor.delete') }} {{ actives.length }}
    </OrganizationHubChatContentDelete>
  </div>
  <div class="relative flex items-center">
    <BaseButton
      icon="fa-xmark"
      type="secondary"
      data-cy="6e978e9a30be456a"
      @click="onSelect(false)"
    >
      {{ $t('base.upload.cancel') }}
    </BaseButton>
  </div>
</template>
<script>
export default {
  props: {
    isSelect: Boolean,
    onSelect: Function,
    actives: Array,
    roomId: String,
    room: Object,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    const profileStore = useProfileStore();
    return { hubChatStore, profileStore };
  },
  data() {
    return {
      optionsShow: false,
      saveLoading: false,
    };
  },
  computed: {
    roomMsg() {
      return this.hubChatStore.roomsMessages.find(
        (item) => item.id === this.hubChatStore.chatId,
      );
    },
    messages() {
      return this.roomMsg.messages.filter((item) =>
        this.actives.includes(item.id),
      );
    },
    profileId() {
      return this.profileStore.myUserProfileDetail.id;
    },
    orgId() {
      return this.profileStore.myOrgProfileDetail.id;
    },
    isCanDelete() {
      return (
        this.room?.userRole === 'chat-room-owner' ||
        this.room?.userRole === 'chat-room-admin' ||
        this.messages.every((msg) => {
          if (msg.author.type === 'profile') {
            return msg.author.id === this.profileId;
          } else {
            return msg.author.id === this.orgId;
          }
        })
      );
    },
  },
  watch: {
    'hubChatStore.showForward'(val) {
      if (!val) {
        this.onSelect(false);
      }
    },
  },
  methods: {
    onMembers() {
      this.hubChatStore.rightSiderType = 'members';
      this.hubChatStore.isMembersSelect = true;
      this.hubChatStore.membersActives = [];
    },
    async onDelete() {
      if (this.actives.length === 0) {
        return;
      }
      this.onSelect(false);
    },
    async onSave() {
      if (this.actives.length === 0 || this.saveLoading) {
        return;
      }
      this.saveLoading = true;
      await this.hubChatStore.addSavedMessages({
        roomId: this.roomId,
        messageIds: this.actives,
      });
      this.saveLoading = false;
      this.onSelect(false);
    },
    onForward() {
      if (this.actives.length === 0) {
        return;
      }
      this.hubChatStore.showForward = true;
      this.hubChatStore.forwardData = {
        roomId: this.roomId,
        messages: this.actives.map((item) => ({ id: item })),
      };
    },
  },
};
</script>

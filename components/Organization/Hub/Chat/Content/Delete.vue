<template>
  <BaseButton
    v-if="isButton"
    type="error"
    :disabled="disabled"
    icon="fa-trash-can"
    data-cy="75f491b7a6180979"
    @click="showConfirm"
  >
    <slot />
  </BaseButton>
  <div
    v-else
    class="flex cursor-pointer items-center gap-2 p-2 text-[#FF4A4A]/80 transition-all hover:bg-white/5 hover:text-[#FF4A4A]"
    :class="!isIcon ? 'active:scale-95' : ''"
    data-cy="3d157db9be05eab7"
    @click="showConfirm"
  >
    <div class="flex h-4 w-4 items-center justify-center">
      <i class="fa-solid fa-trash-can text-xs" />
    </div>
    <div v-if="!isIcon" class="text-sm">
      {{ $t('base.editor.delete') }}
    </div>
  </div>
  <client-only>
    <el-dialog
      v-model="showDelete"
      :show-close="false"
      align-center
      append-to-body
      width="340px"
      class="!rounded-lg"
    >
      <div
        class="flex flex-col items-center justify-center gap-4 rounded-md border border-[#fff]/10 bg-[#020202] p-4 text-sm"
      >
        <div class="font-bold">
          {{
            isDeleteForAll
              ? 'Delete selected message?'
              : "This action can't be undone"
          }}
        </div>
        <div
          v-if="isDeleteForAll"
          class="flex cursor-pointer items-center gap-2"
          data-cy="d124d2ab0d21306c"
          @click="deleteForAll = !deleteForAll"
        >
          <BaseCheckboxStyle :state="deleteForAll ? 'checked' : 'unchecked'" />
          {{ $t('org.activity.chat.clear.everyone') }}
        </div>
        <div v-else>
          {{ $t('org.activity.chat.clear.warning') }}
        </div>
        <div class="flex items-center gap-4">
          <BaseButton
            type="tertiary"
            data-cy="c237b181ce71788b"
            @click="showDelete = false"
          >
            {{ $t('base.upload.cancel') }}
          </BaseButton>
          <BaseButton
            type="primary"
            data-cy="db1b34d6991c5c26"
            :loading="deleteLoading"
            @click="onDelete"
          >
            {{ $t('base.editor.delete') }}
          </BaseButton>
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
export default {
  props: {
    isIcon: {
      type: Boolean,
      default: false,
    },
    isButton: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    messages: {
      type: Array,
      default: () => [],
    },
    roomId: {
      type: String,
      default: '',
    },
  },
  emits: ['delete'],
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      showDelete: false,
      deleteForAll: true,
      deleteLoading: false,
    };
  },
  computed: {
    isOwner() {
      return this.messages.every(
        (message) => message.author.id === this.$route.params.name,
      );
    },
    userRole() {
      return this.hubChatStore.roomsList.find(
        (room) => room.id === this.hubChatStore.chatId,
      )?.userRole;
    },
    isDeleteForAll() {
      // return (
      //   this.isOwner ||
      //   this.userRole === 'chat-room-admin' ||
      //   this.userRole === 'chat-room-owner'
      // );
      return true;
    },
    messageIds() {
      return this.messages.map((message) => message.id);
    },
  },
  methods: {
    async showConfirm() {
      if (this.disabled) {
        return;
      }
      this.showDelete = true;
    },
    async onDelete() {
      try {
        if (this.deleteLoading) {
          return;
        }
        this.deleteLoading = true;
        await this.hubChatStore.deleteRoomMessages({
          roomId: this.roomId,
          messageIds: this.messageIds,
          deleteForAll: this.deleteForAll,
        });
        this.deleteLoading = false;
        this.showDelete = false;
        this.$emit('delete');
      } catch {
        this.deleteLoading = false;
      }
    },
  },
};
</script>

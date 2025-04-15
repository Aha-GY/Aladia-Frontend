<template>
  <client-only>
    <el-dialog
      :model-value="showDelete"
      align-center
      :show-close="false"
      append-to-body
      width="480"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      class="!rounded-5"
    >
      <div
        class="flex flex-col rounded-5 border border-white/10 bg-[#020202] text-sm text-white/80"
      >
        <div
          class="flex items-center justify-between gap-2 bg-[#0C0C0C] p-4 text-base text-white/60"
        >
          <div class="flex items-center gap-2">
            <i class="fa-regular fa-trash" />
            {{ $t('flux.message.delete.label') }}
          </div>
          <BaseIconClose @click="onCancel" />
        </div>

        <div class="flex flex-col gap-2 px-6 py-4 text-base">
          Are you sure you want to delete these {{ typeTitle }}?
          <div
            v-if="isDeleteForAll"
            class="flex cursor-pointer items-center gap-2 p-2 text-xs"
            @click="deleteForAll = !deleteForAll"
          >
            <BaseCheckboxStyle
              :state="deleteForAll ? 'checked' : 'unchecked'"
            />
            {{ $t('org.activity.chat.clear.everyone') }}
          </div>
        </div>
        <div
          class="flex items-center justify-between gap-4 bg-[#0C0C0C] px-2 py-3"
        >
          <BaseButton type="tertiary" @click="onCancel">
            {{ $t('base.upload.cancel') }}
          </BaseButton>
          <BaseButton
            type="tertiary"
            :loading="deleteLoading"
            class="bg-[#A20F0F]/20 hover:bg-[#A20F0F]/20"
            icon="fa-regular fa-trash"
            @click="save"
          >
            {{
              deleteForAll
                ? $t('base.editor.delete')
                : $t('flux.highlight.story.delete.forMe')
            }}
          </BaseButton>
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'file', // file link
    },
    onDelete: Function,
    onCancel: Function,
    showDelete: Boolean,
  },
  emits: ['delete'],
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      deleteForAll: false,
      deleteLoading: false,
    };
  },
  computed: {
    typeTitle() {
      return this.type === 'file'
        ? 'files'
        : this.type === 'link'
          ? 'links'
          : 'messages';
    },
    isOwner() {
      return this.messages.every(
        (message) => message.author.id === this.$route.params.name,
      );
    },
    userRole() {
      return this.hubChatStore.roomsList.find(
        (room) => room.id === this.hubChatStore.roomId,
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
    async save() {
      try {
        if (this.deleteLoading) {
          return;
        }
        this.deleteLoading = true;
        await this.onDelete(this.deleteForAll);
        this.deleteLoading = false;
      } catch {
        this.deleteLoading = false;
      }
    },
  },
};
</script>

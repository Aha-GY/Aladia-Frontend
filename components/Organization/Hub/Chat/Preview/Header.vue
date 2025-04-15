<template>
  <div class="flex justify-end px-8 py-4">
    <div class="flex items-center">
      <div
        v-if="!viewOnly"
        class="hover-tooltip flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
        data-tooltip="save"
        data-cy="02848c45da406e2c"
        @click="onSave"
      >
        <i class="fa-solid fa-bookmark" />
      </div>
      <!-- <div
        v-if="!viewOnly"
        class="hover-tooltip flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
        data-tooltip="foward"
      >
        <i class="fa-solid fa-share" />
      </div> -->
      <!-- <div
        class="hover-tooltip flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-[#D52222] opacity-80 transition-all hover:bg-white/5 hover:opacity-100"
        data-tooltip="delete"
      >
        <i class="fa-solid fa-trash-can" />
      </div> -->
      <div
        class="hover-tooltip group ml-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
        data-tooltip="close"
        data-cy="57986fb9e9155de6"
        @click="onClose"
      >
        <i
          class="fa-solid fa-xmark text-xl transition-all group-hover:rotate-180"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    viewOnly: Boolean,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  methods: {
    onClose() {
      this.hubChatStore.isPreview = false;
      this.hubChatStore.previewId = null;
    },
    async onSave() {
      const messageId = this.hubChatStore.previewData.find(
        (r) => r.id === this.hubChatStore.previewId,
      )?.messageId;
      await this.hubChatStore.addSavedMessages({
        roomId: this.hubChatStore.chatId,
        messageIds: [messageId],
      });
    },
  },
};
</script>

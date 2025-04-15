<template>
  <div
    v-if="message"
    class="relative flex items-center gap-1.5 overflow-hidden px-2.5 py-1"
  >
    <div class="px-2">
      <i class="fa-solid fa-edit text-xl text-[#FFC700]/80" />
    </div>
    <div
      class="relative flex w-full flex-1 cursor-pointer gap-1.5 rounded-5 px-2.5 py-1"
      data-cy="614fabfe2e1d22d6"
      @click="$emit('locate-reply-message', message.id)"
    >
      <div class="absolute left-0 top-0 h-full w-0.5 bg-[#FFC700]/80" />
      <div
        v-if="message.attachments && message.attachments.length > 0"
        class="max-h-[2.1875rem]"
      >
        <div v-if="message.attachments[0].category === 'file'">
          <BaseEditorAttachment
            :files="message.attachments"
            :is-close="false"
          />
        </div>
        <img
          v-else-if="message.attachments[0].mimetype.includes('image')"
          class="mr-1 max-h-8 max-w-[2.5rem] cursor-pointer object-cover"
          :src="message.attachments[0].url"
        />
        <video
          v-else-if="message.attachments[0].mimetype.includes('video')"
          :src="message.attachments[0].url"
          class="mb-1 max-h-8 max-w-[2.5rem] object-cover"
        />
      </div>
      <div class="flex flex-1 flex-col">
        <div class="mb-0.5 text-sm font-semibold text-[#FFC700]/80">
          {{ $t('org.activity.message.editM') }}
        </div>
        <div
          class="ql-editor leading-3.5 max-h-16 overflow-auto !p-0 text-xs text-white/30"
          style="word-break: break-word"
          v-html="message.content"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  computed: {
    message() {
      return this.hubChatStore.editData.message;
    },
  },
};
</script>

<template>
  <div
    class="relative flex items-center gap-1.5 overflow-hidden rounded-md bg-white/5 px-2.5 py-1"
  >
    <div v-if="!forward" class="px-2">
      <i class="fa-solid fa-share text-xl text-[#FFC700]/80" />
    </div>
    <div
      v-if="forwardMessages.length <= 1"
      class="flex flex-1 flex-col truncate border-l-2 border-[#FFC700] px-2"
    >
      <div class="mb-0.5 text-sm font-semibold text-[#FFC700]/80">
        {{ $t('org.activity.chat.forward.label') }}
      </div>
      <div class="flex gap-2 text-white/60">
        <div class="text-xs">{{ forwardMessages[0]?.author?.fullname }} :</div>
        <div
          class="ql-editor max-h-16 flex-1 overflow-auto !p-0 text-xs [&_p]:overflow-hidden [&_p]:text-ellipsis [&_p]:whitespace-nowrap"
          v-html="forwardMessages[0]?.content"
        />
      </div>
    </div>
    <div
      v-else
      class="flex flex-1 flex-col truncate border-l-2 border-[#FFC700] px-2"
    >
      <div class="mb-0.5 text-sm font-semibold text-[#FFC700]/80">
        {{
          $t('org.activity.chat.forward.description', {
            length: forwardMessages.length,
          })
        }}
      </div>
      <div class="flex-1 truncate text-xs text-white/60">
        {{ $t('org.activity.chat.forward.from') }}
        {{ fromNames }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    forward: Object,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  computed: {
    forwardMessages() {
      if (this.forward) {
        return this.forward.messages;
      }
      return this.hubChatStore.forwardData.messages;
    },
    fromNames() {
      return Array.from(
        new Set(this.forwardMessages.map((message) => message.author.fullname)),
      ).join(', ');
    },
  },
};
</script>

<template>
  <span class="flex items-center truncate text-xs text-white/40">
    <span class="mr-1 flex space-x-1">
      <span v-for="i in 3" :key="i" class="relative flex h-1 w-1">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 opacity-75"
          :style="{ animationDelay: `${i * 0.2}s` }"
        />
        <span class="relative inline-flex h-1 w-1 rounded-full bg-white/40" />
      </span>
    </span>
    <span class="inline-block truncate">
      {{ typingName }}
    </span>
  </span>
</template>
<script>
export default {
  props: {
    roomId: String,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  computed: {
    typingName() {
      const room = this.hubChatStore.roomsTyping.find(
        (room) => room.id === this.roomId,
      );
      if (room && room.typings?.length) {
        const typings = room.typings.map((typing) => typing.name);
        if (typings.length === 1) {
          return this.$t('org.activity.chat.isTyping', {
            name: typings[0],
          });
        } else {
          return typings.join(', ');
        }
      } else {
        return '';
      }
    },
  },
};
</script>

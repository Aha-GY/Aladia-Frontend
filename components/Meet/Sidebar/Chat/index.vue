<template>
  <div
    class="flex h-full w-full flex-col gap-2.5 overflow-hidden rounded-5 border border-white/10 bg-[#060606]"
  >
    <MeetSidebarHeader :title="$t('meet.menu.chat')" icon="fa-comments" />
    <div
      class="chat-bg hide-scrollbar flex h-0 flex-1 flex-col gap-2 overflow-y-auto bg-[#0D0D0D] p-6 pt-2"
    >
      <MeetSidebarChatMessages />
      <MeetSidebarChatSend />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
};
</script>
<style scoped>
.chat-bg {
  background-image: radial-gradient(
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.01) 100%
    ),
    url('~/assets/images/chat-bg.svg');

  background-position: center;
  background-repeat: repeat-x;
}
</style>

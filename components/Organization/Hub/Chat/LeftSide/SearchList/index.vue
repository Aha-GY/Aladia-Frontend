<template>
  <OrganizationHubChatLeftSideSearchListResult
    v-if="query"
    :query="query"
    @locate-room="onLocateRoom"
  />
  <template v-else>
    <OrganizationHubChatLeftSideSearchListTab @tab="onTab" />
    <OrganizationHubChatLeftSideSearchListChat
      v-show="active === 'chat'"
      @locate-room="onLocateRoom"
    />
    <OrganizationHubChatLeftSideSearchListGroups
      v-show="active === 'group'"
      @locate-room="onLocateRoom"
    />
    <OrganizationHubChatLeftSideSearchListSpaces
      v-show="active === 'space'"
      @locate-room="onLocateRoom"
    />
  </template>
</template>
<script>
export default {
  props: {
    query: String,
  },
  emits: ['close'],
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      active: 'chat',
      actives: ['chat', 'group', 'space'],
    };
  },
  methods: {
    onTab(index) {
      this.active = this.actives[index];
    },
    async onLocateRoom(room, message) {
      this.hubChatStore.chatId = room.id;
      this.$emit('close');
      this.hubChatStore.createSearchHistory(room.id);
      if (message) {
        this.hubChatStore.refChats.forEach((chat, index) => {
          if (index || (!index && this.hubChatStore.showPopup)) {
            this.$nextTick(() => {
              chat?.locateMessage(message.id, true, true);
            });
          }
        });
      }
    },
  },
};
</script>

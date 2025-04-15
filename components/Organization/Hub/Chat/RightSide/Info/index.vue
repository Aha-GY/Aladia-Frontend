<template>
  <div class="hide-scrollbar h-full overflow-y-auto">
    <div
      v-loading="hubChatStore.infoLoading"
      class="hide-scrollbar flex flex-col gap-2 pt-2"
    >
      <OrganizationHubChatRightSideInfoHeader />
      <OrganizationHubChatRightSideInfoSections />
      <OrganizationHubChatRightSideInfoCommon v-if="isO2ORoom" />
      <template v-else>
        <OrganizationHubChatRightSideMember />
        <OrganizationHubSidebarInvite v-if="hubSidebar.invite.state" />
      </template>
    </div>
    <OrganizationHubChatLeftSideDelete
      v-if="room"
      :item="room"
      :is-side="true"
    />
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    const hubSpacesStore = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubChatStore, hubSpacesStore, hubSidebar };
  },
  computed: {
    room() {
      return this.hubChatStore.roomInfo;
    },
    isO2ORoom() {
      return this.room?.type === 'one-to-one';
    },
  },
};
</script>

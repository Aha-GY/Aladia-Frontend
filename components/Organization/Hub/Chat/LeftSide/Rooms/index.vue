<template>
  <div class="relative flex h-full flex-col gap-1 pb-2 pt-0 transition-all">
    <div
      v-infinite-scroll="loadRoom"
      :infinite-scroll-disabled="
        hubChatStore.roomListLoading || !hubChatStore.isRoomsMore
      "
      class="hide-scrollbar flex-1 overflow-y-auto overscroll-contain"
    >
      <transition-group
        class="hide-scrollbar flex flex-col gap-0.5 overflow-x-hidden"
        name="room"
        tag="div"
      >
        <OrganizationHubChatLeftSideMember
          v-for="item in hubChatStore.sortRoomList"
          :key="item.id"
          :item="item"
          :is-space-member="false"
          :show-space="showSpace"
          :is-popup="isPopup"
          :data-cy="`rooms-${item.id}`"
          @select="$emit('select', item)"
        />
      </transition-group>
      <template v-if="hubChatStore.roomListLoading">
        <OrganizationHubChatLeftSideSkeleton
          v-for="i in 6"
          :key="i"
          :is-room="true"
        />
      </template>
    </div>
    <div
      v-if="hubChatStore.roomsParams.next"
      class="pointer-events-none absolute bottom-0 left-0 h-12 w-full bg-gradient-to-b from-[rgba(2,2,2,0)] to-[#020202]"
    />
  </div>
</template>
<script>
export default {
  props: {
    active: String,
    showSpace: Boolean,
    isPopup: Boolean,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    const globalStore = useGlobalStore();
    const fluxesStore = useFluxesStore();
    return { hubChatStore, globalStore, fluxesStore };
  },
  data() {
    return {
      name: '',
      isSpace: false,
    };
  },
  methods: {
    async loadRoom() {
      await this.hubChatStore.getListRooms();
    },
    remove(item) {
      const i = this.hubChatStore.roomsList.findIndex((r) => r.id === item.id);
      if (i > -1) {
        this.hubChatStore.roomsList.splice(i, 1);
      }
    },
  },
};
</script>
<style scoped>
.room-move,
.room-enter-active {
  transition: all 0.5s ease;
}
.room-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
</style>

<template>
  <Transition name="space">
    <div
      v-if="isShow"
      class="absolute left-[4.75rem] flex h-full w-[calc(100%-76px)] flex-col bg-[#090909] text-white/80"
    >
      <div class="flex h-[3.125rem] w-full items-center justify-between p-2">
        <div class="flex items-center gap-2 truncate">
          <div class="flex h-11 w-14 items-center justify-center">
            <div
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md px-2 py-1 transition-all hover:bg-white/15 hover:text-white/80"
              data-cy="4926ad1bf1ae9dae"
              @click="$emit('hide')"
            >
              <i class="fa-solid fa-arrow-left" />
            </div>
          </div>
          <div
            class="flex-1 cursor-pointer truncate underline-offset-2 hover:underline"
            @click="$emit('hide')"
          >
            {{ space?.name }}
          </div>
        </div>
        <OrganizationHubChatGo
          v-if="isPopup"
          :is-view="true"
          :space-id="space.id"
          :is-popup="isPopup"
        />

        <BaseButton
          v-else
          size="small"
          icon="fa-solid fa-expand"
          data-tip="Open Overview"
          class="max-sm:flex sm:hidden"
          data-cy="b08e9559cf0447e1"
          @click="openSpace"
        />
      </div>
      <div
        v-infinite-scroll="loadSpaceRoom"
        :infinite-scroll-disabled="spaceListLoading || !isSpaceMore"
        class="hide-scrollbar h-full flex-1 overflow-y-auto"
      >
        <transition-group
          class="flex flex-col gap-0.5 overflow-x-hidden"
          name="room"
          tag="div"
        >
          <OrganizationHubChatLeftSideMember
            v-for="item in roomList"
            :key="item.id"
            :item="item"
            :is-space-member="true"
            :data-cy="`spaces-${item.id}`"
            :is-popup="isPopup"
            @select="$emit('select', item)"
          />
        </transition-group>
        <OrganizationHubChatLeftSideSkeleton
          v-for="i in 6"
          v-show="spaceListLoading && spaceListType === 'space'"
          :key="i"
        />
      </div>
    </div>
  </Transition>
</template>
<script>
export default {
  props: {
    space: Object,
    isShow: Boolean,
    isPopup: Boolean,
  },
  emits: ['hide', 'select'],
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      name: '',
      loading: false,
    };
  },
  computed: {
    roomList() {
      return this.isPopup
        ? this.hubChatStore.sortPopupSpaceRoomList
        : this.hubChatStore.sortSpaceRoomList;
    },
    spaceListLoading() {
      return this.isPopup
        ? this.hubChatStore.popupSpaceListLoading
        : this.hubChatStore.spaceListLoading;
    },
    isSpaceMore() {
      return this.isPopup
        ? this.hubChatStore.popupIsSpaceMore
        : this.hubChatStore.isSpaceMore;
    },
    spaceListType() {
      return this.isPopup
        ? this.hubChatStore.popupSpaceListType
        : this.hubChatStore.spaceListType;
    },
  },
  methods: {
    async loadSpaceRoom() {
      if (this.isPopup) {
        await this.hubChatStore.getPopupSpaceList(this.space.entityId, 'space');
      } else {
        await this.hubChatStore.getSpaceList(this.space.entityId, 'space');
      }
    },
    openSpace() {
      if (this.isPopup) {
        this.hubChatStore.popupChatId = this.space.id;
        this.hubChatStore.popupSpace = true;
      } else {
        this.hubChatStore.chatId = this.space.id;
        this.hubChatStore.popupSpace = true;
      }
    },
  },
};
</script>
<style scoped>
.space-enter-active,
.space-leave-active {
  transition: all 0.2s ease;
}
.space-enter-from,
.space-leave-to {
  transform: translateX(100%);
}
.space-enter-to,
.space-leave {
  transform: translateX(0);
}

.room-move,
.room-enter-active {
  transition: all 0.5s ease;
}
.room-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
</style>

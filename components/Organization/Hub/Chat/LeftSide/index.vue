<template>
  <div
    ref="sidebar"
    class="relative flex h-full w-[22.5rem] flex-shrink-0 flex-col overflow-hidden rounded-l-md bg-black/90 pl-2.5 pr-1.5 max-sm:!w-full"
    :class="[
      isPopup ? (isChat ? 'hidden' : '!w-full') : '',
      isAdding || isSelectRoom ? 'max-sm:hidden' : '',
    ]"
    :style="{
      width: siderWidth ? `${siderWidth}px` : '',
      userSelect: dragging ? 'none' : 'auto',
    }"
  >
    <OrganizationHubChatLeftSideSearch
      ref="search"
      v-model="query"
      :focus="focus"
      :is-focus="isFocus"
      :on-focus="onFocus"
      :is-select="isSelect"
      :is-popup="isPopup"
      :select-change="selectChange"
      :class="isShow ? 'pointer-events-none' : ''"
      @on-close="onClose"
    />
    <Transition name="slide-fade-in" mode="out-in">
      <div v-if="isSearch" class="flex h-0 w-full flex-1 flex-col gap-1.5">
        <OrganizationHubChatLeftSideSearchList
          :query="query"
          @close="onCloseSearch"
        />
      </div>
      <div v-else class="flex h-0 flex-1 flex-col">
        <OrganizationHubChatLeftSideRooms
          :show-space="isShow"
          :is-popup="isPopup"
          @select="onSelect"
        />
      </div>
    </Transition>
    <OrganizationHubChatLeftSideSetting
      v-if="hubChatStore.isSetting && !showSearch"
    />
    <OrganizationHubChatLeftSideSpaces
      :space="isPopup ? hubChatStore.popupSpaceInfo : hubChatStore.spaceInfo"
      :is-show="isShow"
      :is-popup="isPopup"
      @hide="hideSpace"
    />
  </div>
  <div
    v-if="!isPopup"
    class="flex w-1 cursor-col-resize items-center justify-center max-sm:hidden"
    :class="dragging ? 'bg-[#E0B92C]' : 'bg-black'"
    @mouseover="onMouseover"
    @mouseout="onMouseout"
    @mousedown="startResize"
  />
</template>
<script>
export default {
  props: {
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    return { hubChatStore, authStore };
  },
  data() {
    return {
      active: '',
      query: '',
      focus: false,
      isSelect: false,
      isFocus: false,
      dragging: false,
      overTimeout: null,
      isAddRoom: false,
      // space: null,
    };
  },
  computed: {
    isSearch() {
      return this.query || this.focus || this.isSelect || this.isFocus;
    },
    isShow() {
      return this.isPopup
        ? this.hubChatStore.popupShowSpace
        : this.hubChatStore.showSpace;
    },
    isAdding() {
      return (
        this.hubChatStore.rightSiderType === 'create' &&
        this.hubChatStore.roomsList.some((r) => r.id === -1)
      );
    },
    isChat() {
      return (
        this.hubChatStore.popupChatId &&
        ((this.hubChatStore.popupChatInfo &&
          this.hubChatStore.popupChatInfo.type !== 'space') ||
          this.hubChatStore.popupSpace)
      );
    },
    isSelectRoom() {
      return (
        (this.hubChatStore.roomId || this.hubChatStore.chatId) &&
        ((this.hubChatStore.chatInfo &&
          this.hubChatStore.chatInfo.type !== 'space') ||
          this.hubChatStore.popupSpace)
      );
    },
    siderWidth() {
      return (
        this.hubChatStore.siderWidth ||
        this.authStore.user?.preferences?.chat?.width
      );
    },
  },
  watch: {
    '$route.query': {
      deep: true,
      handler(val) {
        if (val.userId && !this.isPopup) {
          this.openRoom(val.userId, 'profile');
        }
        if (val.orgId && !this.isPopup) {
          this.openRoom(val.orgId, 'organization');
        }
      },
    },
  },
  async mounted() {
    if (this.isPopup && !this.hubChatStore.showPopup) {
      return;
    }
    await this.hubChatStore.getListRooms();
    if (this.isPopup || this.$device.isMobile) {
      return;
    }
    if (!this.$route.query.userId && this.hubChatStore.roomsList.length > 0) {
      this.hubChatStore.chatId = this.hubChatStore.sortRoomList?.[0]?.id;
      this.hubChatStore.chatBreadcrumbs = [
        {
          id: this.hubChatStore.roomsList[0].id,
          title: this.hubChatStore.roomsList[0].name,
          subTitle: 'today’s messages',
        },
      ];
    }
    if (this.$route.query.userId) {
      this.openRoom(this.$route.query.userId, 'profile');
    }
    if (this.$route.query.orgId) {
      this.openRoom(this.$route.query.orgId, 'organization');
    }
  },
  methods: {
    openRoom(id, type) {
      this.hubChatStore.openOneToOneRoom(id, type);
    },
    hideSpace() {
      if (this.isPopup) {
        this.hubChatStore.popupShowSpace = false;
        this.hubChatStore.popupChatId = this.hubChatStore.popupSpaceId;
        this.hubChatStore.popupChatInfo = this.hubChatStore.roomsList.find(
          (room) => room.id === this.hubChatStore.popupSpaceId,
        );
      } else {
        this.hubChatStore.showSpace = false;
        this.hubChatStore.chatId = this.hubChatStore.spaceId;
        this.hubChatStore.chatInfo = this.hubChatStore.roomsList.find(
          (room) => room.id === this.hubChatStore.spaceId,
        );
      }
    },
    onSelect(item) {
      if (item.type === 'space') {
        if (this.isPopup) {
          this.hubChatStore.popupSpaceInfo = item;
          this.hubChatStore.popupShowSpace = true;
        } else {
          this.hubChatStore.spaceInfo = item;
          this.hubChatStore.showSpace = true;
        }
      } else {
        if (this.isPopup) {
          this.hubChatStore.popupShowSpace = false;
        } else {
          this.hubChatStore.showSpace = false;
        }
      }
    },
    onFocus(state) {
      this.focus = state;
      if (state) {
        this.isFocus = state;
      }
    },
    onClose() {
      this.isFocus = false;
    },
    onCloseSearch() {
      this.query = '';
      this.focus = false;
      this.isFocus = false;
      this.isSelect = false;
      this.$refs.search.onClose();
    },
    selectChange(state) {
      this.isSelect = state;
    },
    startResize(event) {
      this.initialX = event.clientX;
      this.initialWidth = this.$refs.sidebar.offsetWidth;
      document.addEventListener('mousemove', this.resize);
      document.addEventListener('mouseup', this.stopResize);
    },
    resize(event) {
      this.dragging = true;
      this.hubChatStore.dragging = true;
      requestAnimationFrame(() => {
        const deltaX = event.clientX - this.initialX;
        if (
          this.initialWidth + deltaX <= 200 ||
          this.initialWidth + deltaX >= 800
        ) {
          return;
        }
        this.$refs.sidebar.style.width = `${this.initialWidth + deltaX}px`;
      });
    },
    stopResize() {
      this.dragging = false;
      this.hubChatStore.dragging = false;
      document.removeEventListener('mousemove', this.resize);
      document.removeEventListener('mouseup', this.stopResize);
      this.hubChatStore.siderWidth = this.$refs.sidebar.offsetWidth;
      this.hubChatStore.updatePreferences({
        chat: { width: this.hubChatStore.siderWidth },
      });
    },
    onMouseover() {
      this.overTimeout = setTimeout(() => {
        this.dragging = true;
        this.hubChatStore.dragging = true;
      }, 200);
    },
    onMouseout() {
      this.overTimeout && clearTimeout(this.overTimeout);
      this.dragging = false;
      this.hubChatStore.dragging = false;
    },
    newRoom() {
      if (this.isAdding) {
        // this.hubChatStore.roomsList = this.hubChatStore.roomsList.filter(
        //   (r) => r.id !== -1,
        // );
        this.hubChatStore.rightSiderType = '';
        return;
      }
      this.hubChatStore.rightSiderType = 'create';
      this.hubChatStore.roomId = -1;
    },
  },
};
</script>

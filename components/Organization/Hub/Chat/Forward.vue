<template>
  <client-only>
    <el-dialog
      v-model="hubChatStore.showForward"
      :show-close="false"
      append-to-body
      :close-on-click-modal="false"
      width="680"
      class="!absolute bottom-0 left-0 right-0 top-0 !m-[auto] h-fit !rounded-lg !bg-transparent"
    >
      <div
        class="flex h-[37.5rem] flex-col rounded-5 border border-white/10 bg-[#020202] text-sm text-white/80"
      >
        <div
          class="flex items-center justify-between gap-2 bg-[#0C0C0C] p-4 text-base text-white/60"
        >
          <div class="flex items-center gap-2">
            <i class="fa-regular fa-share" />
            Forward to...
          </div>
          <BaseIconClose @click="onCancel" />
        </div>

        <div class="px-[1.625rem] pt-4">
          <BaseInput
            v-model="query"
            search
            clear
            fixed
            class="mb-3 text-sm"
            placeholder="Search "
          />
        </div>

        <div
          v-if="selectedRooms.length"
          class="hide-scrollbar flex max-h-[18.75rem] flex-wrap items-center gap-1 overflow-y-auto px-4 py-2 text-sm text-white/60"
        >
          <div
            v-for="room in selectedList"
            :key="room.id"
            class="flex items-center gap-2 rounded-full bg-white/5 p-1 px-2 text-white/80 hover:bg-white/10"
          >
            <OrganizationHubChatLeftSideMemberAvatar
              size="small"
              :item="room"
              :show-online="false"
            />
            <div class="flex-1 truncate">{{ room.name }}</div>
            <div
              class="flex size-5 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
              @click="onRemove(room)"
            >
              <i class="fa-solid fa-close text-xs" />
            </div>
          </div>
          <div
            v-if="selectedRooms.length > 6"
            class="flex cursor-pointer items-center gap-2 rounded-3xl bg-white/5 p-1 text-white/70 hover:bg-white/10"
            @click="showMore = !showMore"
          >
            <div
              class="flex size-7 items-center justify-center rounded-full bg-white/5 text-sm"
            >
              <i class="fa-light fa-users" />
            </div>
            <div class="truncate text-13 text-white">{{ label }}</div>
            <div
              class="flex size-5 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
            >
              <i
                class="fa-light fa-chevron-down text-xs transition-all"
                :class="showMore ? 'rotate-180' : ''"
              />
            </div>
          </div>
        </div>

        <div
          v-show="!showSpace"
          v-infinite-scroll="search"
          :infinite-scroll-disabled="
            hubChatStore.searchRoomListLoading ||
            !hubChatStore.isSearchRoomsMore
          "
          class="hide-scrollbar relative h-full w-full flex-1 overflow-auto overflow-y-auto px-4"
        >
          <template v-for="room in searchList" :key="room.id">
            <OrganizationHubChatForwardItem
              :room="room"
              :is-more="true"
              :space-room="room.type === 'space' ? room : null"
              :on-space="onSpace"
              :selected-rooms="selectedRooms"
              :query="query"
              @select-room="onSelect"
            />
          </template>

          <div v-show="loading" class="flex flex-col gap-1 px-2 py-1">
            <BaseSkeleton
              v-for="i in 6"
              :key="i"
              class="rounded-5"
              height="3rem"
              :length="1"
            />
          </div>
        </div>
        <template v-if="showSpace">
          <div class="mx-4 flex items-center gap-1 bg-[#0c0c0c] px-4 py-2">
            <div
              class="flex size-8 cursor-pointer items-center justify-center rounded-5 hover:bg-white/10"
              @click="showSpace = false"
            >
              <i class="fa-regular fa-chevron-left text-white/60" />
            </div>
            <OrganizationHubChatLeftSideMemberAvatar
              :item="spaceRoom"
              :show-online="false"
            />
            {{ spaceRoom?.name }}
          </div>
          <div
            class="hide-scrollbar relative h-full w-full flex-1 overflow-auto overflow-y-auto px-4"
          >
            <template v-for="roomSub in spaceRoomList" :key="roomSub.id">
              <OrganizationHubChatForwardItem
                :room="roomSub"
                :space-room="spaceRoom"
                :on-space="onSpace"
                :folder-loading="roomSub.loading"
                :folder-open="roomSub.open"
                :folder-room="roomSub.type === 'folder' ? roomSub : folderRoom"
                :selected-rooms="selectedRooms"
                @select-room="onSelect"
              />
              <transition name="fade">
                <div
                  v-show="roomSub.type === 'folder' && roomSub.open"
                  class="rounded-b-[0.1875rem] bg-[#212121]"
                >
                  <template v-for="course in roomSub.courses" :key="course.id">
                    <OrganizationHubChatForwardItem
                      :room="course"
                      :selected-rooms="selectedRooms"
                      @select-room="onSelect"
                    />
                    <div
                      v-show="course.loading"
                      class="flex flex-col gap-1 px-2 py-1"
                    >
                      <BaseSkeleton
                        v-for="i in 3"
                        :key="i"
                        class="rounded-5"
                        height="3rem"
                        :length="1"
                      />
                    </div>
                  </template>
                </div>
              </transition>
            </template>
            <div v-show="spaceLoading" class="flex flex-col gap-1 px-2 py-1">
              <BaseSkeleton
                v-for="i in 6"
                :key="i"
                class="rounded-5"
                height="3rem"
                :length="1"
              />
            </div>
          </div>
        </template>
        <div
          class="flex items-center justify-between gap-4 bg-[#0C0C0C] px-2 py-3"
        >
          <BaseButton
            type="tertiary"
            class="bg-[#A20F0F]/20 hover:bg-[#A20F0F]/20"
            @click="onCancel"
          >
            {{ $t('base.upload.cancel') }}
          </BaseButton>
          <BaseButton
            type="tertiary"
            :loading="sending"
            icon="fa-regular fa-send"
            @click="onSend"
          >
            Send
          </BaseButton>
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>

<script>
export default {
  props: {
    messages: Array,
  },
  emits: ['close'],
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      query: '',
      showMore: false,
      loading: false,
      sending: false,
      showSpace: false,
      spaceRoom: null,
      spaceList: [],
      spaceLoading: false,
      spaceNext: null,
      selectedRooms: [],
    };
  },
  computed: {
    roomsList() {
      return this.hubChatStore.roomsList
        .filter(
          (r) => !r.locked && !r.deleted && r.userRole !== 'chat-room-readonly',
        )
        .sort(
          (a, b) =>
            new Date(b.lastMessageCreatedAt) - new Date(a.lastMessageCreatedAt),
        );
    },
    spaceRoomList() {
      return this.spaceList.filter(
        (r) => !r.locked && !r.deleted && r.userRole !== 'chat-room-readonly',
      );
    },
    searchList() {
      if (this.query === '') {
        return this.roomsList;
      }
      return this.hubChatStore.searchRoomsList.filter(
        !r.locked && !r.deleted && r.userRole !== 'chat-room-readonly',
      );
    },
    selectedList() {
      return this.showMore
        ? this.selectedRooms
        : this.selectedRooms.slice(0, 6);
    },
    label() {
      return this.showMore ? 'Less' : `More ${this.selectedRooms.length - 6}`;
    },
  },
  watch: {
    query() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.hubChatStore.searchRoomsParams.next = null;
        this.hubChatStore.searchRoomsList = [];
        this.search();
      }, 500);
    },
    'hubChatStore.showForward'(val) {
      if (!val) {
        this.query = '';
        this.selectedRooms = [];
        this.spaceList = [];
        this.spaceLoading = false;
        this.showSpace = false;
        this.spaceNext = null;
        this.spaceRoom = null;
        this.showMore = false;
        this.loading = false;
        this.sending = false;
      }
    },
  },
  methods: {
    onSpace(room) {
      if (room.type === 'space') {
        this.showSpace = true;
        this.spaceRoom = room;
        this.spaceList = [];
        this.getSpaceRoom(room);
      } else {
        const folder = this.spaceList.find(
          (r) => r.type === 'folder' && room.id === r.id,
        );
        if (folder.open) {
          folder.open = false;
        } else {
          this.getFolderRoom(room);
        }
      }
    },
    async search() {
      if (this.query) {
        this.loading = true;
        try {
          await this.hubChatStore.searchRooms(this.query);
        } catch (e) {
          this.loading = false;
        }
        this.loading = false;
      }
    },
    async onSelect(room) {
      if (this.selectedRooms.some((r) => r.id === room.id)) {
        this.selectedRooms = this.selectedRooms.filter((r) => r.id !== room.id);
      } else {
        this.selectedRooms.push(room);
      }
    },
    async onRemove(room) {
      this.selectedRooms = this.selectedRooms.filter((r) => r.id !== room.id);
    },
    async forward({ room, spaceRoom, folderRoom }) {
      this.hubChatStore.showForward = false;
      this.$emit('close', room);
      if (room.type === 'folder' || room.type === 'course') {
        if (this.hubChatStore.getRoomById(room.id)) {
          this.hubChatStore.spaceId = spaceRoom.id;
          this.hubChatStore.spaceEntityId = spaceRoom.entityId;
          this.hubChatStore.spaceInfo = spaceRoom;
          this.hubChatStore.showSpace = true;
          this.hubChatStore.chatId = room.id;
        } else {
          this.hubChatStore.spaceList = [];
          if (room.type === 'folder') {
            await this.hubChatStore.getSpaceList(
              spaceRoom.entityId,
              spaceRoom.type,
            );
          } else {
            await this.hubChatStore.getSpaceList(
              spaceRoom.entityId,
              spaceRoom.type,
            );
            await this.hubChatStore.getSpaceList(
              folderRoom.entityId,
              folderRoom.type,
            );
          }
          this.hubChatStore.spaceId = spaceRoom.id;
          this.hubChatStore.spaceEntityId = spaceRoom.entityId;
          this.hubChatStore.spaceInfo = spaceRoom;
          this.hubChatStore.showSpace = true;
          this.hubChatStore.chatId = room.id;
        }
      } else {
        if (
          this.hubChatStore.roomsList.findIndex((r) => r.id === room.id) === -1
        ) {
          this.hubChatStore.roomsList.push(room);
        }
        this.hubChatStore.chatId = room.id;
      }
      this.hubChatStore.forwardData = {
        targetRoomId: room.id,
        roomId: this.hubChatStore.chatId,
        messages: this.messages,
      };
    },
    async onSend() {
      if (this.selectedRooms.length === 0 || this.loading) {
        return;
      }
      try {
        this.sending = true;
        const forwardPromises = this.selectedRooms.map(async (room) =>
          this.hubChatStore.forwardMessages({
            roomId: this.hubChatStore.forwardData.roomId,
            targetRoomId: room.id,
            messageIds: Array.from(
              new Set(this.hubChatStore.forwardData.messages.map((r) => r.id)),
            ),
          }),
        );
        await Promise.all(forwardPromises);
        this.sending = false;
        this.selectedRooms = [];
        this.hubChatStore.showForward = false;
      } catch (e) {
        console.log(e);
        this.selectedRooms = [];
        this.sending = false;
        this.hubChatStore.showForward = false;
      }
    },
    onCancel() {
      this.hubChatStore.showForward = false;
    },
    async getSpaceRoom(room) {
      this.spaceLoading = true;
      const { data } = await this.hubChatStore.getRoomsByEntityId({
        space: room.entityId,
        limit: 100,
      });
      data.forEach((r) => {
        if (r.type === 'folder') {
          r.open = false;
          r.loading = false;
          r.courses = [];
        }
      });
      this.spaceList = [...data];
      this.spaceLoading = false;
    },
    async getFolderRoom(room) {
      const folder = this.spaceList.find(
        (r) => r.type === 'folder' && room.id === r.id,
      );
      folder.loading = true;
      const { data } = await this.hubChatStore.getRoomsByEntityId({
        folder: room.entityId,
        limit: 100,
      });
      folder.open = true;
      folder.courses = data;
      folder.loading = false;
    },
  },
};
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div
    v-if="source"
    class="flex flex-1 items-center gap-1 truncate py-1 text-xs text-white/40"
    data-cy="2570a85617d46b16"
  >
    <div
      class="relative flex w-full cursor-pointer items-center gap-1 truncate rounded-5"
      :class="[isBroadcast ? '' : 'bg-white/5 text-xs']"
    >
      <div
        v-if="source.type === 'space'"
        class="flex items-center gap-1 rounded-5 p-1 hover:bg-white/10 hover:text-white/50 active:scale-[.99]"
        :class="[isBroadcast ? 'flex-1' : '']"
        @click="locate(source.id)"
      >
        <img v-if="source.image" class="aspect-video w-6 rounded-sm" />
        <i
          v-else-if="source.icon"
          class="fa-light text-[0.625rem]"
          :class="{
            [source.icon]: true,
          }"
          :style="{ color: source.color }"
        />
        <i v-else class="fa-regular fa-hexagon text-[0.625rem]" />
        <span class="truncate">
          {{ source.name }}
        </span>
      </div>
      <div
        v-else-if="source.type === 'folder'"
        class="flex w-full items-center gap-1 truncate rounded-5 p-1 hover:bg-white/10 hover:text-white/50 active:scale-[.99]"
        :class="[isBroadcast ? 'flex-1' : '']"
        @click="locate(source.id)"
      >
        <div v-if="loading">
          <i class="fa-solid fa-spinner animate-spin text-xs" />
        </div>
        <BaseIconFolder v-else class="flex-shrink-0" />
        <span class="truncate">
          {{ source.name }}
        </span>
      </div>

      <template v-else>
        <template v-if="source.folder">
          <div
            class="flex items-center gap-1 truncate rounded-5 p-1 hover:bg-white/10 hover:text-white/50 active:scale-[.99]"
            @click="locate(source.folder.id, true)"
          >
            <div v-if="loading && isFolder">
              <i class="fa-solid fa-spinner animate-spin text-xs" />
            </div>
            <BaseIconFolder v-else class="flex-shrink-0" />
            {{ source.folder.name }}
          </div>
          <i class="fa-regular fa-pipe text-xs text-white/20" />
        </template>
        <div
          class="flex items-center gap-1 truncate rounded-5 p-1 hover:bg-white/10 hover:text-white/50 active:scale-[.99]"
          :class="!source.folder ? 'w-full' : ''"
          @click="locate(source.id)"
        >
          <div v-if="loading && !isFolder">
            <i class="fa-solid fa-spinner animate-spin text-xs" />
          </div>
          <template v-else>
            <img
              v-if="source.image"
              :src="source.image"
              class="aspect-video w-6 rounded-sm"
            />
            <i v-else class="fa-solid fa-image text-xs" />
          </template>
          <span class="truncate">
            {{ source.name }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    message: Object,
    isBroadcast: Boolean,
    isPopup: Boolean,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      loading: false,
      folderLoading: false,
      isFolder: false,
    };
  },
  computed: {
    source() {
      return this.message.sourceRoom;
    },
    chatInfo() {
      return this.isPopup
        ? this.hubChatStore.popupChatInfo
        : this.hubChatStore.chatInfo;
    },
    spaceId() {
      return this.isPopup
        ? this.hubChatStore.popupSpaceId
        : this.hubChatStore.spaceId;
    },
  },
  methods: {
    async locate(roomId, isFolder = false) {
      if (this.loading && this.isFolder === isFolder) {
        return;
      }
      this.loading = true;
      this.isFolder = isFolder;
      if (this.isPopup) {
        await this.locatePopupRoom(roomId);
      } else {
        await this.locateRoom(roomId);
      }
      this.loading = false;
    },
    async locateRoom(roomId) {
      if (this.source.folder) {
        await this.hubChatStore.locateRoom(
          roomId,
          this.spaceId,
          this.source.folder.id,
        );
      } else {
        if (this.chatInfo.type === 'folder') {
          await this.hubChatStore.locateRoom(
            roomId,
            this.spaceId,
            this.chatInfo.id,
          );
        } else {
          await this.hubChatStore.locateRoom(roomId, this.spaceId);
        }
      }
      this.hubChatStore.locateChatMessageId = this.message.id;
    },
    async locatePopupRoom(roomId) {
      if (this.source.folder) {
        await this.hubChatStore.locatePopupRoom(
          roomId,
          this.spaceId,
          this.source.folder.id,
        );
      } else {
        if (this.chatInfo.type === 'folder') {
          await this.hubChatStore.locatePopupRoom(
            roomId,
            this.spaceId,
            this.chatInfo.id,
          );
        } else {
          if (this.source.type === 'space') {
            this.hubChatStore.popupChatId = this.hubChatStore.popupSpaceId;
            this.hubChatStore.popupSpace = true;
          } else {
            await this.hubChatStore.locatePopupRoom(roomId, this.spaceId);
          }
        }
      }
      this.hubChatStore.locateChatMessageId = this.message.id;
    },
  },
};
</script>

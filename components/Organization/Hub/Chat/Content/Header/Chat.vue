<template>
  <div
    class="z-20 flex gap-0.5 truncate max-sm:w-[80%]"
    :class="[isPopup ? 'w-[80%]' : '']"
  >
    <div class="w-full max-sm:flex">
      <div
        v-if="chatInfo"
        class="flex w-full flex-1 items-center gap-2"
        :class="!isPopup ? 'pl-2.5' : ''"
      >
        <div
          class="hidden h-8 w-8 cursor-pointer items-center justify-center rounded-[0.3125rem] transition-all hover:bg-white/15 hover:text-white/80 max-sm:flex"
          :class="[isPopup ? '!flex' : '']"
          data-cy="1382863964593b75"
          @click="goBack"
        >
          <i class="fa-solid fa-arrow-left" />
        </div>
        <OrganizationHubChatLeftSideMemberAvatar :item="chatInfo" />
        <div class="flex flex-1 flex-col truncate">
          <div
            class="flex-1 truncate text-white/80"
            :class="[
              !isPopup && canEdit ? 'cursor-pointer hover:text-white' : '',
            ]"
            @click="onInfo(chatInfo)"
          >
            {{ chatInfo?.name }}
          </div>
          <OrganizationHubChatTyping v-if="hasTyping" :room-id="chatInfo.id" />
          <template v-else>
            <div
              v-if="chatInfo.type === 'one-to-one'"
              class="text-xs text-white/30"
            >
              <span
                v-if="chatInfo.oneToOnePeer.isOnline"
                class="text-[#E4B53D]/80"
              >
                {{ $t('base.member.online') }}
              </span>
              <span v-else>
                {{
                  chatInfo.lastAccessAt ? timeAgo3(chatInfo.lastAccessAt) : ''
                }}
              </span>
            </div>
          </template>
        </div>
      </div>
      <div
        v-else
        class="flex w-24 flex-1 gap-2"
        :class="!isPopup ? 'pl-2.5' : ''"
      >
        <BaseSkeleton :length="1" height="0.75rem" class="w-full" />
      </div>
    </div>
  </div>
  <div v-if="chatInfo && !chatInfo.locked" class="flex items-center gap-0.5">
    <div
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
      data-cy="eb3d28947ea92a43"
      @click="onSearch"
    >
      <i class="fa-solid fa-magnifying-glass text-xs" />
    </div>
    <client-only>
      <el-popover
        v-model:visible="optionsShow"
        trigger="click"
        :width="180"
        :show-arrow="false"
        placement="bottom-end"
        :popper-style="{
          border: 'none',
          background: 'transparent',
          'box-shadow': 'none',
          padding: '0',
        }"
      >
        <template #reference>
          <div
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
          >
            <i class="fa-solid fa-ellipsis text-xs" />
          </div>
        </template>
        <OrganizationHubChatContentHeaderOptions
          :on-select="onSelect"
          :room="chatInfo"
          @on-close="optionsShow = false"
        />
      </el-popover>
    </client-only>
    <OrganizationHubChatGo
      v-if="isPopup"
      :no-label="true"
      :is-popup="isPopup"
    />
    <BaseIconClose v-if="isLateral" @click="hubChatStore.closeLateral" />
  </div>
</template>
<script>
export default {
  props: {
    onSelect: Function,
    isPopup: Boolean,
    isLateral: Boolean,
    onSearch: Function,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      optionsShow: false,
      searchShow: false,
    };
  },
  computed: {
    chatInfo() {
      return this.isLateral
        ? this.hubChatStore.lateralChatInfo
        : this.isPopup
          ? this.hubChatStore.popupChatInfo
          : this.hubChatStore.chatInfo;
    },
    hasTyping() {
      return !!this.hubChatStore.roomsTyping.find(
        (room) => room.id === this.chatInfo.id,
      )?.typings?.length;
    },
    canEdit() {
      return !this.chatInfo?.locked && !this.chatInfo?.deleted;
    },
  },
  methods: {
    goBack() {
      this.hubChatStore.popupSpace = false;
      if (this.isPopup) {
        this.hubChatStore.popupChatId = null;
      } else {
        this.hubChatStore.chatId = null;
      }
    },
    onInfo(item) {
      if (!item.id || this.isPopup || !this.canEdit) {
        return;
      }
      this.hubChatStore.openRoomInfo(item.id);
    },
  },
};
</script>

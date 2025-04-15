<template>
  <div>
    <div
      id="member"
      ref="member"
      class="group/item relative flex h-[4.875rem] cursor-pointer items-center gap-2 rounded-[0.1875rem] border-l-[0.125rem] p-1.5 transition-all hover:bg-white/5 active:scale-[99%]"
      :class="
        !isSearch
          ? [
              isCurrentChat
                ? item.type === 'folder' || item.type === 'course'
                  ? 'bg-[#212121]'
                  : 'bg-[#090909]'
                : '',
              isCurrentSpaceChat &&
              !isChecked &&
              ['folder', 'course'].includes(
                isPopup
                  ? hubChatStore.popupChatInfo?.type
                  : hubChatStore.chatInfo?.type,
              )
                ? 'border-white/30'
                : '',
              isChecked ? 'border-[#E4B53D]' : 'border-transparent',
              item.type === 'folder' && item.show
                ? item.courses && item.courses.length > 0
                  ? 'rounded-b-none bg-[#212121] hover:!bg-[#2c2c2c]'
                  : 'bg-[#212121]'
                : '',
            ]
          : 'border-none'
      "
      :data-id="item.id"
      data-cy="a0a00ab61be563e4"
      @contextmenu="onContextmenu"
      @click="onChat"
    >
      <OrganizationHubChatLeftSideMemberAvatar
        :item="item"
        :show-folder="item.show"
        :show-space="showSpace"
        :is-space-member="isSpaceMember"
      />
      <div class="flex h-full flex-1 flex-col justify-center gap-0.5 truncate">
        <div
          class="flex items-center justify-between gap-2 text-white/80 transition-all group-hover/item:text-white/90"
          :data-cy="`chat-item-${dataCy}`"
        >
          <div
            class="truncate text-base"
            :class="
              item.type === 'folder' || item.type === 'space'
                ? 'hover:underline hover:underline-offset-2'
                : ''
            "
            @click="onOverviewChat"
          >
            {{ item.name }}
            <i
              v-if="item.preferences?.mute"
              class="fa-sharp fa-regular fa-volume-slash text-10 text-white/30"
            />
          </div>
          <div
            v-if="item.lastMessageCreatedAt || item.lastActivity"
            class="text-xs leading-3 text-white/30 transition-all group-hover/item:text-white/50"
          >
            {{ dateAgo(hubChatStore.lastTime(item)) }}
          </div>
        </div>
        <div class="flex gap-2">
          <div class="flex-1 items-start truncate">
            <OrganizationHubChatTyping v-if="hasTyping" :room-id="item.id" />
            <div
              v-else-if="
                (item.lastMessage || item.lastActivity) && !item?.deleted
              "
              class="flex flex-col justify-center gap-1"
            >
              <OrganizationHubChatLeftSideLastActivity
                v-if="isShowActivity"
                :item="item"
              />
              <OrganizationHubChatLeftSideLastMessage
                v-else
                :item="item"
                :is-popup="isPopup"
                :is-space-member="isSpaceMember"
              />
            </div>
          </div>
          <div class="relative flex shrink-0 px-1">
            <div class="flex items-center justify-center gap-1">
              <div
                v-if="item.lastReactionMessageId"
                class="flex size-4 items-center justify-center rounded-[50%] bg-[red] text-xs text-[white]"
              >
                <i class="fa-solid fa-heart mr-[0.0156rem] text-[0.625rem]" />
              </div>
              <div
                v-if="item.lastTagMessageId"
                class="flex size-4 items-center justify-center rounded-full bg-[#FFE072] text-xs text-[#252525]"
              >
                <span>@</span>
              </div>
              <div
                v-if="item.unreadMessages > 0"
                class="flex items-center justify-center rounded-full px-1 py-0.5 text-10 text-[#252525]"
                :class="[
                  item.preferences?.mute ? 'bg-[#979797]' : 'bg-[#FFE072]',
                  item.unreadMessages < 10 ? 'size-4' : '',
                ]"
              >
                {{ unreadMessages }}
              </div>
              <div v-else-if="item.preferences?.pin">
                <i
                  class="fa-solid fa-thumbtack rotate-45 text-10 text-white/60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <client-only>
        <el-popover
          :virtual-ref="member"
          :visible="popoverShow"
          placement="right-start"
          popper-class="room-options"
          :popper-style="{
            border: 'none',
            background: 'transparent',
            'box-shadow': 'none',
            padding: '0',
          }"
          :offset="showSpace ? (isPopup ? 0 : -(siderWidth - 80)) : -90"
          poper-class="member-popover"
          :width="180"
          :show-arrow="false"
          virtual-triggering
        >
          <OrganizationHubChatLeftSideOptions
            :item="item"
            :is-popup="isPopup"
          />
        </el-popover>
      </client-only>
    </div>

    <OrganizationHubChatLeftSideSkeleton
      v-for="i in 3"
      v-show="item.loading"
      :key="i"
    />
    <div
      v-if="item.show"
      class="flex flex-col rounded-b-[0.1875rem] bg-[#212121]"
    >
      <div v-show="!item.loading && item.courses && item.courses.length > 0">
        <OrganizationHubChatLeftSideMember
          v-for="course in courses"
          :key="course.id"
          :item="course"
          :is-popup="isPopup"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    isSpaceMember: Boolean,
    showSpace: Boolean,
    isSearch: Boolean,
    dataCy: String,
    isPopup: Boolean,
  },
  emits: ['select', 'locate-room'],
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    const member = ref();
    const popoverShow = ref(false);
    onClickOutside(member, () => {
      popoverShow.value = false;
    });
    return { member, popoverShow, hubChatStore, authStore };
  },
  data() {
    return {
      // showFolder: false,
    };
  },
  computed: {
    isCurrentChat() {
      return this.isPopup
        ? this.hubChatStore.popupChatId === this.item.id
        : this.hubChatStore.chatId === this.item.id;
    },
    isCurrentSpaceChat() {
      return this.isPopup
        ? this.hubChatStore.popupSpaceId === this.item.id
        : this.hubChatStore.spaceId === this.item.id;
    },
    isShowActivity() {
      if (this.item.lastActivity && !this.item.lastMessage) {
        return true;
      }
      if (this.item.lastMessage && this.item.lastActivity) {
        if (
          new Date(this.item.lastActivity.createdAt) >
          new Date(this.item.lastMessage.createdAt)
        ) {
          return true;
        }
      }
      return false;
    },
    courses() {
      return this.item.courses
        ? this.hubChatStore.sortRooms(this.item.courses)
        : [];
    },
    isChecked() {
      if (this.isPopup) {
        return this.hubChatStore.popupChatId === this.item.id;
      } else {
        return this.hubChatStore.chatId === this.item.id;
      }
    },
    unreadMessages() {
      let unread = this.item.unreadMessages;
      if (
        this.item.type === 'space' ||
        (this.item.type === 'folder' && this.item.innerRooms)
      ) {
        unread = this.item.innerRooms?.reduce(
          (acc, room) => acc + (room.count > 0 ? 1 : 0),
          0,
        );
      }
      if (unread > 999) {
        return `${(unread / 1000).toFixed(1)}k`;
      } else {
        return unread;
      }
    },
    siderWidth() {
      return (
        this.hubChatStore.siderWidth ||
        this.authStore.user?.preferences?.chat?.width
      );
    },

    hasTyping() {
      return !!this.hubChatStore.roomsTyping.find(
        (room) => room.id === this.item.id,
      )?.typings?.length;
    },
  },
  watch: {
    'hubChatStore.rightClickId'(id) {
      if (id !== this.item.id) {
        this.popoverShow = false;
      }
    },
  },
  methods: {
    onContextmenu(e) {
      if (this.isSearch) {
        return;
      }
      e.preventDefault();
      if (this.item.id === -1 || this.item.locked) {
        return;
      }
      this.hubChatStore.rightClickId = this.item.id;
      this.popoverShow = true;
    },
    async onChat() {
      if (this.isSearch) {
        this.$emit('locate-room', this.item);
        return;
      }
      if (this.isPopup) {
        if (
          this.item.id === this.hubChatStore.popupSpaceId &&
          this.hubChatStore.popupShowSpace
        ) {
          this.hubChatStore.popupShowSpace = false;
          this.hubChatStore.popupChatId = this.hubChatStore.popupSpaceId;
          this.hubChatStore.popupChatInfo = this.hubChatStore.roomsList.find(
            (room) => room.id === this.hubChatStore.popupSpaceId,
          );
          return;
        }
      } else {
        if (
          this.item.id === this.hubChatStore.spaceId &&
          this.hubChatStore.showSpace
        ) {
          this.hubChatStore.showSpace = false;
          this.hubChatStore.chatId = this.hubChatStore.spaceId;
          this.hubChatStore.chatInfo = this.hubChatStore.roomsList.find(
            (room) => room.id === this.hubChatStore.spaceId,
          );
          return;
        }
      }

      this.$emit('select', this.item);
      if (this.item.type === 'folder') {
        this.item.show = !this.item.show;
        if (this.item.show && !this.item.courses) {
          if (this.isPopup) {
            await this.hubChatStore.getPopupSpaceList(
              this.item.entityId,
              this.item.type,
            );
          } else {
            await this.hubChatStore.getSpaceList(
              this.item.entityId,
              this.item.type,
            );
          }
        }
      } else {
        if (this.isPopup) {
          this.hubChatStore.popupChatId = this.item.id;
        } else {
          this.hubChatStore.chatId = this.item.id;
        }
      }
    },
    async onOverviewChat(e) {
      if (this.item.type === 'folder' || this.item.type === 'space') {
        if (this.isPopup) {
          this.hubChatStore.popupChatId = this.item.id;
          this.hubChatStore.popupSpace = true;
        } else {
          this.hubChatStore.chatId = this.item.id;
        }
        e.stopPropagation();
      }
    },
  },
};
</script>

<template>
  <div
    class="relative flex items-center justify-center transition-all"
    :class="[
      item.type === 'one-to-one' ? 'rounded-full' : 'rounded-5',
      size === 'small' ? 'h-8 w-8' : 'h-14 w-14',
    ]"
  >
    <BaseAvatarNext
      v-if="item.type === 'one-to-one'"
      :picture="item.image"
      :story="item?.oneToOnePeer?.story"
      :show-online="(showOnline && !showSpace) || !item.unreadMessages"
      :user-id="item?.oneToOnePeer?.id"
      source="chat"
      :size="size === 'small' ? 'sm' : 'md'"
      :online="item.oneToOnePeer?.isOnline"
    />
    <BaseAvatarGroup
      v-else-if="item.type === 'group'"
      :picture="item.image"
      :class="sizeGroupOrSpace"
    />
    <template v-else-if="item.type === 'space'">
      <i
        v-if="isShopping && !item.image"
        class="fa-solid fa-book-open-reader"
      />
      <BaseAvatarGroup
        v-else-if="item.image"
        :picture="item.image"
        :class="sizeGroupOrSpace"
      />
      <i
        v-else-if="item.icon"
        :class="[
          item.icon,
          isSelect ? 'fa-solid' : 'fa-light',
          size === 'small' ? 'text-xs' : 'text-sm',
        ]"
        :style="{ color: item.color }"
      />
      <i
        v-else
        class="fa-hexagon"
        :class="[
          isSelect ? 'fa-solid' : 'fa-light',
          size === 'small' ? 'text-xs' : 'text-sm',
        ]"
        :style="{ color: item.color }"
      />
    </template>
    <BaseIconFolder
      v-else-if="item.type === 'folder'"
      :open="showFolder"
      :class="sizeFolder"
    />
    <BaseAvatarGroup v-else :picture="item.image" :class="sizeCourse" />
    <template v-if="showSpace && !isSpaceMember && !isSearch">
      <div
        v-if="item.lastTagMessageId"
        class="absolute bottom-1 left-1 flex size-4 items-center justify-center rounded-full bg-[#FFE072] text-xs text-[#252525]"
      >
        @
      </div>
      <div
        v-if="item.unreadMessages"
        class="absolute bottom-1 right-1 flex items-center justify-center rounded-full px-1 py-0.5 text-10 leading-none text-[#252525] transition-all"
        :class="[
          item.preferences?.mute ? 'bg-[#979797]' : 'bg-[#FFE072]',
          item.unreadMessages < 10 ? 'size-4' : '',
        ]"
      >
        {{ unreadMessages }}
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    showFolder: Boolean,
    isSpaceMember: Boolean,
    showSpace: Boolean,
    isSearch: Boolean,
    showOnline: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'normal', // small, normal, large
    },
  },
  setup() {
    const authStore = useAuthStore();
    const hubChatStore = useHubChatStore();
    return { authStore, hubChatStore };
  },
  computed: {
    user() {
      return this.authStore.user;
    },
    isShopping() {
      return this.item.entityId === this.user.shoppingSpace;
    },
    isSelect() {
      return this.hubChatStore.chatId === this.item.id;
    },
    isShowSpace() {
      return (
        ['space', 'course', 'folder'].includes(
          this.hubChatStore.chatInfo.type,
        ) && this.item.type === 'space'
      );
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
    sizeO2O() {
      return this.size === 'small' ? '!size-6' : '!size-11';
    },
    sizeGroupOrSpace() {
      return this.size === 'small' ? 'h-6 w-6  [&_i]:text-xs' : 'h-12 w-12';
    },
    sizeFolder() {
      return this.size === 'small' ? '!size-6 ' : '!size-12';
    },
    sizeCourse() {
      return this.size === 'small'
        ? 'aspect-video w-6 [&_img]:rounded-sm [&_i]:text-xs'
        : 'aspect-video w-12 [&_img]:rounded-sm';
    },
  },
};
</script>

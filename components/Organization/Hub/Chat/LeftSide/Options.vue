<template>
  <div
    class="flex flex-col gap-1 rounded-md border border-white/10 bg-[#0A0A0A] p-1 shadow-[4px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur"
  >
    <template v-if="canEdit">
      <div
        class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
        data-cy="93383e9beab1a7fc"
        @click.stop="onInfo"
      >
        <div class="flex h-4 w-4 items-center justify-center">
          <i class="fa-regular fa-circle-info text-xs" />
        </div>
        <div class="text-sm">
          {{ $t('org.activity.chat.info') }}
        </div>
      </div>
      <div
        v-if="!isPopup"
        class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
        data-cy="7e244e34fed643f9"
        @click="onOpenLateralChat"
      >
        <div class="flex h-4 w-4 items-center justify-center">
          <i
            v-if="hubChatStore.lateralChatId === item.id"
            class="fa-solid fa-tablet-screen-button text-xs"
          />
          <i v-else class="fa-solid fa-table-columns text-xs" />
        </div>
        <div class="text-sm">
          {{
            hubChatStore.lateralChatId === item.id
              ? $t('org.activity.chat.switch')
              : $t('org.activity.chat.open')
          }}
        </div>
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
        data-cy="OrganizationHubChatLeftSideOptions-1"
        @click="onPin"
      >
        <div class="flex h-4 w-4 items-center justify-center">
          <i
            v-if="!item.preferences?.pin"
            class="fa-solid fa-thumbtack rotate-45 text-xs"
          />
          <i v-else class="fa-solid fa-thumbtack rotate-45 text-xs" />
        </div>
        <div class="text-sm">
          {{
            item.preferences?.pin
              ? $t('org.activity.message.unpin')
              : $t('org.activity.message.pin')
          }}
        </div>
      </div>

      <div
        v-if="item.unreadMessages"
        class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
        data-cy="ee3daf3adff61bb5"
        @click="onMarkRead"
      >
        <div class="flex h-4 w-4 items-center justify-center">
          <i class="fa-solid fa-comment-dots text-xs" />
        </div>
        <div class="text-sm">
          {{ $t('nav.header.notification.list.markRead') }}
        </div>
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
        data-cy="5dbe78c9c24246ac"
        @click="onMute"
      >
        <div class="flex h-4 w-4 items-center justify-center">
          <i v-if="item.preferences?.mute" class="fa-solid fa-bell text-xs" />
          <i v-else class="fa-solid fa-bell-slash text-xs" />
        </div>
        <div class="text-sm">
          {{
            item.preferences?.mute
              ? $t('org.activity.room.unmute')
              : $t('org.activity.room.mute')
          }}
        </div>
      </div>
    </template>
    <OrganizationHubChatLeftSideDelete :item="item" />
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    isPopup: Boolean,
    selectChange: Function,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  computed: {
    canEdit() {
      return !this.item?.deleted;
    },
    isOwner() {
      return (
        this.hubChatStore.roomsList.find(
          (room) => room.id === this.hubChatStore.chatId,
        )?.userRole === 'chat-room-owner'
      );
    },
  },
  methods: {
    onChange(label) {
      switch (label) {
        case 'Select chats':
          this.selectChange(true);
          break;
      }
    },
    async onInfo() {
      this.hubChatStore.openRoomInfo(this.item?.id);
    },
    onOpenLateralChat() {
      if (this.hubChatStore.lateralChatId === this.item.id) {
        this.hubChatStore.closeLateral();
        return;
      }
      this.hubChatStore.lateralChatId = this.item.id;
    },
    async onMarkRead() {
      await this.hubChatStore.readRoom({ roomId: this.item.id });
    },
    async onMute() {
      await this.hubChatStore.muteRoom({
        roomId: this.item.id,
        value: this.item.preferences?.mute ? false : true,
      });
    },
    async onPin() {
      await this.hubChatStore.pinRoom(
        {
          roomId: this.item.id,
          value: this.item.preferences?.pin ? false : true,
        },
        this.item.type,
      );
    },
  },
};
</script>

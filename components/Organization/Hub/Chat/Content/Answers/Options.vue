<template>
  <div
    v-if="!isOwner"
    class="absolute -top-[4.375rem] rounded-xl bg-[#0A0A0A]/80 p-2"
  >
    <BaseReaction ref="reaction" @on-change="onChange($event)" />
  </div>
  <div
    class="flex w-full flex-col gap-1 rounded-md bg-[#0A0A0A] p-1 shadow-[2px_2px_4px_rgba(0,0,0,0.25)] backdrop-blur"
  >
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      data-cy="18c8bd55828f64fa"
      @click="$emit('reply', { ...item, roomId: chatId })"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-solid fa-reply text-xs" />
      </div>
      <div class="text-sm">
        {{ $t('org.activity.message.reply') }}
      </div>
    </div>
    <div
      v-if="canPin"
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      data-cy="5685f1e28552832e"
      @click="onPinned"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-solid fa-thumbtack rotate-45 text-xs" />
      </div>
      <div class="text-sm">
        {{
          item?.pinned
            ? $t('org.activity.message.unpin')
            : $t('org.activity.message.pin')
        }}
      </div>
    </div>
    <div
      v-if="!popupRoom"
      ref="forward"
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
      @click="onForward"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-solid fa-share text-xs" />
      </div>
      <div class="flex flex-1 items-center justify-between text-sm">
        <span>{{ $t('org.activity.message.forward') }}</span>
        <!-- <i class="fa-solid fa-chevron-right text-xs" /> -->
      </div>
    </div>
    <div
      v-if="canEdit"
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      data-cy="9054aa60dfdd7b9b"
      @click="onEdit"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-solid fa-pen text-xs" />
      </div>
      <div class="text-sm">
        {{ $t('base.editor.edit') }}
      </div>
    </div>
    <div
      v-if="hasMedia"
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      data-cy="655b015e9914d469"
      @click="onCopyImage"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-solid fa-images text-xs" />
      </div>
      <div class="text-sm">
        {{ $t('org.activity.message.copy.media') }}
      </div>
    </div>
    <div
      v-if="item?.content"
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      data-cy="6f606ba26190a948"
      @click="onCopy"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-solid fa-copy text-xs" />
      </div>
      <div class="text-sm">
        {{ $t('org.activity.message.copy.label') }}
      </div>
    </div>
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      data-cy="84698dddacb2b146"
      @click="onSave"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-solid fa-bookmark text-xs" />
      </div>
      <div class="text-sm">
        {{
          item?.saved
            ? $t('org.activity.message.unsave')
            : $t('org.activity.message.save')
        }}
      </div>
    </div>
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      data-cy="f23de73c48f8528b"
      @click="onSelect"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-circle-check" />
      </div>
      <div class="text-sm">
        {{ $t('org.activity.message.select') }}
      </div>
    </div>
    <div
      v-if="isSeenOption"
      ref="seen"
      class="flex cursor-pointer items-center gap-2 p-1.5 text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <BaseReactionItem
          v-if="totalReactions > 0 && users[0]"
          :size="4"
          :is-image="true"
          :name="users[0]?.reaction"
        />
        <i
          v-else-if="totalUsers > 0"
          class="fa-sharp fa-thin fa-check-double text-xs"
        />
        <i v-else class="fa-sharp fa-thin fa-check text-xs" />
      </div>
      <div class="flex flex-1 items-center justify-between text-sm">
        <div v-if="totalReactions > 0">
          {{
            $t('org.activity.message.reactions', {
              reactions: totalReactions,
              users: totalUsers,
            })
          }}
        </div>
        <div v-else>
          <span v-if="!usersLoading">{{ totalUsers }}</span>
          {{ $t('org.activity.message.seen') }}
        </div>
        <div class="flex items-center">
          <BaseAvatarNext
            v-for="(avatar, index) in avatars"
            :key="index"
            :show-online="false"
            size="sm"
            :picture="avatar"
            class="!-ml-4"
            :style="{
              zIndex: 5 - index,
            }"
          />

          <i
            v-if="usersLoading"
            class="fa-solid fa-spinner mr-1 animate-spin text-xs"
          />
          <i
            v-else-if="item?.viewCount > 0"
            class="fa-solid fa-chevron-right ml-1 text-xs"
          />
        </div>
      </div>
    </div>
    <OrganizationHubChatContentDelete :room-id="chatId" :messages="[item]" />
  </div>
  <!-- <client-only>
    <el-popover
      v-model:visible="showForward"
      :virtual-ref="forward"
      popper-class="bg-[#0A0A0A] p-0 "
      :show-arrow="false"
      placement="right"
      trigger="hover"
      virtual-triggering
      :width="220"
      :offset="0"
      :popper-style="{
        padding: '0px !important',
        background: 'transparent',
      }"
    >
      <OrganizationHubChatContentAnswersForward
        :messages="[item]"
        @close="showForward = false"
      />
    </el-popover>
  </client-only> -->
  <client-only>
    <el-popover
      v-if="users.length > 0"
      v-model:visible="showSeen"
      :virtual-ref="seen"
      popper-class="bg-[#0A0A0A]/80 p-0 "
      :show-arrow="false"
      placement="right"
      trigger="hover"
      virtual-triggering
      :width="220"
      :offset="0"
      @after-enter="showSeen = true"
      @after-leave="showSeen = false"
    >
      <OrganizationHubChatContentAnswersSeen
        :users="users"
        :loading="usersLoading"
        :users-next="usersNext"
        :load="() => getMessageInfo(item.id, true)"
        @close="showSeen = false"
      />
    </el-popover>
  </client-only>
</template>
<script>
export default {
  props: {
    item: Object,
    onChange: Function,
    isOwner: {
      type: Boolean,
      default: false,
    },
    popupRoom: Boolean,
    isLateral: Boolean,
    isPopup: Boolean,
  },
  emits: ['reply', 'select'],
  setup() {
    const forward = ref();
    const seen = ref();
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    return { forward, seen, hubChatStore, authStore };
  },
  data() {
    return {
      showForward: false,
      showSeen: false,
      users: [],
      usersLoading: false,
      totalUsers: 0,
      usersNext: null,
      totalReactions: 0,
      avatars: [],
      lastReaction: null,
    };
  },
  computed: {
    hasMedia() {
      return (
        this.item?.attachments?.length &&
        this.item?.attachments[0].mimetype.includes('image')
      );
    },
    userId() {
      return this.authStore?.user?.id;
    },
    hasReaction() {
      return (
        this.item?.reactions &&
        this.item?.reactions.count &&
        Object.keys(this.item?.reactions.count).reduce(
          (acc, cur) => acc + this.item.reactions.count[cur],
          0,
        )
      );
    },
    isSeenOption() {
      return (
        (this.item?.viewCount > 0 && this.item?.author.id === this.userId) ||
        (this.item?.author.id !== this.userId && this.hasReaction)
      );
    },
    canPin() {
      // return (
      //   this.hubChatStore.chatInfo?.userRole === 'chat-room-owner' ||
      //   this.hubChatStore.chatInfo?.userRole === 'chat-room-admin'
      // );
      return true;
    },
    canEdit() {
      // return this.isOwner;
      return true;
    },
    chatId() {
      return this.isLateral
        ? this.hubChatStore.lateralChatId
        : this.isPopup
          ? this.hubChatStore.popupChatId
          : this.hubChatStore.chatId;
    },
  },
  methods: {
    onSelect() {
      this.$emit('select', this.item);
    },
    onClose() {
      this.$emit('onClose');
    },
    onForward() {
      this.hubChatStore.showForward = true;
      this.hubChatStore.forwardData = {
        roomId: this.chatId,
        messages: [this.item],
      };
    },
    async onPinned() {
      if (this.pinLoading) {
        return;
      }
      this.pinLoading = true;
      if (this.item.pinned) {
        await this.hubChatStore.deleteRoomPinnedMessage({
          roomId: this.chatId,
          messageIds: [this.item.id],
        });
      } else {
        await this.hubChatStore.addRoomPinnedMessages({
          roomId: this.chatId,
          messageIds: [this.item.id],
        });
      }
      this.pinLoading = false;
    },
    onInfo() {
      this.hubChatStore.rightSiderType = 'info';
      this.hubChatStore.roomInfo = {
        type: 'space',
        name: 'Architecture',
        subName: 'spaces and course',
        description:
          'When the description become too long you can see it clicking the button',
      };
      this.onClose();
    },
    async onSave() {
      try {
        if (this.saveLoading) {
          return;
        }
        this.saveLoading = true;
        if (this.item.saved) {
          await this.hubChatStore.deleteSavedMessages({
            roomId: this.chatId,
            messageIds: [this.item.id],
          });
        } else {
          await this.hubChatStore.addSavedMessages({
            roomId: this.chatId,
            messageIds: [this.item.id],
          });
        }
        this.saveLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    reactionFlicker() {
      this.$refs.reaction.flicker();
    },
    async getMessageInfo(id, isNext = false) {
      try {
        if (this.usersLoading) {
          return;
        }
        if (!isNext) {
          this.usersNext = null;
          this.users = [];
          this.avatars = [];
        }
        this.usersLoading = true;
        const {
          cursor: { totalItems, next },
          data: { users, reactions },
        } = await this.hubChatStore.getMessageInfo({
          roomId: this.chatId,
          messageId: id,
          next: this.usersNext,
        });
        this.users = [...this.users, ...users];
        this.totalUsers = totalItems;
        if (!this.usersNext) {
          this.totalReactions = Object.keys(reactions).length
            ? Object.keys(reactions).reduce(
                (acc, key) => acc + reactions[key],
                0,
              )
            : 0;
          const length = users.length >= 3 ? 3 : users.length;
          this.avatars = users.slice(0, length).map((r) => r.userProfile.image);
        }
        this.usersNext = next;
        this.usersLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    async onCopy() {
      const text = this.item.text;
      if (text) {
        await this.$copyText(text);
      }
    },
    convertToPng(url) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          canvas.toBlob(resolve, 'image/png');
        };
        img.onerror = reject;
        img.src = url;
      });
    },
    async onCopyImage() {
      try {
        if (this.item.attachments[0].mimetype.includes('image/png')) {
          const imageUrl = this.item.attachments[0].url;
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const clipboardItem = new ClipboardItem({ [blob.type]: blob });
          await navigator.clipboard.write([clipboardItem]);
        } else {
          const blob = await this.convertToPng(this.item.attachments[0].url);
          const clipboardItem = new ClipboardItem({ [blob.type]: blob });
          await navigator.clipboard.write([clipboardItem]);
        }
      } catch (err) {
        console.error('Failed to copy image: ', err);
      }
    },
    stripHtmlTags(html) {
      return html.replace(/<[^>]*>/g, '');
    },
    async onEdit() {
      this.hubChatStore.editData = {
        roomId: this.chatId,
        message: this.item,
      };
    },
  },
};
</script>

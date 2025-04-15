<template>
  <div
    v-if="
      ['space', 'folder'].includes(item.type) &&
      item.lastMessage &&
      item.lastMessage.sourceRoom
    "
    class="flex items-center gap-1 truncate rounded-5 bg-white/5"
  >
    <div
      v-if="item.lastMessage.sourceRoom.type === 'course'"
      class="flex flex-1 items-center gap-1 truncate"
    >
      <template
        v-if="item.lastMessage.sourceRoom.folder && item.type === 'space'"
      >
        <div
          class="flex items-center gap-1 truncate rounded-5 p-1 hover:bg-white/10 hover:text-white/50 active:scale-[.99]"
          @click.stop="locateFolderRoom"
        >
          <BaseIconFolder class="size-3" />
          <div
            class="flex-1 truncate text-sm leading-none text-white/40 group-hover/item:text-white/60"
          >
            {{ item.lastMessage.sourceRoom.folder?.name }}
          </div>
        </div>
        <i class="fa-regular fa-pipe text-xs text-white/20" />
      </template>
      <div
        class="flex flex-1 items-center gap-1 truncate rounded-5 p-1 hover:bg-white/10 hover:text-white/50 active:scale-[.99]"
        @click.stop="locateRoom"
      >
        <img
          v-if="item.lastMessage.sourceRoom.image"
          :src="item.lastMessage.sourceRoom.image"
          class="h-3 w-4 rounded-sm object-cover"
        />
        <i v-else class="fa-solid fa-image text-xs" />
        <div
          class="flex-1 truncate text-sm leading-none text-white/40 group-hover/item:text-white/60"
        >
          {{ item.lastMessage.sourceRoom.name }}
        </div>
      </div>
    </div>
    <div
      v-else-if="item.lastMessage.sourceRoom.type === 'folder'"
      class="flex flex-1 items-center gap-1 truncate rounded-5 p-1 hover:bg-white/10 hover:text-white/50 active:scale-[.99]"
      @click.stop="locateRoom"
    >
      <BaseIconFolder class="size-3" />
      <div
        class="flex-1 truncate text-sm leading-none text-white/40 group-hover/item:text-white/60"
      >
        {{ item.lastMessage.sourceRoom.name }}
      </div>
    </div>
  </div>
  <div class="flex items-center gap-1 truncate">
    <OrganizationHubChatReadMark
      v-if="userId === item.lastMessage.author.id"
      :read="!!item.lastMessage.viewCount"
    />
    <div
      v-if="item.type !== 'one-to-one'"
      class="truncate text-xs text-white/50"
    >
      {{
        item.lastMessage && item.lastMessage.author
          ? userId === item.lastMessage.author.id
            ? $t('org.activity.message.you') + ':'
            : item.lastMessage.author.name
              ? item.lastMessage.author.name + ':'
              : ''
          : ''
      }}
    </div>
    <div
      class="max-h-4 flex-1 truncate text-xs text-[#545454] transition-all group-hover/item:text-[#828282] [&_p]:overflow-hidden [&_p]:text-ellipsis [&_p]:whitespace-nowrap"
      v-html="preview"
    />
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    isPopup: Boolean,
    isSpaceMember: Boolean,
  },
  setup() {
    const profileStore = useProfileStore();
    const hubChatStore = useHubChatStore();
    return {
      profileStore,
      hubChatStore,
    };
  },
  computed: {
    userId() {
      return this.profileStore.myProfileDetail.id;
    },
    preview() {
      let preview =
        this.item.lastMessage.preview || this.item.lastMessage.content || '';
      const attachment = this.item.lastMessage?.attachment;
      const social = this.item.lastMessage?.social;
      if (!preview && attachment) {
        if (attachment.mimetype.includes('image')) {
          preview = `<div class='flex items-center gap-1'><img src='${attachment.url}'  class='max-w-5 max-h-5 rounded-sm object-cover' /> ${
            attachment.mimetype.includes('image/gif') ? 'GIF' : 'Photo'
          }</div>`;
        } else if (attachment.mimetype.includes('video')) {
          preview = `<div class='flex items-center gap-1'><video src='${attachment.url}'  class='max-w-5 max-h-5 rounded-sm object-cover'></video> Video</div>`;
        } else {
          preview = attachment.name;
        }
      } else if (!preview && social) {
        const { type, action } = social;
        return this.$t(`org.activity.message.social.${action}.${type}`);
      } else if (this.containsImgTag(preview)) {
        preview = preview.replace(
          "<img class='chat-gif'",
          '<img class="w-[1.25rem] rounded-sm" ',
        );
      }
      return preview;
    },
  },
  methods: {
    containsImgTag(html) {
      const imgTagRegex = /<img\b[^>]*>/i;
      return imgTagRegex.test(html);
    },
    locateRoom() {
      const { folder, id, type } = this.item.lastMessage.sourceRoom;
      if (type === 'course' && folder) {
        const spaceId = this.isSpaceMember
          ? this.isPopup
            ? this.hubChatStore.popupSpaceId
            : this.hubChatStore.spaceId
          : this.item.id;
        if (this.isPopup) {
          this.hubChatStore.locatePopupRoom(id, spaceId, folder.id);
        } else {
          this.hubChatStore.locateRoom(id, spaceId, folder.id);
        }
      } else {
        if (this.isPopup) {
          this.hubChatStore.locatePopupRoom(id, this.item.id);
        } else {
          this.hubChatStore.locateRoom(id, this.item.id);
        }
      }
    },
    locateFolderRoom(e) {
      e.stopPropagation();
      const { folder } = this.item.lastMessage.sourceRoom;
      if (this.isPopup) {
        this.hubChatStore.locatePopupRoom(folder.id, this.item.id);
      } else {
        this.hubChatStore.locateRoom(folder.id, this.item.id);
      }
    },
  },
};
</script>

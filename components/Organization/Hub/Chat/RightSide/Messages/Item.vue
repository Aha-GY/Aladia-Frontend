<template>
  <div
    class="group/item flex flex-col items-start gap-1 rounded-5 p-2 transition-all"
    :class="[
      isSelect ? 'cursor-pointer hover:bg-white/5' : '',
      checkedIds.includes(item.id) ? 'bg-white/5' : '',
    ]"
    @click.stop="onClick"
    @contextmenu.prevent="onContextmenu"
  >
    <div
      class="flex w-full items-center justify-between rounded-5 transition-all"
    >
      <div
        class="flex items-center gap-1 truncate text-xs"
        :style="`color:${item.author.color}`"
      >
        <BaseAvatarNext
          :picture="item.author?.image"
          size="md"
          :online="item.author?.online"
          :show-check="isSelect ? true : false"
          :show-online="false"
          :checked="checkedIds.includes(item.id)"
          :show-story="true"
          :story="item.author?.story"
        />

        <div class="truncate">
          <OrganizationHubChatContentAnswersName
            :message="item"
            :is-owner="isOwner"
          />
        </div>
      </div>
      <div class="flex items-center gap-4 text-sm">
        <span class="text-white/30">
          {{ formatDate(item.createdAt, 'DD/MM/YYYY') }}
        </span>
        <div
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white/80 transition-all hover:bg-white/5 active:scale-95"
          @click="$emit('locate-message', item.id)"
        >
          <i
            class="fa-solid fa-chevron-right text-xs text-white/60 group-hover/item:text-white/80"
          />
        </div>
      </div>
    </div>
    <div
      ref="message"
      class="flex max-w-[80%] flex-col rounded-5 px-2.5 py-2.5 transition-all"
      :class="[isOwner ? 'bg-[#3B3111]/60' : 'bg-black/60']"
      data-cy="a07c6f9ea8af7c4b"
    >
      <OrganizationHubChatContentAnswersStory
        v-if="item.story"
        :story-id="item.story.storyId"
        :is-owner="isOwner"
      />
      <img
        v-for="image in images"
        :key="image.id"
        class="mb-1 rounded object-cover"
        :src="image.url"
      />
      <video
        v-for="video in videos"
        :key="video.id"
        :src="video.url"
        controls
        class="mb-1 rounded object-cover"
      />
      <BaseEditorAttachment
        :files="files"
        :is-click="true"
        :is-close="false"
        data-cy="b1fb530a9f5e4f06"
        @click="onDownloadFile"
      />
      <OrganizationHubChatContentAnswersLink
        v-if="item.link"
        :item="item.link"
        :date="item.createdAt"
      />
      <OrganizationHubChatContentAnswersLoom
        v-if="item.loomUrls && item.loomUrls.length"
        :urls="item.loomUrls"
        :is-popup="false"
      />
      <div
        style="word-break: break-word"
        class="chat-message text-sm leading-4 text-[#999] [&_a]:text-white/70"
        v-html="item.content"
      />
      <div
        class="flex items-center justify-end gap-2 py-1 text-xs text-white/30"
        data-cy="a12fedaa175f497b"
        @click.stop="onChange(item.id)"
      >
        <i class="fa-solid fa-bookmark text-10" />
        <span>{{ formatDate(item.createdAt, 'HH:MM') }}</span>
      </div>
    </div>
  </div>
  <client-only>
    <el-popover
      :virtual-ref="message"
      :visible="popoverShow"
      :popper-style="{
        border: 'none',
        background: 'transparent',
        'box-shadow': 'none',
        padding: '0',
      }"
      placement="right"
      :offset="-10"
      :width="180"
      :show-arrow="false"
      virtual-triggering
    >
      <OrganizationHubChatRightSideMessagesOptions
        :item="item"
        :is-select="isSelect"
        :on-select="onSelect"
        :on-delete="onDelete"
        :on-cancel="onCancel"
        :on-forward="onForward"
        @on-delete="onDelete"
        @locate-message="$emit('locate-message', item.id)"
      />
    </el-popover>
  </client-only>
</template>

<script>
export default {
  props: {
    item: Object,
    checkedIds: Array,
    isSelect: Boolean,
    query: String,
    onCheck: Function,
    rightId: String,
    onRight: Function,
    onDelete: Function,
    onChange: Function,
    onSelect: Function,
    onCancel: Function,
    onForward: Function,
  },
  emits: ['locate-message'],
  setup() {
    const hubChatStore = useHubChatStore();
    const profileStore = useProfileStore();
    const message = ref();
    const popoverShow = ref(false);
    onClickOutside(message, () => {
      popoverShow.value = false;
    });
    return { message, popoverShow, hubChatStore, profileStore };
  },
  computed: {
    images() {
      return (this.item.attachments || []).filter((r) =>
        r.mimetype.includes('image'),
      );
    },
    videos() {
      return (this.item.attachments || []).filter((r) =>
        r.mimetype.includes('video'),
      );
    },
    files() {
      return (this.item.attachments || []).filter((r) => r.category === 'file');
    },
    links() {
      return (this.item.attachments || []).filter((r) => r.category === 'link');
    },
    userId() {
      return this.profileStore.myProfileDetail.id;
    },
    profileId() {
      return this.profileStore.myUserProfileDetail.id;
    },
    isOwner() {
      return (
        (this.item?.author?.id === this.userId &&
          this.item?.createdBy?.id === this.profileId) ||
        this.item?.createdBy?.id === this.userId ||
        this.item?.author?.id === this.profileId
      );
    },
  },
  methods: {
    onContextmenu() {
      this.onRight(this.item.id);
      this.popoverShow = true;
    },
    onClick() {
      if (this.isSelect) {
        this.onCheck(this.item.id);
      }
    },
  },
};
</script>

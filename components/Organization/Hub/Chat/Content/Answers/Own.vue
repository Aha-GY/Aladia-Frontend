<template>
  <div
    :id="`${isPopup ? 'popup-' : ''}msg-` + item.id"
    ref="container"
    class="flex w-full justify-end whitespace-pre-wrap rounded-5 !p-0 transition-all"
    :class="[
      isSelect
        ? 'flex cursor-pointer items-center opacity-50 hover:bg-white/5 hover:opacity-100'
        : '',
      actives.includes(item.id) ||
      item.id === hubChatStore.sortMessageId ||
      isRightMenu
        ? 'bg-white/5 !opacity-100'
        : '',
      showAvatar ? 'overflow-hidden' : '',
    ]"
    data-cy="90cb2c0514546d8d"
    @click="onChange(item.id)"
  >
    <div
      class="min-w-[6.25rem] max-w-[50%] items-end gap-1.5 py-0.5 pr-2 max-sm:max-w-[100%]"
      :class="[isPopup ? '!max-w-[100%]' : '']"
      @contextmenu="onContextmenu"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @touchmove="onTouchMove"
    >
      <div class="flex flex-col items-end">
        <OrganizationHubChatContentAnswersStory
          v-if="item.story"
          :story-id="item.story.storyId"
          :owner-id="item.story.owner?.id"
          :is-owner="true"
          :action="item.story.action"
          :item="item"
        />
        <OrganizationHubChatContentAnswersPost
          v-if="item.post"
          :id="item.post.postId"
          :owner-id="item.post.owner?.id"
          :is-owner="true"
          :is-popup="isPopup"
        />
        <div
          ref="box"
          class="group/item relative flex w-full flex-1 flex-col rounded-xl bg-gradient-to-b from-[#3B3111]/70 to-[#3B3111]/80 px-2 py-1"
          :class="[showAvatar ? 'message-bubble' : '', !showName ? 'pt-2' : '']"
        >
          <div
            v-if="showName"
            class="mb-0.5 flex items-center justify-between gap-2"
          >
            <div class="flex items-center gap-2 truncate">
              <OrganizationHubChatContentAnswersName
                :message="item"
                :is-owner="true"
              />
              <div class="text-xs text-white/30">
                {{ item?.author?.role.slice('chat-room-'.length) }}
              </div>
            </div>
          </div>
          <OrganizationHubChatContentAnswersSource
            v-if="!item.broadcast && showName"
            :message="item"
            :is-popup="isPopup"
          />
          <div
            v-if="item.forwardedMessage"
            class="flex items-center gap-0.5 truncate text-xs"
            :style="`color:${item.forwardedMessage.author.color}`"
          >
            {{ $t('org.activity.chat.forwarded') }}
            <BaseAvatarNext
              :show-online="false"
              size="sm"
              :picture="item.forwardedMessage.author?.image"
            />
            <span class="truncate">
              {{ item.forwardedMessage.author?.fullname }}
            </span>
          </div>
          <OrganizationHubChatContentReply
            v-if="item.replyTo"
            :item="item.replyTo"
            @locate-reply-message="
              $emit('locate-reply-message', $event, item.id)
            "
          />
          <OrganizationHubChatMediaLoading
            v-for="m in media"
            :key="m.id"
            class="mb-1"
            :media="m"
            :is-popup="isPopup"
            :container-width="containerWidth"
          />
          <BaseEditorAttachment
            :files="files"
            :is-click="true"
            :is-close="false"
            data-cy="b10047b0db187351"
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
            :is-popup="isPopup"
          />
          <div
            style="word-break: break-word"
            class="chat-message ql-editor-content text-sm leading-4 text-[#999] [&_a]:text-white/70 [&_p]:overflow-hidden"
            data-cy="OrganizationHubChatContentAnswersOwn-1"
            v-html="item.content"
          />

          <div
            class="flex items-end justify-between gap-4 py-1 text-xs font-[300] text-white/30"
            :class="hasReaction ? 'pt-2' : ''"
          >
            <div class="flex gap-2">
              <div
                v-if="item.reactions"
                class="transition-all duration-300"
                :class="reactHover ? 'opacity-0' : ''"
              >
                <OrganizationHubChatContentAnswersReaction
                  ref="reacted"
                  :item="item"
                  :scroll-value="scrollValue"
                  :user-reaction="userReaction"
                />
              </div>
            </div>
            <div class="flex items-center gap-1">
              <OrganizationHubChatContentAnswersBroadcast
                v-if="item.broadcast"
                :message="item"
                :is-popup="isPopup"
              />
              <div class="flex items-center gap-2">
                <i
                  v-if="item.pinned"
                  class="fa-solid fa-thumbtack rotate-45 text-xs"
                />
                <i v-if="item.saved" class="fa-solid fa-bookmark text-xs" />
                <span v-if="item.edited">edited</span>
                <span>{{ formatDate(item.createdAt, 'HH:mm') }}</span>
                <div class="flex w-3 items-end justify-center">
                  <OrganizationHubChatReadMark :read="!!item.viewCount" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isSelect" class="p-2">
      <BaseCheckbox :active="actives.includes(item.id)" />
    </div>
  </div>
</template>
<script>
import hljs from 'highlight.js';
import CopyButtonPlugin from 'highlightjs-copy';

export default {
  props: {
    item: Object,
    isSelect: Boolean,
    actives: Array,
    onChange: Function,
    onReply: Function,
    onSelect: Function,
    isPopup: Boolean,
    scrollValue: Number,
    showAvatar: Boolean,
    showName: Boolean,
    isLateral: Boolean,
  },
  emits: ['locate-reply-message', 'right-menu'],
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const box = ref();
    return { box, hubChatStore, authStore, profileStore };
  },
  data() {
    return {
      reactHover: false,
      showReaction: false,
      isRightMenu: false,
      containerWidth: 0,
    };
  },
  computed: {
    media() {
      return (this.item.attachments || []).filter(
        (r) => r.mimetype.includes('video') || r.mimetype.includes('image'),
      );
    },
    files() {
      return (this.item.attachments || []).filter((r) => r.category === 'file');
    },
    hasReaction() {
      return (
        this.item.reactions &&
        this.item.reactions.count &&
        Object.keys(this.item.reactions.count).reduce(
          (acc, cur) => acc + this.item.reactions.count[cur],
          0,
        )
      );
    },
    userReaction() {
      if (this.hasReaction) {
        let type = null;
        Object.keys(this.item.reactions.data).forEach((key) => {
          if (
            this.item.reactions.data[key].find(
              (r) =>
                r.userProfile && r.userProfile.id === this.authStore.context,
            )
          ) {
            type = key;
            return;
          }
        });
        return type;
      }
      return null;
    },
    chatId() {
      return this.isLateral
        ? this.hubChatStore.lateralChatId
        : this.isPopup
          ? this.hubChatStore.popupChatId
          : this.hubChatStore.chatId;
    },
  },
  mounted() {
    hljs.addPlugin(new CopyButtonPlugin());
    const syntaxs = this.$refs.box.querySelectorAll('.ql-syntax');
    for (let index = 0; index < syntaxs.length; index++) {
      const syntax = syntaxs[index];
      hljs.highlightElement(syntax);
    }
    this.resizeObserver = new ResizeObserver((entries) => {
      this.containerWidth = entries[0].contentRect.width / 2;
    });
    this.resizeObserver.observe(this.$refs.container);
    this.containerWidth = this.$refs.container.offsetWidth / 2;

    this.$refs.box.querySelectorAll('.mention').forEach((element) => {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        const id = element.getAttribute('data-id');
        const entityType = element.getAttribute('data-type');
        this.profileStore.gotoProfilePage({ id, entityType });
      });
    });
  },
  methods: {
    select() {
      this.onSelect(true);
      this.onChange(this.item.id);
    },
    onTouchStart(e) {
      e.preventDefault();
      this.touchTimeout = setTimeout(() => {
        const { clientX, clientY } = e.targetTouches[0];
        this.onContextmenu(e, { clientX, clientY });
      }, 500);
    },
    onTouchEnd(e) {
      e.preventDefault();
      clearTimeout(this.touchTimeout);
    },
    onTouchMove(e) {
      e.preventDefault();
      clearTimeout(this.touchTimeout);
    },
    onContextmenu(e, location = null) {
      if (this.isSelect) {
        return;
      }
      e.preventDefault();
      this.hubChatStore.rightClickId = this.item.id;
      this.$emit('right-menu', location || e, this);
    },
    preview(id) {
      this.hubChatStore.previewMedia(id, this.hubChatStore.chatId);
    },
    async onDownloadFile(item) {
      const blob = await (await fetch(item.url)).blob();
      const url = URL.createObjectURL(blob);
      download(url, item.name);
      URL.revokeObjectURL(url);
    },
  },
};
</script>
<style lang="scss">
.chat-message {
  a {
    &:hover {
      text-decoration: underline;
    }
  }
  .ql-syntax {
    white-space: break-spaces;
    min-height: 3.125rem;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: initial !important;
    margin: initial !important;
    padding: initial !important;
  }

  h1 {
    font-size: 2em;
  }
  h2 {
    font-size: 1.5em;
  }
  h3 {
    font-size: 1.17em;
  }
  h4 {
    font-size: 1em;
  }
  h5 {
    font-size: 0.83em;
  }
  h6 {
    font-size: 0.67em;
  }
  .emoji-1 {
    font-size: 6rem;
    line-height: normal;
  }
  .emoji-2 {
    font-size: 5rem;
    line-height: normal;
  }
  .emoji-3 {
    font-size: 4rem;
    line-height: normal;
  }
  .emoji-4 {
    font-size: 3rem;
    line-height: normal;
  }
  .emoji-5 {
    font-size: 2rem;
    line-height: normal;
  }
  .emoji-gif {
    width: 6rem !important;
    margin: 1rem 0;
  }
}
</style>
<style scoped>
.message-bubble::after {
  content: '';
  position: absolute;
  background-color: rgba(59, 49, 17, 0.8);
  bottom: 0;
  right: 0;
  width: 1.875rem;
  height: 1rem;
  clip-path: path('M 0 0 Q 10 10 20 0 Q 10 24 0 0');
  transform: translate(1rem, 0.375rem) rotate(60deg);
}
</style>

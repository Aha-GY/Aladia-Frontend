<template>
  <div
    :id="`${isPopup ? 'popup-' : ''}msg-` + item.id"
    class="rounded-5 transition-all"
    :class="[
      isSelect
        ? 'flex cursor-pointer items-center opacity-50 hover:bg-white/5 hover:opacity-100'
        : '',
      actives.includes(item.id) ||
      item.id === hubChatStore.sortMessageId ||
      isRightMenu
        ? 'bg-white/5 !opacity-100'
        : '',
    ]"
    data-cy="95aa16e358bbb95b"
    @click="onChange(item.id)"
  >
    <div
      ref="container"
      class="flex flex-1 items-end gap-2.5 rounded-md px-2 py-0.5"
      @contextmenu="onContextmenu"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @touchmove="onTouchMove"
    >
      <div
        class="flex min-w-[6.25rem] max-w-[50%] flex-col max-sm:max-w-[100%]"
        :class="[isPopup ? '!max-w-[100%]' : '']"
      >
        <OrganizationHubChatContentAnswersStory
          v-if="item.story"
          :story-id="item.story.storyId"
          :owner-id="item.story.owner?.id"
          :action="item.story.action"
          :item="item"
        />
        <OrganizationHubChatContentAnswersPost
          v-if="item.post"
          :id="item.post.postId"
          :owner-id="item.post.owner?.id"
          :is-popup="isPopup"
        />
        <div
          ref="box"
          class="group/item relative flex w-full flex-col rounded-xl bg-gradient-to-b from-black/50 to-black/80 px-2 py-1"
          :class="[showAvatar ? 'message-bubble' : '', !showName ? 'pt-2' : '']"
        >
          <div
            class="flex flex-col"
            :class="reactHover && !hasReaction ? 'opacity-30' : ''"
          >
            <div
              v-if="showName"
              class="flex items-center justify-between gap-2"
            >
              <div class="flex items-center gap-2 truncate py-1">
                <OrganizationHubChatContentAnswersName :message="item" />

                <div class="text-xs text-white/30">
                  {{ role }}
                </div>
              </div>
              <div
                class="flex cursor-pointer items-center justify-center text-xs text-white/30 opacity-0 hover:text-white/50 group-hover/item:opacity-100"
                data-cy="49365bf92ac7b0cd"
                @click="onReply({ ...item, roomId: chatId })"
              >
                {{ $t('org.activity.chat.reply') }}
              </div>
            </div>
            <OrganizationHubChatContentAnswersSource
              v-if="!item.broadcast && showName"
              :message="item"
              :is-popup="isPopup"
            />
            <div
              v-if="item.forwardedMessage"
              class="flex items-center gap-1 truncate text-xs"
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
              data-cy="294ab96603b76936"
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
            <OrganizationHubChatContentAnswersSpace v-if="item.space" />
            <div
              style="word-break: break-word"
              class="chat-message ql-editor-content whitespace-normal text-sm leading-4 text-[#828282] [&_p]:overflow-hidden"
              v-html="item.content"
            />
            <div
              class="relative flex items-end justify-between gap-4 py-1 text-xs font-[300] text-white/30"
              :class="!userReaction ? 'pl-5' : 'pt-2'"
            >
              <div class="flex gap-2">
                <div
                  v-if="hasReaction"
                  class="transition-all duration-300"
                  :class="!userReaction ? 'ml-1' : ''"
                >
                  <OrganizationHubChatContentAnswersReaction
                    ref="reacted"
                    :scroll-value="scrollValue"
                    :item="item"
                    :user-reaction="userReaction"
                    :change-reaction="onChangeReact"
                    @react="($event) => onChangeReact($event, true)"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2 truncate">
                <OrganizationHubChatContentAnswersBroadcast
                  v-if="item.broadcast && !isCustomer"
                  :message="item"
                  :is-popup="isPopup"
                />
                <i
                  v-if="item.pinned"
                  class="fa-solid fa-thumbtack rotate-45 text-xs"
                />
                <i v-if="item.saved" class="fa-solid fa-bookmark text-xs" />
                <span v-if="item.edited">
                  {{ $t('org.activity.chat.edited') }}
                </span>
                <span>
                  {{ formatDate(item.createdAt, 'HH:mm') }}
                </span>
                <OrganizationHubChatContentAnswersOrganization
                  v-if="showOrg"
                  :message="item"
                />
              </div>
            </div>
          </div>
          <div
            v-if="!userReaction && !isRoomDisabled"
            class="absolute cursor-pointer items-center justify-center text-white/30 opacity-0 transition-all duration-300 group-hover/item:opacity-100"
            :class="[
              actives.includes(item.id) ? 'bg-black/20' : 'bg-black/70',
              item.userReaction ? 'opacity-100' : '',
              hasReaction ? 'bottom-3.5 left-2 transition-none' : 'bottom-1.5',
            ]"
            @mouseenter="mouseEnter"
            @mouseleave="reactHover = false"
          >
            <div v-if="!item.userReaction" class="flex">
              <i
                class="fa-regular fa-face-smile text-xl opacity-100 transition-all"
              />
            </div>

            <img
              v-else
              :src="getUrl(item.userReaction)"
              class="w-3.5"
              alt=""
              data-cy="7d5f74ab531e39cf"
              @click="() => onRemoveReact()"
            />
            <div
              class="absolute bottom-0 left-0 origin-bottom-left transition-all duration-300"
              :class="
                reactHover
                  ? 'z-10 -translate-x-1 -translate-y-4 scale-100 opacity-100'
                  : '-z-10 scale-0 opacity-0'
              "
            >
              <BaseReaction ref="reaction" @on-change="onChangeReact" />
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

import Angry from '~/assets/social/react/Angry.svg';
import Clap from '~/assets/social/react/Clap.svg';
import Funny from '~/assets/social/react/Funny.svg';
import Lovely from '~/assets/social/react/Lovely.svg';
import Sad from '~/assets/social/react/Sad.svg';

export default {
  props: {
    item: Object,
    isSelect: Boolean,
    actives: Array,
    onReply: Function,
    onChange: Function,
    onSelect: Function,
    isPopup: Boolean,
    scrollValue: Number,
    showAvatar: Boolean,
    showName: Boolean,
    isCustomer: Boolean,
    isLateral: Boolean,
  },
  emits: ['locate-reply-message', 'right-menu'],
  setup() {
    const profileStore = useProfileStore();
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    const box = ref();

    return { profileStore, box, hubChatStore, authStore };
  },
  data() {
    return {
      reactHover: false,
      isRightMenu: false,
      showReaction: false,
      changeReactionLoading: false,
      removeReactionLoading: false,
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
    links() {
      return (this.item.attachments || []).filter((r) => r.category === 'link');
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
    role() {
      const roleName = this.item.author?.role.replace('chat-room-', '');
      return roleName;
    },
    isRoomDisabled() {
      return (
        this.hubChatStore.chatInfo?.deleted ||
        this.hubChatStore.chatInfo?.locked
      );
    },
    showOrg() {
      if (this.item.author.type === 'profile' && !this.item.authorFrom) {
        return false;
      } else {
        return this.item.authorFrom || this.item.createdBy;
      }
    },
    chatId() {
      return this.isLateral
        ? this.hubChatStore.lateralChatId
        : this.isPopup
          ? this.hubChatStore.popupChatId
          : this.hubChatStore.chatId;
    },
  },
  watch: {
    scrollValue() {
      this.showReaction = false;
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
    getUrl(name) {
      const imgs = {
        Like: Clap,
        Lovely,
        Angry,
        Funny,
        Sad,
      };
      return imgs[name];
    },
    mouseEnter() {
      this.reactHover = true;
      this.$refs.reaction.flicker();
    },
    async onChangeReact(react, isRemove = false) {
      if (this.changeReactionLoading || this.isRoomDisabled) {
        return;
      }
      this.changeReactionLoading = true;
      this.reactHover = false;
      const oldReact = this.userReaction;
      try {
        if (oldReact) {
          await this.onRemoveReact(oldReact);
          if (isRemove && oldReact === react) {
            this.changeReactionLoading = false;
            return;
          }
        }
        await this.hubChatStore.addReationInMessage({
          roomId: this.hubChatStore.chatId,
          messageId: this.item.id,
          type: react,
        });
        this.item.reactions.count[react] =
          (this.item.reactions.count[react] || 0) + 1;
        if (this.item.reactions.data[react]) {
          this.item.reactions.data[react].unshift({
            userProfile: {
              id: this.profileStore.myProfileDetail.id,
              image: this.profileStore.myProfileDetail.picture,
            },
            reaction: react,
          });
        } else {
          this.item.reactions.data[react] = [
            {
              userProfile: {
                id: this.profileStore.myProfileDetail.id,
                image: this.profileStore.myProfileDetail.picture,
              },
              reaction: react,
            },
          ];
        }
        this.$emit('scroll-to-distance', 20);
        this.changeReactionLoading = false;
      } catch (error) {
        this.changeReactionLoading = false;
      }
    },
    async onRemoveReact(react) {
      if (this.removeReactionLoading) {
        return;
      }
      this.removeReactionLoading = true;
      try {
        await this.hubChatStore.deleteReationInMessage({
          roomId: this.hubChatStore.chatId,
          messageId: this.item.id,
        });
        if (react) {
          this.item.reactions.count[react] =
            this.item.reactions.count[react] - 1;
          this.item.reactions.data[react] = this.item.reactions.data[
            react
          ].filter((r) => r.userProfile.id !== this.authStore.context);
        }
        this.removeReactionLoading = false;
      } catch (error) {
        this.removeReactionLoading = false;
      }
    },
    onContextmenu(e, location = null) {
      if (this.isSelect || this.isRoomDisabled) {
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
    },
    visitProfile(item) {
      this.profileStore.gotoProfilePage(item);
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
}
</style>
<style scoped>
.message-bubble::after {
  content: '';
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  bottom: 0;
  left: 0;
  width: 1rem;
  height: 1.875rem;
  clip-path: path('M 0 0 Q 10 10 20 0 Q 10 24 0 0');
  transform: translate(-0.0625rem, 1rem) rotate(-60deg);
}
</style>

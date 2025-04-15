<template>
  <div class="card relative max-h-full w-full rounded-5">
    <div class="z-[110]">
      <slot />
    </div>
    <div
      class="flex aspect-[9/16] w-full items-center justify-center overflow-hidden rounded-5"
      :style="{
        backgroundColor:
          item?.background ||
          (isPreviewActive ? 'rgba(255,255,255,0.1)' : '#060606'),
      }"
    >
      <div
        v-if="isItemHidden(item.id)"
        class="absolute inset-x-0 z-[9999] flex h-full w-full items-center justify-center bg-black/75 p-3"
      >
        <div class="inline-flex flex-col items-center justify-start gap-3">
          <div
            class="text-center text-base font-black leading-none text-white/75"
          >
            <i class="fa-solid fa-eye-slash" />
          </div>

          <div
            class="self-stretch text-center font-['Inter'] text-base font-semibold tracking-tight text-white/75"
          >
            {{ $t('flux.highlight.story.hidden.label') }}
          </div>
          <div
            class="w-[11.25rem] text-center font-['Inter'] text-xs font-normal text-white/75"
          >
            {{ $t('flux.highlight.story.hidden.desc') }}
          </div>
          <div
            class="inline-flex items-center justify-start gap-1.5 rounded-[0.3125rem] bg-[#e0b92c] px-1.5 py-[0.1875rem]"
          >
            <div
              class="cursor-pointer text-center font-['Inter'] text-xs font-medium leading-[1.125rem] text-[#090909]"
              @click.stop="unhideStory(item.id)"
            >
              {{ $t('post.reel.undo') }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="item.loading" class="skeleton h-full w-full rounded-5" />
      <div v-if="loading" class="h-full w-full rounded-5 !bg-black" />
      <template v-else>
        <div v-if="isPreviewActive" class="gradient-mask z-[101]" />
        <div :class="['h-full w-full', isPreviewActive && 'bg-[#282828]']">
          <FluxesCreationStoryMainWigetsVideo
            v-if="hasPlatformVideo"
            :video-source="platformVideo?.url"
            :video-cover="videoCover"
          />
          <FluxesCreationStoryMainWigetsImage
            v-else
            :image-src="platformImageCover.url"
            :is-preview-active="isPreviewActive"
          />
          <div
            v-if="isOnView"
            class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50"
          >
            <BaseAvatarNext
              :show-online="false"
              :picture="item.title ? item.cover.url : item.owner?.picture"
              :story="item.owner?.story"
              size="lg"
            />
            <div class="flex flex-col items-center gap-1">
              <p
                class="max-w-[12.375rem] truncate text-ellipsis text-2xl font-bold leading-6 text-[#f1f1f1]"
              >
                {{ item.title ? item.title : item.owner.name }}
              </p>
              <p class="text-xl font-bold leading-[1.125rem]">
                {{ timeAgo2(item.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>
    <template v-if="!isOnView && isPreviewActive && !loading">
      <div class="mask z-[101]" />
      <div
        class="absolute bottom-3 right-2 z-[103] flex w-10 flex-col items-center"
      >
        <div
          class="group relative flex cursor-pointer items-center justify-center"
        >
          <div ref="react" data-cy="fd494757f0a08ff4" @click="onClickReact">
            <SocialReaction
              :id="item.id"
              :name="currReactName"
              :count="item.numberOf?.reactionsCount"
              @mouseenter="onMouseEnterReactBox"
            />
          </div>

          <div
            :class="[
              'absolute -top-2 right-12 z-10 opacity-0 transition-all duration-300',
              reactBoxClicked || reactHover
                ? 'scale-100 opacity-100'
                : 'scale-0 opacity-0',
            ]"
          >
            <BaseReaction
              ref="reaction"
              class="!gap-0 bg-[#06060666]"
              :class="popUpOpened ? 'hidden' : ''"
              :emojis="['Clap', 'Lovely', 'Angry', 'Funny', 'Sad']"
              :hover-show-text="true"
              hover-text-style="!-top-8 rounded-full bg-black px-2 py-0.5"
              @on-change="onChangeReact"
              @mouseleave="onMouseLeaveReactBox"
              @mouseenter="mouseEnter"
            />
          </div>
        </div>
        <div
          class="mt-2 flex flex-col items-center text-xl text-[#B0B0B0]"
          data-cy="53469bddc29dbf52"
          @click="handleCommentListPopup(true)"
        >
          <div
            class="group relative flex size-9 cursor-pointer items-center justify-center rounded-5 transition-all hover:bg-white/5 active:scale-95 active:text-[#E0B92C]"
          >
            <span
              class="text-sha block text-center text-[#f1f1f1f1] opacity-100 group-hover:text-white"
            >
              <i class="fa-regular fa-comment text-shadow" />
            </span>
          </div>
          <div class="text-shadow text-xs text-[#f1f1f1f1]">
            {{ item.numberOf?.comments }}
          </div>
        </div>
        <div
          class="mt-2 flex flex-col items-center text-xl text-[#B0B0B0]"
          data-cy="4185eee483bd3819"
          @click="handleShareVisible(true)"
        >
          <div
            class="group relative flex size-9 cursor-pointer items-center justify-center rounded-5 transition-all hover:bg-white/5 active:scale-95 active:text-[#E0B92C]"
          >
            <span
              class="block text-center text-[#f1f1f1f1] opacity-100 group-hover:text-white"
            >
              <i class="fa-regular fa-share-nodes text-shadow" />
            </span>
          </div>
          <div class="text-shadow text-xs text-[#f1f1f1f1]">
            {{ shareCount }}
          </div>
        </div>

        <div
          class="flex flex-col"
          data-cy="d5b38d6291f8b0bf"
          @click="handleReactListPopup(true)"
        >
          <template v-if="list.length">
            <div
              class="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-5"
            >
              <SocialReactionAvatars
                v-for="(user, index) in list.slice(0, 2)"
                :key="index"
                :name="user.reaction"
                :viewer="user?.owner"
                :is-image="true"
                :story-id="user.id"
                :class="[
                  reactCountFormat > 1 && !reactionLoading
                    ? 'absolute -mr-2 first:z-10 first:!-ml-5 last:z-0'
                    : 'absolute',
                ]"
              />
            </div>
          </template>
          <div
            v-else
            class="flex size-9 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
          >
            <i class="fa-solid fa-eye text-shadow text-base text-[#f1f1f1f1]" />
          </div>

          <div class="text-shadow w-full text-center text-xs text-[#f1f1f1f1]">
            {{ reactCountFormat }}
          </div>
        </div>
      </div>
      <div
        class="absolute bottom-3 left-4 right-16 z-[102] flex items-center gap-2"
      >
        <div class="flex-1">
          <div
            v-if="!isOwner"
            class="flex min-h-12 items-center gap-2 rounded-[22px] border-[0.5px] px-4 py-1"
          >
            <textarea
              ref="messageTextarea"
              v-model="message"
              placeholder="Send Message"
              class="w-full resize-none overflow-y-auto !border-none border-[#D9D9D9] bg-transparent text-xs text-white outline-none placeholder:text-[#FAFAFA]"
              rows="1"
              style="max-height: 120px"
              data-cy="48f10f252ddf694a"
              @focus="handleInputFocus(true)"
              @blur="handleInputFocus(false)"
              @keyup.enter="onSend"
              @input="adjustTextareaHeight"
            />

            <div
              v-if="message"
              class="flex size-[1.875rem] cursor-pointer items-center justify-center rounded-[0.3125rem] text-white/60 hover:scale-110 hover:text-white/80 active:scale-95"
            >
              <i
                v-if="sendLoading"
                class="fa-solid fa-spinner mr-1 animate-spin"
              />
              <i
                v-else
                class="fa-solid fa-send"
                :class="sendLoading ? 'pointer-events-none' : ''"
                data-cy="65d7f0b9513ea7b1"
                @click="onSend"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="fluxesStore.reactListPopupVisible"
        class="absolute bottom-0 left-0 right-0 top-0 z-[105] h-full w-full"
        data-cy="23829a28c27fc059"
        @click="handleReactListPopup(false)"
      />

      <div
        v-if="fluxesStore.reactListPopupVisible"
        class="absolute -left-[1.5px] -right-[1.5px] bottom-0 rounded-t-5 bg-black/80 backdrop-blur transition-all duration-300"
        :class="
          fluxesStore.reactListPopupVisible
            ? 'z-[106] h-[60%]'
            : 'pointer-events-none -bottom-[0.25rem] h-[0] overflow-hidden'
        "
      >
        <SocialReactionViews
          :item="item"
          :open="fluxesStore.reactListPopupVisible"
          type="story"
          @user-click="handleUserClick"
          @close="handleReactListPopup"
          @open="handleSetSliderPlayStatus"
        />
      </div>

      <div
        v-if="fluxesStore?.isCommentPopupOpen"
        class="absolute bottom-0 left-0 right-0 top-0 z-[105] h-full w-full"
        data-cy="dd8ec158636c1d3d"
        @click="handleCommentListPopup(false)"
      />

      <div
        v-if="fluxesStore?.isCommentPopupOpen"
        class="absolute -left-[1.5px] -right-[1.5px] bottom-0 rounded-t-5 bg-black/80 backdrop-blur transition-all duration-300"
        :class="
          fluxesStore?.isCommentPopupOpen
            ? 'z-[106] h-[80%]'
            : 'pointer-events-none -bottom-[0.25rem] h-[0] overflow-hidden'
        "
      >
        <SocialComment
          :item="item"
          type="story"
          @user-click="handleUserClick"
          @close="handleCommentListPopup"
          @open="handleSetSliderPlayStatus"
        />
      </div>

      <div
        v-if="fluxesStore.isShareContentVisible"
        class="absolute bottom-0 left-0 right-0 top-0 z-[105] h-full w-full"
        data-cy="4268ddde0c0c8ae6"
        @click="handleShareVisible(false)"
      />

      <div
        class="absolute -left-[1.5px] -right-[1.5px] bottom-0 rounded-t-5 bg-black/80 backdrop-blur transition-all duration-300"
        :class="
          fluxesStore.isShareContentVisible
            ? 'z-[106] h-[80%]'
            : 'pointer-events-none -bottom-[0.25rem] h-[0] overflow-hidden'
        "
      >
        <FluxesCreationStoryMainShare
          :open="fluxesStore.isShareContentVisible"
          :item="item"
          @close="handleShareVisible(false)"
          @open="handleSetSliderPlayStatus"
          @shared="handleShareCount"
        />
      </div>

      <div
        v-if="sentMessage"
        class="absolute left-1/2 top-1/2 z-[107] -translate-x-1/2 -translate-y-1/2"
      >
        <FluxesCreationStoryMainMessage
          @close="handleMessageClose"
          @goto="handleGotoChat"
        />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  inject: {
    SliderTools: {
      from: 'SliderTools',
      default: null, // 如果父组件没有 provide，会使用 null 作为默认值
    },
  },
  props: {
    item: Object,
    isPreviewActive: {
      type: Boolean,
      default: false,
    },
    isOnView: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const globalStore = useGlobalStore();
    const fluxesStore = useFluxesStore();
    const hubChatStore = useHubChatStore();
    const profileStore = useProfileStore();
    const authStore = useAuthStore();
    const socialStore = useSocialStore();

    return {
      globalStore,
      fluxesStore,
      hubChatStore,
      profileStore,
      authStore,
      socialStore,
    };
  },
  data() {
    return {
      changeReactionLoading: false,
      message: '',
      sendLoading: false,
      isInputFocus: false,
      isReactSelected: false,
      reactBoxClicked: false,
      isHover: false,
      sentMessage: false,
      list: [],
      reactHover: false,
      timeoutId: null,
      reactionLoading: false,
      messageTextarea: null,
    };
  },
  computed: {
    isOwner() {
      return this.item.owner.id === this.profileStore.myProfileDetail.id;
    },
    currReactName() {
      return this.item.userReaction?.type || 'like';
    },
    popUpOpened() {
      return (
        this.fluxesStore.isCommentPopupOpen ||
        this.fluxesStore.isShareContentVisible ||
        this.fluxesStore.reactListPopupVisible
      );
    },
    videoCover() {
      return this.item.cover?.url;
    },
    platformImageCover() {
      if (!this.item.files) {
        return false;
      }

      return this.item.files.find((file) =>
        file?.metadata?.mimetype?.startsWith('image/'),
      );
    },
    platformVideo() {
      if (!this.item.files) {
        return false;
      }
      return this.item.files.find((file) =>
        file?.metadata?.mimetype?.startsWith('video/'),
      );
    },
    hasPlatformVideo() {
      if (!this.item.files) {
        return false;
      }

      return this.item.files.some((file) =>
        file?.metadata?.mimetype?.startsWith('video/'),
      );
    },
    reactions() {
      if (!this.item?.numberOf?.reactions) {
        return [];
      }
      const reactions = [];
      for (const key in this.item.numberOf.reactions) {
        const count = this.item.numberOf.reactions[key];
        if (count && count > 0) {
          reactions.push({
            reaction: key,
            count,
          });
        }
      }

      return reactions;
    },
    reactCountFormat() {
      const number = ~~Math.max(this.list.length, this.item.numberOf?.views);
      if (number > 999) {
        return `${(number / 1000).toFixed(1)}k`;
      } else {
        return number;
      }
    },
    shareCount() {
      return this.item.numberOf?.shares;
    },
  },
  watch: {
    isPreviewActive(val, _oldValue) {
      if (val) {
        this.loadAndSetViewer();
      } else {
        this.resetStore();
      }
    },
    reactBoxClicked(val) {
      this.handleSetSliderPlayStatus(val);
    },
    isInputFocus(val) {
      this.handleSetSliderPlayStatus(val);
    },
    reactCountFormat() {
      this.load();
    },
    'item.id': {
      handler() {
        if (this.isPreviewActive) {
          this.loadAndSetViewer();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.handleSetSliderPlayStatus(false);
    this.resetStore();
  },
  methods: {
    handleShareCount(amount) {
      this.item.numberOf.shares += amount;
    },
    loadAndSetViewer() {
      this.load();
      this.setViewer();
    },
    isItemHidden(itemId) {
      return this.fluxesStore.hiddenStories.has(itemId);
    },
    unhideStory(itemId) {
      const userId = this.profileStore.myProfileDetail.id;
      const entityId = itemId;

      this.fluxesStore.unhideStory({ userId, entityId });
    },
    resetStore() {
      this.changeReactionLoading = false;
      this.message = '';
      this.reactBoxClicked = false;
      this.isHover = false;
      this.fluxesStore.reactListPopupVisible = false;
      this.fluxesStore.isCommentPopupOpen = false;
      this.fluxesStore.isShareContentVisible = false;
    },
    reactMap(react) {
      const map = {
        Like: 'clap',
        Clap: 'clap',
        Lovely: 'love',
        Angry: 'angry',
        Funny: 'funny',
        Sad: 'sad',
      };

      return map[react] || 'clap';
    },
    setViewer() {
      this.fluxesStore.setSocialReaction({
        entity: {
          id: this.item.id,
          type: 'story',
        },
      });

      if (this.item.numberOf.views === 0) {
        this.setNewView();
      }
    },
    setNewView() {
      if (this.profileStore.myProfileDetail.id === this.item.owner.id) {
        return;
      }
      const reacted = this.list.find(
        (item) => item.owner.id === this.profileStore.myProfileDetail.id,
      );
      if (reacted === undefined) {
        this.list.push({
          owner: this.profileStore.myProfileDetail,
          reaction: null,
        });
      }
    },
    async createReaction(originReact, react) {
      if (this.isOwner) {
        return;
      }
      this.list.forEach((reaction) => {
        if (reaction.owner.id === this.profileStore.myProfileDetail.id) {
          reaction.reaction = react;
        }
      });
      try {
        await this.fluxesStore
          .setSocialReaction({
            reaction: react,
            entity: {
              id: this.item.id,
              type: 'story',
            },
          })
          .then((res) => {
            this.item.userReaction = {
              id: res.id,
              type: react,
            };
            this.item.numberOf && this.item.numberOf.reactionsCount++;
            if (this.item.numberOf && this.item.numberOf.reactions) {
              this.item.numberOf.reactions[react] =
                (this.item.numberOf.reactions[react] || 0) + 1;
            }
          });
      } catch (error) {
        this.item.userReaction = originReact;
      }
    },
    async removeReaction(originReact, react) {
      try {
        await this.fluxesStore
          .deleteSocialReaction({
            id: this.item.id,
            type: 'story',
          })
          .then(() => {
            this.item.userReaction = null;
            this.item.numberOf && this.item.numberOf.reactionsCount--;
            this.item.numberOf && this.item.numberOf.reactions[react]--;
            this.list.forEach((reaction) => {
              if (reaction.owner.id === this.profileStore.myProfileDetail.id) {
                reaction.reaction = null;
              }
            });
          });
      } catch (error) {
        this.item.userReaction = originReact;
      }
    },
    async updateReaction(originReact, react) {
      const oldReact = originReact.type;

      this.list.forEach((reaction) => {
        if (reaction.owner.id === this.profileStore.myProfileDetail.id) {
          reaction.reaction = react;
        }
      });
      try {
        await this.fluxesStore
          .setSocialReaction({
            reaction: react,
            entity: {
              id: this.item.id,
              type: 'story',
            },
          })
          .then(() => {
            this.item.numberOf && this.item.numberOf.reactions[oldReact]--;
            if (this.item.numberOf && this.item.numberOf.reactions) {
              this.item.numberOf.reactions[react] =
                (this.item.numberOf.reactions[react] || 0) + 1;
            }
          });
      } catch (error) {
        this.item.userReaction = originReact;
      }
    },
    async onChangeReact(newReact) {
      if (this.isOwner) {
        return;
      }
      const react = this.reactMap(newReact);
      this.reactHover = false;
      if (this.changeReactionLoading) {
        return;
      }
      this.changeReactionLoading = true;

      this.reactBoxClicked = false;

      const oldReact = cloneDeep(this.item.userReaction);

      if (!oldReact) {
        this.item.userReaction = {
          type: react,
          id: '',
        };
      } else {
        const cloneReact = this.item.userReaction;
        cloneReact.type = react;
        this.item.userReaction = cloneReact;
      }

      try {
        if (!oldReact) {
          // if !oldReact, it means user has not reacted yet
          await this.createReaction(oldReact, react);
        } else if (oldReact.type === react) {
          // if oldReact === react, it means user has reacted with the same reaction, so we should remove it
          await this.removeReaction(oldReact, react);
        } else {
          // update reaction
          await this.updateReaction(oldReact, react);
        }
      } finally {
        this.changeReactionLoading = false;
        this.reactBoxClicked = false;
      }
    },
    async onClickReact() {
      this.reactHover = false;
      if (this.changeReactionLoading) {
        return;
      }
      this.changeReactionLoading = true;
      const oldReact = cloneDeep(this.item.userReaction);

      if (!oldReact) {
        await this.createReaction(oldReact, 'clap').finally(() => {
          this.changeReactionLoading = false;
        });
      } else {
        await this.removeReaction(oldReact, oldReact.type).finally(() => {
          this.changeReactionLoading = false;
        });
      }
    },
    async onClickMainReact() {
      if (this.item.userReaction) {
        this.reactBoxClicked = !this.reactBoxClicked;
      }
    },
    handleSetSliderPlayStatus(status) {
      if (this.SliderTools) {
        if (this.hasPlatformVideo) {
          this.$emit('share-visible', status);
        }

        if (status) {
          this.SliderTools?.setPause();
        } else {
          this.SliderTools?.setPlay();
        }
      }
    },
    handleReactListPopup(status) {
      this.fluxesStore.reactListPopupVisible = status;
      this.handleSetSliderPlayStatus(status);
    },
    handleCommentListPopup(status) {
      this.fluxesStore.isCommentPopupOpen = status;

      if (status) {
        this.socialStore.showStoryPosts(this.item);
      }

      this.handleSetSliderPlayStatus(status);
    },
    handleShareVisible(status) {
      this.fluxesStore.isShareContentVisible = status;
      this.handleSetSliderPlayStatus(status);
    },
    handleInputFocus(status) {
      this.isInputFocus = status;
      this.handleSetSliderPlayStatus(status);
    },
    async getTagList(searchTerm) {
      const { data } = await this.globalStore.searchProfile({
        limit: 50,
        text: searchTerm || undefined,
      });
      return data;
    },
    async onSend() {
      if (!this.message) {
        return;
      }

      try {
        this.sendLoading = true;
        await this.hubChatStore.sendStoryMessage(
          this.item.owner.id,
          this.item.id,
          this.message,
          this.message,
        );

        this.message = '';
      } catch (error) {
        console.log(error);
      } finally {
        this.sendLoading = false;
        this.sentMessage = true;
        this.$refs.messageTextarea.style.height = 'auto';
      }
    },
    async handleGotoChat() {
      this.$router.push(
        `${this.authStore.hub}/chat?${this.item?.owner.type === 'organization' ? 'orgId' : 'userId'}=${this.item?.owner.id}`,
      );
    },
    handleUserClick(item) {
      item.entityType = item.type;
      this.profileStore.gotoProfilePage(item);
      this.fluxesStore.storyPopup.state = false;
    },
    onMouseEnterReactBox() {
      this.reactHover = true;
      clearTimeout(this.timeoutId);
      this.handleSetSliderPlayStatus(true);

      this.timeoutId = setTimeout(() => {
        this.reactHover = false;
        if (!this.popUpOpened) {
          this.handleSetSliderPlayStatus(false);
        }
      }, 1500);
    },
    onMouseLeaveReactBox() {
      this.handleSetSliderPlayStatus(false);
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.reactHover = false;
      }, 500);
    },
    mouseEnter() {
      this.isHover = true;
      clearTimeout(this.timeoutId);
    },
    async load() {
      if (this.reactionLoading) {
        return;
      }

      this.reactionLoading = true;

      try {
        const { data } = await this.fluxesStore.getSocialReactionList({
          id: this.item.id,
          reaction: undefined,
          type: 'story',
          sortDirection: 'desc',
          limit: 20,
        });

        const reactedUsers = [];
        const noneReactedUsers = [];
        data.forEach((item) => {
          if (item.reaction !== null) {
            reactedUsers.push(item);
          } else {
            noneReactedUsers.push(item);
          }
        });

        this.list = [...reactedUsers, ...noneReactedUsers];
      } catch (error) {
        console.error('Error loading reactions:', error);
      } finally {
        this.reactionLoading = false;
      }
    },
    adjustTextareaHeight(event) {
      const textarea = event.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    },
    handleMessageClose() {
      this.sentMessage = false;
      this.handleSetSliderPlayStatus(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.text-shadow {
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .card {
    display: flex;
    align-items: center;
    height: 100%;
  }
}

.mask {
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  );
  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  );
}

.gradient-mask {
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 15%;
  background: linear-gradient(
    0deg,
    rgba(38, 38, 38, 0) 0%,
    rgba(38, 38, 38, 0.8) 100%
  );
}
</style>

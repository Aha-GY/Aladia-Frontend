<template>
  <div ref="watchRef" class="!m-0 flex h-full justify-center rounded-md !p-0">
    <div class="gradient-mask z-[101]" />
    <div class="relative aspect-[9/16] !w-full !p-0">
      <video
        ref="videoElement"
        class="h-full w-full hover:cursor-pointer"
        :muted="muted"
        autoplay
        loop
        :src="videoUrl"
        @click="handleVideoControlClick"
        @loadedmetadata="onMetadataLoaded"
        @timeupdate="onTimeUpdate"
      />

      <div
        class="absolute right-2.5 top-2.5 z-[8888] flex items-center gap-2.5"
      >
        <span
          class="relative z-[101] flex h-[1.875rem] w-[1.875rem] cursor-pointer items-center justify-center rounded-5 hover:bg-[#E5E5E51A]/10"
          @click="handleVideoControlClick"
        >
          <i v-if="playing" class="fa-solid fa-pause" />
          <i v-if="!playing" class="fa-regular fa-play" />
        </span>

        <span
          class="relative z-[101] flex h-[1.875rem] w-[1.875rem] cursor-pointer items-center justify-center rounded-5 hover:bg-[#E5E5E51A]/10"
          @click="handleClickMute"
        >
          <i v-if="muted" class="fa-regular fa-volume-xmark drop-shadow-md" />
          <i v-if="!muted" class="fa-regular fa-volume drop-shadow-md" />
        </span>

        <el-popover
          v-model:visible="isCopyLinkPopup"
          trigger="click"
          :show-arrow="false"
          placement="bottom-end"
          :popper-style="{
            border: 'none',
            background: 'transparent',
            'box-shadow': 'none',
            padding: '0',
            borderRadius: '0.375rem',
            minWidth: '6.25rem',
            width: 'auto',
            zIndex: 99999,
          }"
        >
          <template #reference>
            <div
              class="group relative z-10 flex h-[1.875rem] w-[1.875rem] cursor-pointer items-center justify-center rounded-[0.3125rem] transition-all hover:rounded-md hover:bg-[#E5E5E51A]/10 active:scale-95"
            >
              <i class="fa-solid fa-ellipsis-h text-base drop-shadow-2xl" />
            </div>
          </template>
          <div class="popupborder bg-[#060606] p-[0.375rem]">
            <ul class="leading-5">
              <BaseMenuItem icon-class="fa-solid fa-link" @click="copyReelLink">
                {{ $t('index.copy.title') }}
              </BaseMenuItem>
            </ul>
          </div>
        </el-popover>
      </div>
      <div :class="[!isExpanded ? 'mask z-[101]' : '']" />
      <div
        :class="
          isExpanded
            ? 'expand-mask absolute bottom-0 left-0 z-[101] flex h-fit w-full flex-col gap-3 bg-gradient-to-b from-transparent to-black/60 px-4 pb-6 text-base'
            : 'absolute bottom-0 left-0 z-[101] flex h-fit w-full flex-col gap-3 bg-gradient-to-b from-transparent to-black/60 pb-6 pl-1 text-base'
        "
      >
        <div class="relative flex shrink-0 items-center gap-2 pt-4">
          <BaseAvatarNext
            :picture="item?.owner?.picture"
            :user-id="item?.owner?.id"
            :online="item?.owner?.online"
            :story="item.owner?.story"
            size="sm"
            class="_text-shadow shrink-0"
          />

          <p
            class="_text-shadow min-w-[4rem] max-w-[10rem] cursor-pointer truncate hover:underline"
            @click="handleUserClick(item.owner)"
          >
            {{ item?.owner?.name }}
          </p>
          <div v-if="!isMe" class="flex items-center justify-between text-xs">
            <BaseButton
              type="outline"
              size="small"
              :data-cy="`follow-suggestion-${item?.owner?.name.toLowerCase().replace(/ /g, '-')}-button`"
              class="text-xs"
              @click="onFollowe"
            >
              <i
                v-if="followeing"
                class="fa-solid fa-spinner animate-spin text-xs"
              />
              <i
                v-else-if="isFollowing"
                class="fa-solid fa-circle-check text-xs"
              />
              <i v-else class="fa-light fa-user-plus text-xs" />
              <div class="text-xs">
                {{
                  isFollowing
                    ? $t('base.member.following')
                    : $t('base.member.follow')
                }}
              </div>
            </BaseButton>
          </div>
        </div>
        <div class="z-[105] h-fit w-full px-2">
          <div
            v-if="isExpanded"
            ref="content"
            class="hide-scrollbar mb-2 max-h-80 w-[90%] overflow-y-scroll text-justify"
          >
            <span
              class="w-full font-['Inter'] text-sm font-normal leading-[18.90px] text-[#d9d9d9]"
              style="word-break: break-word; overflow-wrap: anywhere"
            >
              {{ item?.content }}
              <span
                class="cursor-pointer font-['Inter'] text-sm font-normal leading-[1.181rem] text-[#e0b92c] underline"
                @click="toggleExpand"
              >
                {{ $t('post.content.less') }}
              </span>
            </span>
          </div>
          <div v-else class="flex w-[90%]">
            <p
              class="w-3/4 truncate font-['Inter'] text-sm font-normal leading-[18.90px] text-[#d9d9d9] xs:w-[65%]"
              style="word-break: break-word; overflow-wrap: anywhere"
            >
              {{ item?.content }}
            </p>
            <span
              v-if="isLongDescription"
              class="w-1/4 cursor-pointer font-['Inter'] text-sm font-normal leading-[18.90px] text-[#e0b92c] underline xs:w-[40%]"
              @click="toggleExpand"
            >
              {{ $t('post.content.more') }}
            </span>
          </div>
        </div>
      </div>

      <!-- ----------------Like , comments and share -->

      <div
        class="absolute bottom-48 right-1 z-[103] flex w-10 flex-col gap-2"
        style="height: 5rem"
      >
        <!-- -------------------Reaction------------- -->
        <div
          class="group relative flex h-[3rem] cursor-pointer flex-col items-center justify-between"
          @click="onClickReact"
          @mouseenter="onMouseenterGroup"
          @mouseleave="onMouseleaveGroup"
        >
          <div ref="react" data-cy="fd494757f0a08ff4">
            <SocialReaction
              :id="item.id"
              :name="currReactName"
              :count="item.numberOf?.reactionsCount"
              type="reel"
              @mouseenter="onMouseenterGroup"
            />
          </div>
          <div
            class="absolute -top-2 right-12 z-10 scale-0 opacity-0 transition-all duration-300"
            :class="
              reactBoxClicked || reactboxHover
                ? 'scale-100 opacity-100'
                : 'scale-0 opacity-0'
            "
          >
            <BaseReaction
              ref="reaction"
              class="!gap-0 bg-[#06060666]"
              :emojis="['Clap', 'Lovely', 'Angry', 'Funny', 'Sad']"
              :hover-show-text="true"
              hover-text-style="!-top-8 rounded-full bg-black px-2 py-0.5"
              @on-change="onChangeReact"
            />
          </div>
        </div>

        <!-- -------------------Comment------------------- -->
        <div
          class="flex h-[3rem] cursor-pointer flex-col items-center text-[#B0B0B0]"
          :class="popUpOpened ? 'blur-lg' : ''"
          data-cy="53469bddc29dbf52"
          @click="openCommentPopup(item.id)"
        >
          <div
            class="group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-5 transition-all hover:bg-white/5 active:scale-95 active:text-[#E0B92C]"
          >
            <i class="fa-regular fa-comment _text-shadow text-[#f1f1f1f1]" />
          </div>
          <div class="_text-shadow text-xs text-[#f1f1f1f1]">
            {{ item.numberOf?.comments }}
          </div>
        </div>

        <!-- ---------------------Share--------------- -->
        <div
          class="flex h-[3rem] flex-col items-center text-xl text-[#B0B0B0]"
          @click="openSharePopup(item.id)"
        >
          <div
            class="group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-5 transition-all hover:bg-white/5 active:scale-95 active:text-[#E0B92C]"
          >
            <i
              class="fa-regular fa-share-nodes _text-shadow text-[#f1f1f1f1]"
            />
          </div>
          <div class="_text-shadow text-xs text-[#f1f1f1f1]">
            {{ item.numberOf?.shares }}
          </div>
        </div>

        <!-- ------------------------Views Icon Section-------- -->
        <div
          class="flex h-[3rem] flex-col items-center text-neutral-50"
          data-cy="d5b38d6291f8b0bf"
          @click="openReactionListPopup(item.id)"
        >
          <FluxesCreationReelViews :item="item" />
        </div>
      </div>

      <!-- -----------------Like popup -->
      <div
        v-if="fluxesStore.reelPreview.isReactionListPopupOpen === item.id"
        class="absolute bottom-0 right-0 top-0 z-[105] mb-4 h-full w-full"
        data-cy="23829a28c27fc059"
        @click.stop="closeReactionListPopup"
      />

      <div
        class="absolute -left-[0.0625rem] -right-[0.0625rem] bottom-0 rounded-t-[0.5rem] bg-black/80 backdrop-blur transition-all duration-300"
        :class="
          fluxesStore.reelPreview.isReactionListPopupOpen === item.id
            ? 'z-[106] h-[80%]'
            : 'pointer-events-none -bottom-[0.25rem] h-[0] overflow-hidden'
        "
      >
        <SocialReactionViews
          v-if="fluxesStore.reelPreview.isReactionListPopupOpen === item.id"
          :item="item"
          type="reel"
          @user-click="handleUserClick"
          @close="closeReactionListPopup"
        />
      </div>

      <!-- ------------------Comment popup--------------------- -->
      <div
        v-if="fluxesStore.reelPreview.isCommentPopupOpen === item.id"
        class="absolute bottom-0 left-0 right-0 z-[202] h-full w-full"
        data-cy="dd8ec158636c1d3d"
        @click="closeCommentPopup"
      />
      <div
        class="absolute -left-[1px] -right-[1px] bottom-0 rounded-t-[8px] bg-black/80 backdrop-blur transition-all duration-300"
        :class="
          fluxesStore.reelPreview.isCommentPopupOpen === item.id
            ? 'z-[9999] h-[80%]'
            : 'pointer-events-none -bottom-[0.25rem] h-[0] overflow-hidden'
        "
      >
        <SocialComment
          v-if="fluxesStore.reelPreview.isCommentPopupOpen === item.id"
          :item="item"
          type="reel"
          @user-click="handleUserClick"
          @close="closeCommentPopup"
        />
      </div>

      <!-- --------------Share popup------------>

      <div
        v-if="fluxesStore.reelPreview.isSharePopupOpen === item.id"
        class="absolute bottom-0 left-0 right-0 z-[105] h-full w-full"
        data-cy="4268ddde0c0c8ae6"
        @click="closeSharePopup"
      />

      <div
        class="absolute bottom-0 left-0 right-0 w-full rounded-t-5 bg-black/80 backdrop-blur backdrop-brightness-100 transition-all duration-300"
        :class="
          fluxesStore.reelPreview.isSharePopupOpen === item.id
            ? 'z-[106] h-[80%] w-full'
            : 'pointer-events-none -bottom-[0.25rem] h-[0] w-full overflow-hidden'
        "
      >
        <FluxesCreationReelShare
          v-if="fluxesStore.reelPreview.isSharePopupOpen === item.id"
          :open="isSharePopupOpen"
          :item="item"
          @close="closeSharePopup"
          @open="handleSetSliderPlayStatus"
        />
      </div>

      <div class="absolute bottom-2.5 left-0 z-[103] w-full p-1">
        <div
          ref="progressBar"
          class="h-1 w-full cursor-pointer rounded-lg bg-gray-400"
          @mousedown="startDragging"
          @click="handleProgressClick"
        >
          <div
            class="_progress-bar h-full rounded-lg bg-white"
            :style="{ transform: `scaleX(${progress / 100})` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    index: Number,
  },
  setup() {
    const fluxesStore = useFluxesStore();
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();

    const videoElement = ref(null);
    const { playing, muted } = useMediaControls(videoElement);

    const handleClickPause = () => {
      if (videoElement.value.paused) {
        videoElement.value.play();
      } else {
        videoElement.value.pause();
      }
    };

    const handleClickMute = () => {
      videoElement.value.muted = !videoElement.value.muted;
    };

    return {
      fluxesStore,
      authStore,
      socialStore,
      profileStore,
      videoElement,
      playing,
      muted,
      handleClickMute,
      handleClickPause,
    };
  },
  data() {
    return {
      isCopyLinkPopup: false,
      isShareContentVisible: false,
      isReactSelected: false,
      reactBoxClicked: false,
      changeReactionLoading: false,
      reactListPopup: false,
      isHover: false,
      reactboxHover: false,
      progressBarWidth: 0,
      duration: 0,
      currentTime: 0,
      isDragging: false,
      wasPlaying: false,
      isShowMore: false,
      list: [],
      reactionLoading: false,
      psMask: 10,
      truncateLength: 32,
      followeing: false,
      isFollowing: false,
      followers: 0,
      followings: 0,
      commentPopup: false,
      isSharePopupOpen: false,
      progress: 0,
    };
  },
  computed: {
    isExpanded() {
      return (
        this.fluxesStore.reelPreview.isShowingMoreDescription === this.item.id
      );
    },

    isMe() {
      return this.profileStore.myProfileDetail.id === this.item?.owner.id;
    },
    numberOfViews() {
      return this.item?.numberOf?.views;
    },
    isLongDescription() {
      return this.item?.content?.length > this.truncateLength;
    },

    videoUrl() {
      return this.item.files[0]?.url;
    },
    popUpOpened() {
      return (
        this.fluxesStore.isCommentPopupOpen ||
        this.isShareContentVisible ||
        this.reactListPopup
      );
    },
    reactCountFormat() {
      const number = ~~this.list.length;
      if (number > 999) {
        return `${(number / 1000).toFixed(1)}k`;
      } else {
        return number;
      }
    },
    currReactName() {
      return this.item.userReaction?.type || 'like';
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
    hasReaction() {
      return this.item.numberOf?.reactionsCount > 0;
    },
  },
  watch: {
    item: {
      handler() {
        this.isFollowing = this.item?.isFollowing || false;
        this.followers = this.item?.numberOf?.followers || 0;
        this.followings = this.item?.numberOf?.followings || 0;
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    const video = this.$refs.videoElement;
    video.addEventListener('timeupdate', this.updateProgress);
  },
  beforeUnmount() {
    const video = this.$refs.videoElement;
    video.removeEventListener('timeupdate', this.updateProgress); // Clean up the event listener
  },
  methods: {
    async onFollowe() {
      if (this.authStore.logged) {
        if (this.followeing) {
          return;
        }
        try {
          this.followeing = true;
          this.item.owner.entityType = this.item.owner.type;
          const data = await this.profileStore.follow(this.item.owner);
          this.isFollowing = !!data.followed;
          this.followers = data.followed
            ? this.followers + 1
            : this.followers - 1 <= 0
              ? 0
              : this.followers - 1;
          this.followeing = false;
        } catch (error) {
          this.followeing = false;
          throw error;
        }
      } else {
        this.authStore.popup = true;
      }
    },
    handleProgressClick(event) {
      const progressBar = this.$refs.progressBar;
      const rect = progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const newTime = (clickX / rect.width) * this.duration;

      this.currentTime = newTime;
      this.$refs.videoElement.currentTime = newTime;
    },
    startDragging(event) {
      const video = this.$refs.videoElement;

      this.wasPlaying = !video.paused;
      video.pause();

      this.isDragging = true;
      this.updateProgressOnDrag(event);

      document.addEventListener('mousemove', this.updateProgressOnDrag);
      document.addEventListener('mouseup', this.stopDragging);
    },
    stopDragging() {
      const video = this.$refs.videoElement;

      this.isDragging = false;

      document.removeEventListener('mousemove', this.updateProgressOnDrag);
      document.removeEventListener('mouseup', this.stopDragging);

      video.currentTime = this.currentTime;

      if (this.wasPlaying) {
        video.play();
      }
    },
    updateProgressOnDrag(event) {
      if (!this.isDragging) {
        return;
      }

      const progressBar = this.$refs.progressBar;
      const rect = progressBar.getBoundingClientRect();
      const dragX = Math.min(
        Math.max(event.clientX - rect.left, 0),
        rect.width,
      );
      const newTime = (dragX / rect.width) * this.duration;

      this.currentTime = newTime;
    },
    updateProgress() {
      if (!this.isDragging) {
        const video = this.$refs.videoElement;
        this.currentTime = video.currentTime;
        this.duration = video.duration;
      }
    },
    toggleExpand() {
      if (
        this.fluxesStore.reelPreview.isShowingMoreDescription === this.item.id
      ) {
        this.fluxesStore.reelPreview.isShowingMoreDescription = null;
      } else {
        this.fluxesStore.reelPreview.isShowingMoreDescription = this.item.id;
        this.$nextTick(() => {
          const content = this.$refs.content;
          if (content) {
            content.scrollTop = content.scrollHeight;
          }
        });
      }
    },
    onTimeUpdate() {
      const currentTime = this.$refs.videoElement.currentTime;
      const duration = this.$refs.videoElement.duration;
      this.progress = (currentTime / duration) * 100;
    },
    onMetadataLoaded() {
      this.duration = this.$refs.videoElement.duration;
    },
    handleVideoControlClick() {
      this.fluxesStore.reelPreview.isCommentPopupOpen = false;
      this.handleClickPause();
    },
    closeStory() {
      this.$emit('close');
    },
    copyReelLink() {
      this.isCopyLinkPopup = false;
      navigator.clipboard.writeText(
        `${window.location.origin}/reels/${this.item.id}`,
      );
      this.$toast.success('Link copied');
    },
    resetStore() {
      this.changeReactionLoading = false;
      this.reactBoxClicked = false;
      this.isHover = false;
      this.reactListPopup = false;
      this.fluxesStore.reelPreview.isCommentPopupOpen = false;
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
          type: 'reel',
        },
      });
    },
    async createReaction(originReact, react) {
      this.list.forEach((reaction) => {
        if (reaction.viewer.id === this.profileStore.myProfileDetail.id) {
          reaction.reaction = react;
        }
      });
      try {
        await this.fluxesStore
          .setSocialReaction({
            reaction: react,
            entity: {
              id: this.item.id,
              type: 'reel',
            },
          })
          .then((res) => {
            this.item.userReaction = {
              id: res.id,
              type: react,
            };
            this.item.numberOf && this.item.numberOf.reactionsCount++;
            this.item.numberOf && this.item.numberOf.reactions[react]++;
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
            type: 'reel',
          })
          .then(() => {
            this.item.userReaction = null;
            if (this.item.numberOf && this.item.numberOf.reactionsCount !== 0) {
              this.item.numberOf && this.item.numberOf.reactionsCount--;
            }
            if (this.item.numberOf && this.item.numberOf.reactions[react]) {
              this.item.numberOf && this.item.numberOf.reactions[react]--;
            }
            this.list.forEach((reaction) => {
              if (reaction.viewer.id === this.profileStore.myProfileDetail.id) {
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
        if (reaction.viewer.id === this.profileStore.myProfileDetail.id) {
          reaction.reaction = react;
        }
      });
      try {
        await this.fluxesStore
          .setSocialReaction({
            reaction: react,
            entity: {
              id: this.item.id,
              type: 'reel',
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
      const react = this.reactMap(newReact);

      if (this.changeReactionLoading) {
        return;
      }
      this.changeReactionLoading = true;

      this.reactBoxClicked = false;

      const oldReact = cloneDeep(this.item.userReaction);

      // // Initialize userReaction data. When there is no data, it is null. When there is data, it is {id: 'xxx', type: 'xx'}
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
      this.handleClickPause(status);
    },
    async onMouseenterGroup() {
      this.reactboxHover = true;
    },
    onMouseleaveGroup() {
      this.reactboxHover = false;
    },
    handleReactListPopup(status) {
      this.reactListPopup = status;
      this.handleSetSliderPlayStatus(status);
    },

    openCommentPopup(id) {
      this.fluxesStore.reelPreview.isCommentPopupOpen = id;
      this.socialStore.showReelPosts(this.item);
    },
    closeCommentPopup() {
      this.fluxesStore.reelPreview.isCommentPopupOpen = null;
    },

    openSharePopup(id) {
      this.fluxesStore.reelPreview.isSharePopupOpen = id;
      this.isSharePopupOpen = true;
    },
    closeSharePopup() {
      this.fluxesStore.reelPreview.isSharePopupOpen = null;
      this.isSharePopupOpen = false;
    },

    openReactionListPopup(id) {
      this.fluxesStore.reelPreview.isReactionListPopupOpen = id;
    },
    closeReactionListPopup() {
      this.fluxesStore.reelPreview.isReactionListPopupOpen = null;
    },
    handleInputFocus(status) {
      this.isInputFocus = status;
      this.handleSetSliderPlayStatus(status);
    },

    async handleUserClick(item) {
      await this.profileStore.gotoProfilePage({
        id: item.id,
        entityType: item.type,
      });
      this.fluxesStore.reelPreview.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.expand-mask {
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: auto;
  z-index: 0;
  background: linear-gradient(
    180deg,
    rgba(38, 38, 38, 0) 4.25%,
    rgba(0, 0, 0, 0.8) 24%
  );
}
.mask {
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 30%;
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
  height: 30%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  );
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  );
}

._text-shadow {
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.5);
}

._progress-bar {
  height: 100%;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.2s linear;
}
</style>

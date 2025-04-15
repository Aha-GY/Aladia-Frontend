<template>
  <div
    class="relative flex items-center justify-center rounded-lg"
    @dblclick="handleFullscreen"
  >
    <div
      class="relative flex h-[33rem] w-full justify-center overflow-hidden rounded-lg"
    >
      <BasePlayer
        class="_reel-player h-[99.8%] w-full rounded-lg"
        :option="option"
        @get-instance="getInstance"
      />

      <div
        class="detail absolute bottom-0 left-4 flex h-fit w-[92%]"
        :class="control ? 'bottom-[12%]' : 'hidden'"
      >
        <div class="z-10 w-full">
          <div class="flex w-full justify-between">
            <p
              class="w-full truncate font-['Inter'] text-sm font-normal leading-[18.90px] text-white"
            >
              {{ item?.content }}
            </p>
            <span
              v-if="item?.content.length > 100"
              class="flex w-24 cursor-pointer font-['Inter'] text-sm font-normal leading-[18.90px] text-[#e0b92c] underline"
              @click="handleFullscreen('seemore')"
            >
              {{ $t('post.content.more') }}
            </span>
          </div>
        </div>
      </div>

      <div
        class="pointer-events-none absolute inset-0 !z-[5] h-full w-full bg-gradient-to-b from-transparent via-transparent to-black/40"
      />

      <div
        class="absolute right-1 top-[15rem] z-10 flex w-10 flex-col items-center space-y-2"
      >
        <div
          class="group relative flex cursor-pointer items-center justify-center"
          @mouseenter="onMouseenterGroup"
          @mouseleave="onMouseleaveGroup"
        >
          <div ref="react" data-cy="fd494757f0a08ff4" @click="onClickReact">
            <SocialReaction
              :id="item.id"
              :name="currReactName"
              :count="item.numberOf?.reactionsCount"
              type="reel"
              @mouseenter="onMouseenterGroup"
            />
          </div>

          <div
            class="absolute -top-3 right-9 scale-0 opacity-0 transition-all duration-300"
            :class="
              reactBoxClicked || reactHover
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
              @mouseleave="onMouseleaveGroup"
              @mouseenter="mouseEnter"
            />
          </div>
        </div>

        <div
          class="flex flex-col items-center text-[#d9d9d9]"
          data-cy="53469bddc29dbf52"
          @click="handleFullscreen('comment')"
        >
          <BaseButton
            type="tertiary"
            icon="fa-regular fa-comment"
            class="flex items-center justify-center p-0.5 !text-white !opacity-100"
          />
          <div class="text-shadow text-xs">{{ item.numberOf?.comments }}</div>
        </div>

        <div
          class="flex flex-col items-center text-white"
          @click.stop="handleFullscreen('shares')"
        >
          <BaseButton
            type="tertiary"
            icon="fa-regular fa-share-nodes"
            class="flex items-center justify-center p-0.5 !text-white !opacity-100"
          />

          <div class="text-shadow text-xs">{{ item.numberOf?.shares }}</div>
        </div>

        <div
          class="text-shadow flex flex-col items-center"
          data-cy="d5b38d6291f8b0bf"
          @click="handleFullscreen('reactions')"
        >
          <template v-if="list.length">
            <div
              class="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-5"
            >
              <SocialReactionAvatars
                v-for="(user, index) in list.slice(0, 2)"
                :key="index"
                :name="user.reaction"
                :viewer="user?.viewer"
                :is-image="true"
                :story-id="user.id"
                :class="[
                  reactCountFormat > 1 && !reactionLoading
                    ? 'absolute -mr-2 first:z-10 first:!-ml-5 last:z-0 last:-mr-1'
                    : 'absolute',
                ]"
              />
            </div>
          </template>
          <div v-else>
            <div
              class="relative flex h-10 w-12 cursor-pointer items-center justify-center rounded-5"
            >
              <BaseButton
                type="tertiary"
                icon="fa-solid fa-eye"
                class="flex items-center justify-center p-0.5 !text-white !opacity-100"
              />
            </div>
          </div>
          <div class="text-shadow w-full text-center text-xs text-[#f1f1f1f1]">
            {{ reactCountFormat }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { _REACT_USERLIST_CACHE } from '~/constant/social';

export default {
  props: {
    item: Object,
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const fluxesStore = useFluxesStore();
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();
    const router = useRouter();
    return { fluxesStore, socialStore, profileStore, router };
  },
  data() {
    return {
      isShareContentVisible: false,
      reactBoxClicked: false,
      changeReactionLoading: false,
      reactListPopup: false,
      reactboxHover: false,
      isExpanded: false,
      reactionLoading: false,
      reactHover: false,
      list: [],
      art: null,
      control: true,
      ended: false,
      observer: null,
      option: {
        playbackRate: true,
        aspectRatio: true,
        muted: true,
        miniProgressBar: false,
        lang: 'en',
        controls: [],
        linearGradient: true,
        portraitScreen: true,
        moreVideoAttr: {
          crossOrigin: 'anonymous',
        },
        loop: true,
      },
      hasSetViewer: false,
    };
  },
  computed: {
    numberOfViews() {
      return this.item.numberOf?.views;
    },
    formattedTime() {
      return this.formatTime(this.currentTime);
    },
    formattedDuration() {
      return this.formatTime(this.duration);
    },
    videos() {
      return (this.item.files || []).filter((r) =>
        r.metadata.mimetype.includes('video'),
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
  },
  mounted() {
    this.load();
  },
  beforeUnmount() {
    this.observer?.disconnect();
  },
  methods: {
    getInstance(art) {
      this.art = art;
      art.url = this.videos[0]?.url || '';
      art.poster = this.image?.url || '';

      art.on('control', (state) => {
        this.control = state;
      });

      art.on('video:play', () => {
        this.ended = false;
      });

      art.on('video:ended', () => {
        this.ended = true;
      });

      art.on('ready', () => {
        let timeoutId = null;
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                art.play();
                if (!this.hasSetViewer) {
                  timeoutId = setTimeout(() => {
                    this.setViewer();
                    this.hasSetViewer = true;
                  }, 3000);
                }
              } else {
                art.pause();
                if (timeoutId) {
                  clearTimeout(timeoutId);
                  timeoutId = null;
                }
              }
            });
          },
          {
            threshold: 0.5,
          },
        );
        this.observer.observe(art.video);
      });
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
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
    onMouseenterGroup() {
      this.reactHover = true;
    },
    onMouseleaveGroup() {
      this.reactHover = false;
    },
    mouseEnter() {
      this.isHover = true;
    },
    async handleFullscreen(popup) {
      this.fluxesStore.reelPopup.reel_Id = this.item.id;
      this.fluxesStore.reelPreview.previousRoute =
        this.router.currentRoute.value.fullPath;
      const url = `/reels/${this.item.id}`;
      history.pushState(null, '', url);
      this.fluxesStore.reelPopup.state = true;
      // this.$router.push(url);
      await sleep(100);
      switch (popup) {
        case 'comment':
          this.fluxesStore.reelPreview.isCommentPopupOpen = this.item.id;
          this.socialStore.showReelPosts(this.item);
          break;
        case 'shares':
          this.fluxesStore.reelPreview.isSharePopupOpen = this.item.id;
          break;
        case 'reactions':
          this.fluxesStore.reelPreview.isReactionListPopupOpen = this.item.id;
          break;
        case 'seemore':
          this.fluxesStore.isShowMoreDescription = true;
          break;
        default:
          console.warn(`Unknown popup type: ${popup}`);
      }
    },
    onMouseEnterReactBox() {
      this.reactHover = true;
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(() => {
        this.reactHover = false;
      }, 1500);
    },
    async load() {
      this.reactionLoading = true;
      try {
        const { data } = await this.fluxesStore.getSocialReactionList({
          id: this.item.id,
          reaction: undefined,
          type: 'reel',
          sortDirection: 'desc',
          limit: 20,
        });

        const reactedUsers = data.filter((item) => item.reaction !== null);
        const noneReactedusers = data.filter((item) => item.reaction === null);
        this.list = [...reactedUsers, ...noneReactedusers];
      } catch (e) {
        console.log(e);
      } finally {
        this.reactionLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.text-shadow {
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.5);
}
._reel-player {
  :deep(.art-video-player) {
    .art-bottom {
      z-index: 20 !important;
    }

    .art-mask {
      z-index: 20 !important;
    }
  }
}
</style>

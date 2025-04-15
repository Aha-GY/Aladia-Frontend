<template>
  <div class="mb-3 last:mb-5">
    <div ref="main" class="main-box">
      <div v-if="item.skeleton" class="relative">
        <div ref="skeleton" class="absolute left-0 top-0 h-12 w-12" />
        <SocialCommentSkeleton :level="level" />
      </div>
      <div v-else class="relative flex items-start justify-between gap-1">
        <div ref="image" class="relative z-10 shrink-0">
          <BaseAvatarNext
            :picture="item.owner.picture"
            :class="isReply ? 'is-reply' : 'is-answer'"
            :story="item?.owner?.story"
            :user-id="item?.owner?.id"
            :show-online="false"
            :size="level < 2 ? 'md' : 'sm'"
          />
        </div>
        <div class="w-full flex-1">
          <div
            class="--mention-link-enabled group relative mr-3 inline-flex min-h-[3rem] min-w-4 flex-col rounded-[0.3125rem] border bg-[#242526] px-3 py-[0.625rem] text-13 transition-all duration-300"
            :class="{
              'border-white/50 bg-[#313131]': isReplying,
              'border-transparent bg-[#101010]': !isReplying,
            }"
          >
            <SocialCommentAnswerHeader
              :item="item"
              :level="level"
              :type="type"
              @on-user-click="handleUserClick"
              @delete="onDelete"
              @edit="onEdit"
              @chat="handleChat"
              @follow="handleFollow"
            />
            <SocialCommentItemWidgetsBubble
              v-if="item.content"
              :body="item.content"
              class="text-[#B0B0B0]"
              @expanded="handleExpand"
            />

            <div v-if="reactions.allCount" class="group/item">
              <SocialCommentAnswerReaction
                :item="item"
                :reactions="reactions"
                class="absolute -bottom-[26px] right-0.5 z-10 group-hover/item:translate-x-0.5"
              />
              <SocialCommentAnswerReactionHover
                :item="item"
                :reactions="reactions"
                class="group-hover/item:max-h-40 group-hover/item:opacity-100"
              />
            </div>

            <SocialCommentAnswerGif :item="item" />
          </div>
          <SocialCommentAnswerAttachments :item="item" />
          <SocialCommentItemWidgetsLooms
            v-if="item.loomUrls && item.loomUrls.length"
            :files="item.loomUrls"
          />

          <div class="flex items-center justify-between px-2">
            <div class="flex items-center gap-3 text-xs font-medium">
              <div
                v-if="level !== 3 || !isReply"
                class="relative flex h-7 w-10 cursor-pointer items-center justify-center gap-2 rounded leading-none text-[#FAFAFA] transition-all active:scale-95"
                :class="
                  repliesOpen
                    ? 'font-semibold'
                    : 'font-normal hover:font-semibold'
                "
                data-cy="0e9889668720b108"
                @click="onRepliesClick"
              >
                <i v-if="repliesOpen" class="fa-solid fa-list-tree h-3" />
                <i v-else class="fa-light fa-list-tree h-3" />
                <i
                  v-if="repliesOpen && repliesLoading"
                  class="fa-solid fa-spinner animate-spin text-xs"
                />
                <div v-else>{{ item.numberOf?.replies || 0 }}</div>

                <div
                  class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-0 transition-all group-hover:w-full"
                  :class="repliesOpen ? 'w-full' : ''"
                />
              </div>
              <div
                v-if="level === 3"
                class="group relative flex h-7 w-10 cursor-pointer items-center justify-center gap-2 leading-none text-[#FAFAFA] transition-all active:scale-95"
                data-cy="d3d304f3ffff0c0c"
                @click="onMentionClick"
              >
                {{ $t('flux.comment.tag') }}
                <div
                  class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-0 transition-all group-hover:w-full"
                />
              </div>
              <div
                class="relative flex cursor-pointer items-center justify-center gap-2 rounded leading-none text-[#FAFAFA] transition-all duration-300"
                @mouseenter="reactHover = true"
                @mouseleave="reactHover = false"
              >
                <SocialCommentItemReact
                  v-if="userReact"
                  :name="userReact"
                  @click="onChangeReact(userReact)"
                />
                <p v-else>Like</p>

                <div
                  class="absolute -top-4 left-1/2 z-10 scale-0 opacity-0 transition-all duration-300"
                  :class="[
                    reactHover
                      ? '-translate-x-[4.8rem] -translate-y-8 scale-100 opacity-100'
                      : '',
                    level > 2
                      ? '-translate-x-[65%] 2xl:-translate-x-[45%]'
                      : '-translate-x-[45%]',
                  ]"
                >
                  <SocialCommentsReaction
                    @on-mouseenter="onMouseenter"
                    @on-change="onChangeReact"
                  />
                </div>
              </div>
              <div
                v-if="level !== 3 || !isReply"
                class="relative flex h-7 w-10 cursor-pointer items-center justify-center gap-2 leading-none text-[#FAFAFA] transition-all active:scale-95"
                data-cy="8d2721b693b04ca1"
                @click="onReplyClick"
              >
                {{ $t('flux.comment.reply') }}
                <div
                  class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-0 transition-all group-hover:w-full"
                />
              </div>
            </div>
          </div>
          <div
            v-if="item.replies?.length && level !== 3 && repliesOpen"
            class="pt-3"
          >
            <SocialCommentAnswer
              v-for="reply in item.replies"
              ref="replys"
              :key="reply?.id"
              :is-reply="true"
              :level="level + 1"
              :answer="item"
              :answers="$refs.main"
              :item="reply"
              :type="type"
              @on-get-scroll-top="onGetScrollTop"
              @delete-comment="handleSubCommentDelete"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isReply"
      ref="line"
      class="absolute h-0 rounded-bl-xl border-b border-l border-[#5c5c5c] transition-opacity duration-300"
      :class="[
        showLine ? 'opacity-100' : 'opacity-0',
        level > 2
          ? 'left-4 top-[2.1rem] w-[1.6rem]'
          : 'left-8 top-[3.7rem] w-9',
      ]"
    />
  </div>
</template>

<script>
import Angry from '~/assets/social/react/Angry.svg';
import Clap from '~/assets/social/react/Clap.svg';
import Funny from '~/assets/social/react/Funny.svg';
import Lovely from '~/assets/social/react/Lovely.svg';
import Sad from '~/assets/social/react/Sad.svg';

export default {
  props: {
    item: Object,
    isReply: Boolean,
    level: Number,
    answer: Object,
    answers: Object,
    mains: Object,
    type: String,
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();
    const fluxesStore = useFluxesStore();
    return { authStore, socialStore, profileStore, fluxesStore };
  },
  data() {
    return {
      showLine: false,
      repliesOpen: false,
      repliesLoading: false,
      reactHover: false,
      imgs: {
        clap: Clap,
        love: Lovely,
        angry: Angry,
        funny: Funny,
        sad: Sad,
      },
    };
  },
  computed: {
    user() {
      return this.authStore.context;
    },
    question() {
      return this.socialStore.postItem;
    },
    isReplying() {
      return this.socialStore.answerTo === this.item;
    },
    isMention() {
      return false;
    },
    username() {
      const { owner } = this.item;

      return owner?.name ?? 'Aladia User';
    },
    defaultReact() {
      return 'Like';
    },
    userReact() {
      return this.item.userReaction?.type || null;
    },
    isOwner() {
      return this.question.owner.id === this.user;
    },
    numberOf() {
      return this.item?.numberOf || {};
    },
    isBestAnswer() {
      return this.question.answerId === this.item.id;
    },
    reactions() {
      if (!this.numberOf?.reactions) {
        return [];
      }
      const reactions = [];
      let allCount = 0;
      for (const key in this.numberOf.reactions) {
        const count = this.numberOf.reactions[key];
        if (count && count > 0) {
          reactions.push({
            reaction: key,
            count,
            url: this.imgs[key.toLowerCase()],
          });
          allCount += count;
        }
      }
      return {
        reactions,
        allCount,
      };
    },
  },
  watch: {
    'socialStore.answerToId'(id) {
      if (id === this.item.id) {
        this.getReplies(this.socialStore.tempData);
        this.item.numberOf.replies += 1;
        this.socialStore.answerToId = null;
      }
    },
    'socialStore.answerLineId'(id) {
      if (id === this.answer?.id && this.isReply) {
        this.updateLine();
      }
    },
  },
  methods: {
    async handleExpand() {
      this.socialStore.answerLineId = null;

      await this.$nextTick();
      this.updateLine();
      for (let index = 0; index < this.$refs.replys?.length; index++) {
        const reply = this.$refs.replys[index];
        reply.updateLine();
      }
      if (this.isReply) {
        this.socialStore.answerLineId = this.answer?.id;
      }
    },
    async updateLine() {
      if (!this.isReply) {
        return;
      }
      await sleep(100);
      this.showLine = true;
      const $line = this.$refs.line;
      let $image = this.$refs.image;
      if (this.item.skeleton) {
        $image = this.$refs.skeleton;
      }
      const $main = $line.closest('.main-box');
      const imageRect = $image.getBoundingClientRect();
      const mainRect = $main.getBoundingClientRect();
      if (this.level > 2) {
        $line.style.height = `${imageRect.top - mainRect.top + imageRect.height / 2 - 32}px`;
      } else {
        $line.style.height = `${imageRect.top - mainRect.top + imageRect.height / 2 - 56}px`;
      }
    },
    onReplyClick() {
      this.socialStore.resetEditComment();
      this.socialStore.answerTo = this.item;
      this.socialStore.answerReplying = true;
      this.socialStore.isReplay = true;
      this.onGetScrollTop();
    },
    onGetScrollTop() {
      let offsetTop = this.$refs.main.offsetTop;
      if (this.level === 2) {
        offsetTop += this.answers.offsetTop;
      }
      this.socialStore.answerscrollTop = offsetTop;
    },
    async getReplies(arr) {
      this.socialStore.answerLineId = null;
      this.repliesOpen = true;
      this.repliesLoading = true;

      if (!this.item.replies) {
        this.item.replies = [];
      }
      if (arr) {
        this.item.replies.unshift(arr);
      }

      await sleep(300);
      const { data } = await this.socialStore.getReplies({
        entityId: this.question.id,
        parentId: this.item.id,
        sortDirection: this.socialStore.sortDirection,
        limit: 100,
      });

      this.item.replies = data || [];
      this.repliesLoading = false;
      await this.$nextTick();
      if (this.item.replies.length === 0) {
        this.repliesOpen = false;
      }

      this.updateLine();
      for (let index = 0; index < this.$refs.replys?.length; index++) {
        const reply = this.$refs.replys[index];
        reply.updateLine();
      }
      if (this.isReply) {
        this.socialStore.answerLineId = this.answer?.id;
      }
    },
    async onRepliesClick() {
      this.socialStore.answerLineId = null;
      await sleep(300);
      if (this.level === 3) {
        return;
      }
      if (this.repliesLoading) {
        return;
      }
      if (this.repliesOpen === false) {
        this.item.replies = [];
        this.getReplies();
      } else {
        this.repliesOpen = false;
        if (this.isReply) {
          this.socialStore.answerLineId = this.answer?.id;
        }
      }
    },
    onMentionClick() {
      const { owner } = this.item;
      const tag = {
        username: this.username,
        image: owner.picture,
        id: owner.id,
      };

      const quill = window['answer-quill'];
      quill.getModule('mention').insertItem(
        {
          denotationChar: '@',
          id: tag.id,
          fullName: tag.username,
        },
        true,
      );

      if (this.isReply) {
        this.socialStore.answerTo = this.answer;
        this.$emit('onGetScrollTop');
      } else {
        this.socialStore.answerTo = this.question;
      }

      this.socialStore.answerReplying = true;
    },
    onMouseenter(react) {
      this.item.tempReact = react;
    },
    async onChangeReact(react) {
      this.reactHover = false; // hide SocialCommentsReaction component
      const oldReact = cloneDeep(this.item.userReaction);
      if (oldReact) {
        this.item.userReaction.type = react;
      } else {
        this.item.userReaction = {
          type: react,
          id: '',
        };
      }
      try {
        await sleep(300);
        if (!oldReact || oldReact.type === react) {
          const { id } = await this.fluxesStore.setSocialReaction({
            reaction: react,
            entity: {
              id: this.item.id,
              type: 'comment',
            },
          });
          if (!this.item.userReaction.id) {
            this.item.userReaction.id = id;
          }

          if (!oldReact) {
            this.item.numberOf.reactions[react] += 1;
          } else {
            this.item.numberOf.reactions[react] -= 1;
            this.item.userReaction = null;
          }
        } else {
          await this.fluxesStore.setSocialReaction({
            reaction: react,
            entity: {
              id: this.item.id,
              type: 'comment',
            },
          });
          this.item.numberOf.reactions[oldReact.type] -= 1;
          this.item.numberOf.reactions[react] += 1;
        }
      } catch (error) {
        this.item.userReaction = oldReact;
      }
    },
    handleUserClick() {
      this.profileStore.gotoProfilePage({
        id: this.item.owner.id,
        entityType: this.item.owner?.type,
      });
      if (this.type === 'story') {
        // Close the story popup
        this.fluxesStore.storyPopup.state = false;
      } else if (this.type === 'reel') {
        // Close the reel popup
        this.fluxesStore.reelPopup.state = false;
        this.fluxesStore.reelPreview.visible = false;
      }

      this.fluxesStore.isCommentPopupOpen = false;
    },
    onDelete({ commentId, parentId, subReplies }) {
      this.$emit('deleteComment', { commentId, parentId, subReplies });
    },
    handleSubCommentDelete({ commentId, subReplies }) {
      const index = this.item.replies.findIndex((r) => r.id === commentId);
      if (index > -1) {
        this.item.replies.splice(index, 1);
        this.item.numberOf.replies = Math.max(
          0,
          this.item.numberOf.replies - 1 - subReplies,
        );

        this.question.numberOf.comments = Math.max(
          0,
          this.question.numberOf.comments - 1 - subReplies,
        );
        if (this.repliesOpen && this.item.replies.length === 0) {
          this.repliesOpen = false;
        }
        // update line
        this.socialStore.answerLineId = this.item.id;
      }
    },
    onEdit() {
      this.socialStore.answerTo = this.answer || this.question;
      this.socialStore.answerReplying = true;

      this.socialStore.commentEditData = {
        commentId: this.item.id,
        comment: this.item,
      };
    },
    handleChat({ item }) {
      if (this.authStore.logged) {
        this.$router.push(
          `${this.authStore.hub}/chat?${item.entityType === 'organization' ? 'orgId' : 'userId'}=${item.id}`,
        );
      } else {
        this.authStore.popup = true;
      }
      this.fluxesStore.storyPopup.state = false;
      this.fluxesStore.reelPopup.state = false;
      this.fluxesStore.reelPreview.visible = false;
    },
    async handleFollow(item) {
      const user = {
        ...item.owner,
        isFollowing: !item.isFollowing,
        entityType: item.type,
      };

      await this.profileStore.follow(user);
      this.$emit('follow', this.item.id);
    },
  },
};
</script>

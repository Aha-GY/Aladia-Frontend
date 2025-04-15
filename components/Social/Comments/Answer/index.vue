<template>
  <div class="mb-3 last:mb-0">
    <div ref="main" class="main-box">
      <div v-if="item.skeleton" class="relative">
        <div ref="skeleton" class="absolute left-0 top-0 h-12 w-12" />
        <SocialCommentsSkeleton />
      </div>
      <div v-else class="relative flex items-start gap-2">
        <div ref="image" class="z-10 h-12 w-12 rounded">
          <BaseAvatarNext
            :picture="item.owner.picture"
            :show-online="false"
            size="md"
            class="z-10 cursor-pointer rounded bg-transparent"
            :class="isReply ? 'is-reply' : 'is-answer'"
            data-cy="598cc9ba18d19bd0"
            @click="handleUserClick"
          />
        </div>
        <div class="w-0 flex-1">
          <div
            class="group relative inline-block min-h-[3rem] max-w-full rounded border p-2 text-13 transition-all duration-300"
            :class="{
              'border-white/50 bg-[#313131]': isReplying,
              'border-transparent bg-[#101010d] hover:border-white/50':
                !isReplying,
              'rounded-tr-none': isOwner,
            }"
          >
            <SocialCommentsAnswerHeader
              :item="item"
              @on-user-click="handleUserClick"
            />
            <SocialCommentsBubble
              :class="isReply ? 'reply' : 'answer'"
              :body="item.content"
            />
            <SocialCommentsAnswerBestAnswer
              v-if="isQuestion"
              :item="item"
              :is-owner="isOwner"
            />
            <div
              v-show="reactHover"
              class="absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.6)]"
            >
              <div
                class="h-full w-full opacity-0 backdrop-blur-sm transition-all duration-300"
                :class="reactHover ? 'opacity-100' : ''"
              />
            </div>
            <div v-if="reactions.allCount" class="group/item">
              <SocialCommentsAnswerReaction
                :item="item"
                :reactions="reactions"
                class="absolute -bottom-3 right-3 z-10 group-hover/item:translate-x-0.5"
              />
              <SocialCommentsAnswerReactionHover
                :item="item"
                :reactions="reactions"
                class="group-hover/item:max-h-40 group-hover/item:opacity-100"
              />
            </div>
          </div>
          <SocialCommentsAnswerAttachements :item="item" />
          <div class="flex items-center gap-4 px-2 text-sm">
            <div
              v-if="(!isQuestion && level !== 3) || !isReply"
              class="group relative flex h-7 w-10 cursor-pointer items-center justify-center gap-2 rounded leading-none transition-all active:scale-95"
              :class="
                repliesOpen
                  ? 'font-semibold text-[#F1F1F1]'
                  : 'font-normal text-[#707070] hover:font-semibold hover:text-[#F1F1F1]'
              "
              data-cy="6708db44a5b4e556"
              @click="onRepliesClick"
            >
              <img
                v-if="repliesOpen"
                src="~/assets/icons/replies-2.svg"
                class="h-3"
              />
              <img
                v-else
                src="~/assets/icons/replies-3.svg"
                class="h-3 opacity-50"
              />
              <i
                v-if="repliesOpen && repliesLoading"
                class="fa-solid fa-spinner animate-spin text-xs"
              />
              <div v-else>
                {{ numberOf?.replies }}
              </div>
              <div
                class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-0 transition-all group-hover:w-full"
                :class="repliesOpen ? 'w-full' : ''"
              />
            </div>
            <div
              v-if="(!isQuestion && level === 3) || (isQuestion && isReply)"
              class="group relative flex h-7 w-10 cursor-pointer items-center justify-center gap-2 leading-none text-[#707070] transition-all hover:text-[#F1F1F1] active:scale-95"
              data-cy="1658e6d65629e9bd"
              @click="onMentionClick"
            >
              {{ $t('flux.comment.tag') }}
              <div
                class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-0 transition-all group-hover:w-full"
              />
            </div>
            <div
              class="relative flex h-7 w-10 cursor-pointer items-center justify-center gap-2 rounded leading-none text-[#F1F1F1] transition-all duration-300"
              @mouseenter="reactHover = true"
              @mouseleave="reactHover = false"
            >
              {{ nowReact }}
              <div
                class="absolute -top-4 left-1/2 z-10 -translate-x-1/2 scale-0 opacity-0 transition-all duration-300"
                :class="
                  reactHover
                    ? '-translate-x-[4.8rem] -translate-y-8 scale-100 opacity-100'
                    : ''
                "
              >
                <SocialCommentsReaction
                  @on-mouseenter="onMouseenter"
                  @on-change="onChangeReact"
                />
              </div>
            </div>
            <div
              v-if="(!isQuestion && level !== 3) || !isReply"
              class="group relative flex h-7 w-10 cursor-pointer items-center justify-center gap-2 leading-none text-[#707070] transition-all hover:text-[#F1F1F1] active:scale-95"
              data-cy="04bc6669a2d22f52"
              @click="onReplyClick"
            >
              {{ $t('flux.comment.reply') }}
              <div
                class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-0 transition-all group-hover:w-full"
              />
            </div>
          </div>
          <div
            v-if="item.replies?.length && level !== 3 && repliesOpen"
            class="pt-3"
          >
            <SocialCommentsAnswer
              v-for="reply in item.replies"
              ref="replys"
              :key="reply?.id"
              :is-reply="true"
              :level="level + 1"
              :answer="item"
              :is-question="isQuestion"
              :answers="$refs.main"
              :item="reply"
              @on-get-scroll-top="onGetScrollTop"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isReply"
      ref="line"
      :class="showLine ? 'opacity-100' : 'opacity-0'"
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
    isQuestion: Boolean,
    level: Number,
    answer: Object,
    answers: Object,
    mains: Object,
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();
    return { authStore, socialStore, profileStore };
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
      return 'like';
    },
    nowReact() {
      return this.reactHover
        ? this.item.tempReact ||
            this.item.userReaction?.type ||
            this.defaultReact
        : this.item.userReaction?.type || this.defaultReact;
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
    reactionsCount() {
      return Object.values(this.item.numberOf.reactions).reduce(
        (sum, value) => sum + value,
        0,
      );
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
      $line.style.height = `${imageRect.top - mainRect.top + imageRect.height / 2 - 56}px`;
    },
    onReplyClick() {
      this.socialStore.answerTo = this.item;
      this.socialStore.answerReplying = true;
      this.onGetScrollTop();
      if (this.answers) {
        // this.answers.scrollTo({
        //   top: this.$refs.main.offsetTop,
        //   behavior: `smooth`,
        // });
      }
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
      // this.item.replies = this.item.replies.filter((r) => !r.skeleton);
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
      this.profileStore.gotoProfilePage(this.item.owner);
    },
  },
};
</script>

<template>
  <div
    ref="answers"
    class="flex-1 px-4 transition-all duration-300"
    :class="socialStore.answerReplying ? 'mb-10' : ''"
    @scroll="onScroll"
  >
    <PostsItemReact
      :item="postItem"
      class="pointer-events-none"
      data-cy="post-popup-reactions"
    />
    <PostsItemFooter
      :item="postItem"
      :is-popup="true"
      data-cy="post-popup-footer"
    />

    <div v-if="isShowSkeleton" class="relative px-3 pt-6">
      <PostsPopupSkeleton v-for="n in loadSkeletonNum" :key="n" />
    </div>

    <div ref="content" class="max-h-[10rem] overflow-y-auto pt-4">
      <PostsPopupAnswer
        v-for="item in answers"
        :key="item.id"
        :level="1"
        :answers="$refs.answers"
        :is-question="isQuestion"
        :item="item"
        @delete-comment="handleSubCommentDelete"
        @follow="handleFollow"
      />
    </div>
  </div>
</template>

<script>
import {
  _QUESTION_STATUS_NOTANSWER,
  _QUESTION_STATUS_ANSWERED,
} from '~/constant/social.js';

export default {
  props: {
    isQuestion: Boolean,
    isShowSkeleton: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const courseStore = useCourseStore();
    const socialStore = useSocialStore();
    return { courseStore, socialStore };
  },
  data() {
    return {
      loadSkeletonNum: 5,
    };
  },
  computed: {
    answers() {
      return this.socialStore.commentsData;
    },
    postItem() {
      return this.socialStore.postItem;
    },
    mentionItem() {
      return this.socialStore.mentionItem;
    },
  },
  watch: {
    'socialStore.answerSending'(key) {
      if (key) {
        const H = this.$refs.answers.offsetHeight;
        if (this.socialStore.answerscrollTop) {
          this.$refs.answers.scrollTo({
            top: this.socialStore.answerscrollTop - H / 4,
            behavior: `instant`,
          });
        } else {
          this.$refs.answers.scrollTo({
            top: this.$refs.content.offsetTop - H / 2,
            behavior: `instant`,
          });
        }
        this.socialStore.answerscrollTop = 0;
      }
    },
  },
  mounted() {
    this.initScroll();
  },
  methods: {
    onScroll() {
      this.courseStore.answerProfile = null;
    },
    async initScroll() {
      try {
        const height95Percent = window.innerHeight * 0.95;
        const skeletonLength = Math.ceil(
          (height95Percent +
            Math.abs(this.socialStore.offsetTop) -
            this.socialStore.offsetHeight) /
            116,
        );
        this.loadSkeletonNum =
          skeletonLength > (this.postItem?.numberOf?.comments || 0)
            ? this.postItem?.numberOf?.comments || 0
            : skeletonLength;

        await this.$nextTick();
        // this.$refs.answers.scrollTop = Math.abs(this.socialStore.offsetTop) + 4;
        this.$refs.answers.scrollTo({
          top: Math.abs(this.socialStore.offsetTop) + 24,
          behavior: `instant`,
        });
      } catch (error) {
        console.log('error', error);
      }
    },
    handleSubCommentDelete({ commentId, subReplies }) {
      const index = this.socialStore.commentsData.findIndex(
        (r) => r.id === commentId,
      );
      if (index > -1) {
        this.socialStore.commentsData.splice(index, 1);
        this.postItem.numberOf.comments = Math.max(
          0,
          this.postItem.numberOf.comments - 1 - subReplies,
        );
      }
      if (
        this.postItem.numberOf.comments === 0 &&
        this.postItem.type === 'question' &&
        this.postItem.status === _QUESTION_STATUS_ANSWERED
      ) {
        this.socialStore.postItem.status = _QUESTION_STATUS_NOTANSWER;
      }
    },
    handleFollow(id) {
      const comment = this.socialStore.commentsData.find((r) => r.id === id);

      if (comment) {
        comment.isFollowing = !comment.isFollowing;
      }
    },
  },
};
</script>

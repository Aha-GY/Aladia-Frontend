<template>
  <div
    ref="answers"
    class="flex-1 overflow-y-auto transition-all duration-300"
    :class="socialStore.answerReplying ? 'mb-10' : ''"
    @scroll="onScroll"
  >
    <div v-if="isShowSkeleton" class="relative pt-6">
      <SocialCommentSkeleton v-for="n in loadSkeletonNum" :key="n" />
    </div>

    <div ref="content" class="overflow-hidden !p-0">
      <SocialCommentAnswer
        v-for="item in answers"
        :key="item.id"
        :level="1"
        :answers="$refs.answers"
        :item="item"
        :type="type"
        @delete-comment="handleSubCommentDelete"
        @follow="handleFollow"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShowSkeleton: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
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

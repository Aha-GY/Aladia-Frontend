<template>
  <div
    ref="answers"
    class="mb-2 flex-1 overflow-y-auto"
    :class="[
      isQuestion ? 'h-0 pl-48 pr-3 pt-8' : '',
      socialStore.answerReplying ? 'mb-10' : 'mb-2',
    ]"
    @scroll="onScroll"
  >
    <!-- <SocialItem :item="{ id: '1', type: 0 }" v-if="!isQuestion" :popup="true" /> -->
    <div v-if="!isQuestion">
      <SocialItemContent :item="postItem" />
      <div class="overflow-hidden rounded">
        <div v-for="img in postItem.files || []" :key="img.fileId">
          <video
            v-if="img?.metadata?.mimetype === 'video/mp4'"
            :src="img.url"
            controls
            class="m-auto h-full object-cover"
          />
          <img
            v-else
            :src="img.url"
            class="m-auto h-full object-cover"
            alt=""
          />
        </div>
      </div>
      <SocialItemReactItem :item="postItem" class="pointer-events-none" />

      <SocialItemFooter :item="postItem" class="pointer-events-none" />
    </div>

    <div v-if="isShowSkeleton" class="relative px-3 pt-6">
      <SocialCommentsSkeleton v-for="n in loadSkeletonNum" :key="n" />
    </div>

    <div ref="content" :class="isQuestion ? '' : 'px-3 pt-6'">
      <SocialCommentsAnswer
        v-for="item in answers"
        :key="item.id"
        :level="1"
        :answers="$refs.answers"
        :is-question="isQuestion"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
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
      loadSkeletonNum: 2,
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
    if (!this.isQuestion) {
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

      this.$nextTick(() => {
        // this.$refs.answers.scrollTo = Math.abs(this.socialStore.offsetTop) + 4;
        this.$refs.answers.scrollTo({
          top: Math.abs(this.socialStore.offsetTop) + 24,
          behavior: `instant`,
        });
      });
    }
  },
  methods: {
    onScroll() {
      this.courseStore.answerProfile = null;
    },
  },
};
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 top-0 z-[90] flex h-full w-full items-center justify-center bg-black/20 text-white backdrop-blur"
    @mousedown.self="onCloseClick"
  >
    <div
      class="relative -mt-20 flex max-h-[95%] w-[70%] flex-col rounded-md border border-white/10 bg-black px-8 pb-3 pt-4 opacity-0 backdrop-blur transition-all duration-300"
      :style="animation ? { marginTop: 0, opacity: 1 } : null"
    >
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-4 text-lg font-bold">
          {{ $t('post.whose', { name: user.firstName, Lname: user.lastName }) }}
        </div>
        <div
          class="group flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-white/10 bg-black text-lg transition-all hover:border-white/20 active:scale-95"
          data-cy="aecb00e122ef0b10"
          @click="socialStore.questionPopup = false"
        >
          <i class="fa-solid fa-xmark" />
        </div>
      </div>
      <div
        v-loading="loading"
        class="relative flex h-[85vh] flex-col justify-between"
      >
        <client-only>
          <SocialCommentsQuestion />
          <div
            class="absolute left-0 right-0 top-40 z-0 flex flex-col"
            :style="{ height: `calc(100% - 10rem)` }"
          >
            <SocialCommentsAnswers :is-question="true" />
            <SocialCommentsInput v-if="!inputSkeleton" />
            <SocialCommentsInputSkeleton v-if="inputSkeleton" />
          </div>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  data() {
    return {
      animation: false,
      inputSkeleton: true,
    };
  },
  computed: {
    postItem() {
      return this.socialStore.postItem;
    },
    user() {
      return this.postItem.owner;
    },
    loading() {
      return this.socialStore.commentsLoading;
    },
  },
  mounted() {
    setTimeout(() => {
      this.animation = true;
    }, 100);
    this.socialStore.commentsData = [];
    this.socialStore.commentsLoading = true;
    this.socialStore.getComments().then(() => {
      this.socialStore.commentsLoading = false;
      this.inputSkeleton = false;
      this.$nextTick(() => {
        this.socialStore.answerReplying = true;
      });
    });
  },
  beforeUnmount() {
    this.socialStore.answerReplying = false;
  },
  methods: {
    onCloseClick(event) {
      if (event.button !== 0 || this.loading) {
        return;
      }
      this.socialStore.questionPopup = false;
    },
  },
};
</script>

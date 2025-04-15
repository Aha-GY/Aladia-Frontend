<template>
  <div
    class="fixed bottom-0 left-0 right-0 top-0 z-[90] flex h-full w-full items-center justify-center bg-black/20 text-white backdrop-blur"
    @mousedown.self="onCloseClick"
  >
    <div
      class="relative max-h-[95%] w-[43rem] rounded border border-[#565656] bg-black backdrop-blur transition-all md:ml-16"
      :class="animation ? 'opacity-100' : 'opacity-0'"
    >
      <SocialItemHeader :item="postItem">
        <template #reply>
          <div
            class="group relative ml-3 cursor-pointer text-[#707070] transition-all hover:text-[#F1F1F1] active:scale-95"
            data-cy="4642975a43076e30"
            @click="onReplyClick"
          >
            {{ $t('flux.comment.reply') }}
            <div
              class="bg-gradient-top absolute -bottom-1 left-0 h-[1px] w-0 transition-all group-hover:w-full"
            />
          </div>
        </template>
        <div
          class="group absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded border border-[#565656]/20 bg-[#070707] p-2 shadow-[0px_4px_4px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white active:scale-95"
          data-cy="d7cd8c016086b9be"
          @click="socialStore.commentsPopup = false"
        >
          <img
            src="~/assets/social/option-close.svg"
            class="h-3 w-3 transition-all duration-300 group-hover:rotate-90 group-hover:scale-125"
            alt=""
          />
        </div>
      </SocialItemHeader>
      <client-only>
        <div class="flex flex-col" :style="{ height: `calc(95vh - 4.25rem)` }">
          <SocialCommentsAnswers :is-show-skeleton="inputSkeleton" />
          <!-- <SocialCommentsInput v-if="!inputSkeleton" /> -->
          <SocialCommentsInputSkeleton v-if="inputSkeleton" />
        </div>
      </client-only>
      <SocialItemReactPopup v-if="socialStore.reactId === postItem.id" />
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
    onReplyClick() {
      this.socialStore.answerTo = this.postItem;
      this.socialStore.answerReplying = true;
    },
    onCloseClick(event) {
      if (event.button !== 0 || this.socialStore.commentsLoading) {
        return;
      }
      this.socialStore.commentsPopup = false;
    },
  },
};
</script>

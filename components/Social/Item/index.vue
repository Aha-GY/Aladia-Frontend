<template>
  <div
    ref="main"
    class="rounded border-b border-[#f1f1f1]/10 bg-black shadow-[0px_4px_4px_rgba(0,0,0,0.7)] backdrop-blur-lg"
  >
    <SocialItemHeader :item="item">
      <div
        v-if="item.type === 'question'"
        class="absolute right-4 top-1/2 h-11 w-11 -translate-y-1/2"
      >
        <img
          v-if="item.status === 'solved'"
          src="~/assets/social/success.png"
          class="object-contain"
          alt=""
        />
        <img
          v-else
          src="~/assets/social/fail.png"
          class="object-contain"
          alt=""
        />
      </div>
    </SocialItemHeader>
    <SocialItemContent :item="item" />

    <div class="overflow-hidden rounded">
      <div v-for="img in item.files || []" :key="img.id">
        <video
          v-if="img?.metadata?.mimetype === 'video/mp4'"
          ref="video"
          :src="img.url"
          muted
          controls
          class="m-auto h-full object-cover"
          @canplay="observeVideo"
        />
        <img v-else :src="img.url" class="m-auto h-full object-cover" alt="" />
      </div>
    </div>

    <!-- <div class="flex gap-2" v-else>
      <div>
        <img src="~/assets/social/img1.png" class="object-contain" alt="" />
      </div>
      <div>
        <img src="~/assets/social/img2.png" class="object-contain" alt="" />
      </div>
      <div class="h-48 overflow-hidden">
        <img src="~/assets/social/img3.png" class="h-full" alt="" />
      </div>
    </div> -->

    <SocialItemReactItem
      :item="item"
      @on-comment-click="handleReactItemCommentClick"
    />

    <SocialItemFooter :item="item">
      <div
        v-if="item.type === 'question' && item.status === 'solved'"
        class="flex cursor-pointer items-center transition-all active:scale-95"
        :class="commentHover ? 'underline underline-offset-2' : ''"
        data-cy="b9a7cdc61131a822"
        @click="onQuestion"
        @mouseenter="commentHover = true"
        @mouseleave="commentHover = false"
      >
        <div
          class="mr-1 flex h-[1.875rem] w-[1.875rem] items-center justify-center transition-all duration-300"
          :style="{
            background: `url(${
              commentHover ? solutionHover : solution
            }) center no-repeat`,
          }"
        />
        {{ $t('post.question.solved') }}
      </div>
      <div
        v-if="item.type === 'question' && item.status !== 'solved'"
        class="relative flex w-28 cursor-pointer items-center transition-all active:scale-95"
        :class="commentHover ? 'font-semibold' : ''"
        data-cy="e003d58efa60f251"
        @click="onQuestion"
        @mouseenter="commentHover = true"
        @mouseleave="commentHover = false"
      >
        <div
          class="mr-1 flex h-6 w-6 items-center justify-center transition-all duration-300"
          :style="{
            background: `url(${
              commentHover ? solveHover : solve
            }) center no-repeat`,
          }"
        />
        <div
          class="absolute -bottom-0.5 left-[0.7rem] w-0 transition-all duration-500"
          :class="commentHover ? 'w-[5.5rem]' : ''"
        >
          <img src="~/assets/social/solve-vector.svg" alt="" />
        </div>
        {{ $t('post.question.try') }}
      </div>
      <div
        v-if="item.type === 'post'"
        class="group flex cursor-pointer items-center transition-all active:scale-95"
        data-cy="75cfbdb8be47d657"
        @click="onComments"
      >
        <img
          src="~/assets/social/Comments.svg"
          class="mr-4 block transition-all group-hover:hidden"
          alt=""
        />
        <img
          src="~/assets/social/Comments-hover.svg"
          class="mr-4 hidden transition-all group-hover:block"
          alt=""
        />
        <div class="underline-offset-2 transition-all group-hover:underline">
          {{ $t('flux.comment.plural') }}
        </div>
      </div>
    </SocialItemFooter>

    <SocialItemBorder :color="getColor" />
    <SocialItemReactPopup v-if="socialStore.reactId === item.id" :item="item" />
  </div>
</template>

<script>
import solutionHover from '~/assets/social/solution-hover.svg';
import solution from '~/assets/social/solution.svg';
import solveHover from '~/assets/social/solve-hover.svg';
import solve from '~/assets/social/solve.svg';

export default {
  props: {
    item: Object,
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const courseStore = useCourseStore();
    return { courseStore, socialStore, authStore };
  },
  data() {
    return {
      commentHover: false,
      itemHover: false,
    };
  },
  computed: {
    getColor() {
      return this.item.type === 'question'
        ? this.item.status === 'solved'
          ? '#00CA00'
          : '#c90000'
        : '#f1f1f1';
    },
    solution() {
      return solution;
    },
    solutionHover() {
      return solutionHover;
    },
    solve() {
      return solve;
    },
    solveHover() {
      return solveHover;
    },
  },
  methods: {
    onComments() {
      const $main = this.$refs.main;
      const mainRect = $main.getBoundingClientRect();
      this.socialStore.offsetTop = mainRect.top;
      this.socialStore.offsetHeight = mainRect.height;
      this.socialStore.commentsPopup = true;
      this.socialStore.postItem = this.item;
    },
    onQuestion() {
      this.socialStore.questionPopup = true;
      this.socialStore.postItem = this.item;
    },
    observeVideo(event) {
      const video = event.target;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play();
            } else {
              video.pause();
            }
          });
        },
        {
          threshold: 0.5, // 50% 可见时触发
        },
      );
      observer.observe(video);
    },
    handleReactItemCommentClick() {
      switch (this.item.type) {
        case 'question':
          this.onQuestion();
          break;
        case 'post':
          this.onComments();
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
.solve-move {
  background: url(~/assets/social/solve-move1.svg) center no-repeat !important;
  animation: move 1s linear infinite alternate;
}
@keyframes move {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(60deg);
  }
}
</style>

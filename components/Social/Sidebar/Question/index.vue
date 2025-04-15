<template>
  <div>
    <div
      class="group relative mb-4 flex h-12 cursor-pointer items-center justify-center rounded bg-black/60 transition-all active:scale-95"
      :class="isQuestionHover ? 'border-anim' : ''"
      data-cy="1402cd15f2461a5f"
      @mouseenter="isQuestionHover = true"
      @mouseleave="isQuestionHover = false"
      @click.stop="onQuestion"
    >
      <div
        class="absolute left-[4.5rem] top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center"
      >
        <img
          :src="isQuestionHover ? QuestionHover : Question"
          class="h-4 w-4 transition-all"
          alt=""
        />
      </div>
      <div class="text-sm transition-all group-hover:font-semibold">
        {{ $t('course.question.make') }}
      </div>
      <div
        class="pointer-events-none absolute left-0 top-0 z-10 h-full w-full rounded-tl border-l border-t border-[#f1f1f1]/80"
        :class="isQuestionHover ? 'opacity-0' : 'opacity-100'"
      >
        <div
          class="absolute -top-[1px] right-0 h-[1px] w-2/3 bg-gradient-to-r from-transparent to-black"
        />
        <div
          class="absolute -left-[1px] bottom-0 h-full w-[1px] bg-gradient-to-b from-transparent to-black"
        />
      </div>
    </div>

    <div class="relative mb-5 rounded bg-black/60 px-4 py-3">
      <div class="mb-2 flex items-center justify-between text-xs">
        <div class="flex">
          <img src="~/assets/social/success.png" class="mr-3 h-5" alt="" />
          <div
            class="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-gradient-to-r after:from-[#03D80B] after:to-transparent after:transition-all"
            :class="solvedKey ? '' : 'after:opacity-0'"
          >
            {{ $t('course.question.solved') }}
          </div>
        </div>

        <div
          class="relative h-4 w-8 cursor-pointer rounded-full shadow-[0px_4px_4px_rgba(23,23,23,0.7),inset_1px_1px_1px_0px_rgba(0,0,0,0.25)] transition-all active:scale-95"
          :class="
            solvedKey
              ? 'filter-bg-action'
              : 'filter-bg border border-[#f1f1f1]/40'
          "
          data-cy="b9aba29733db6fe2"
          @click="onSolved"
        >
          <img
            src="~/assets/social/sidebar/Selector.svg"
            class="absolute left-0.5 top-1/2 h-3 w-3 -translate-y-1/2 select-none overflow-hidden rounded-full transition-all duration-300"
            :class="solvedKey ? 'translate-x-4' : ''"
            alt=""
          />
        </div>
      </div>
      <div class="flex items-center justify-between text-xs">
        <div class="flex">
          <img src="~/assets/social/fail.png" class="mr-3 h-5" alt="" />
          <div
            class="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-gradient-to-r after:from-[#F00] after:to-transparent after:transition-all"
            :class="unsolvedKey ? '' : 'after:opacity-0'"
          >
            {{ $t('course.question.unSolved') }}
          </div>
        </div>

        <div
          class="relative h-4 w-8 cursor-pointer rounded-full shadow-[0px_4px_4px_rgba(23,23,23,0.7),inset_1px_1px_1px_0px_rgba(0,0,0,0.25)] transition-all active:scale-95"
          :class="
            unsolvedKey
              ? 'filter-bg-action'
              : 'filter-bg border border-[#f1f1f1]/40'
          "
          data-cy="e9b0458e50e0c048"
          @click="onUnsolved"
        >
          <img
            src="~/assets/social/sidebar/Selector.svg"
            class="absolute left-0.5 top-1/2 h-3 w-3 -translate-y-1/2 select-none overflow-hidden rounded-full transition-all duration-300"
            :class="unsolvedKey ? 'translate-x-4' : ''"
            alt=""
          />
        </div>
      </div>
      <div
        class="pointer-events-none absolute left-0 top-0 z-20 h-full w-full rounded-tl border-l border-t border-[#f1f1f1]/80"
      >
        <div
          class="absolute -top-[1px] right-0 h-[1px] w-2/3 bg-gradient-to-r from-transparent to-black"
        />
        <div
          class="absolute -left-[1px] bottom-0 h-full w-[1px] bg-gradient-to-b from-transparent to-black"
        />
      </div>
    </div>

    <div
      class="relative rounded border border-[#f1f1f1]/40 bg-black/60 shadow-[0px_4px_4px_rgba(0,0,0,0.6)]"
    >
      <div class="relative flex items-center text-xs text-[#707070]">
        <div
          class="group relative flex h-11 flex-1 cursor-pointer items-center justify-center overflow-hidden transition-all active:scale-95"
          :class="tabIndex === 0 ? 'text-sm font-semibold text-white' : ''"
          data-cy="dccbb4c35757fe43"
          @click="tabIndex = 0"
        >
          {{ $t('category.top.users') }}
          <div
            class="absolute -bottom-5 left-1/2 z-10 h-5 w-2/3 -translate-x-1/2 rounded-[50%/50%] bg-black opacity-0 shadow-[0px_6px_25px_rgba(255,255,255,0.6)] transition-all duration-300 group-hover:opacity-100"
          />
        </div>
        <div
          class="group relative flex h-11 flex-1 cursor-pointer items-center justify-center overflow-hidden transition-all active:scale-95"
          :class="tabIndex === 1 ? 'text-sm font-semibold text-white' : ''"
          data-cy="b44c1107fccd1223"
          @click="tabIndex = 1"
        >
          {{ $t('category.top.label') }}
          <div
            class="absolute -bottom-5 left-1/2 z-10 h-5 w-2/3 -translate-x-1/2 rounded-[50%/50%] bg-black opacity-0 shadow-[0px_6px_25px_rgba(255,255,255,0.6)] transition-all duration-300 group-hover:opacity-100"
          />
        </div>
        <div
          class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-1/2 transition-all duration-300"
          :style="{ transform: `translateX(${100 * tabIndex}%)` }"
        />
      </div>
      <div class="h-2" />
      <SocialSidebarQuestionUsers v-if="tabIndex === 0" />
      <SocialSidebarQuestionCategory v-if="tabIndex === 1" />

      <div
        class="pointer-events-none absolute -left-[1px] -top-[1px] z-20 h-1/2 w-3/4 rounded-tl border-l border-t border-[#f1f1f1]"
      >
        <div
          class="absolute -top-[1px] right-0 h-[1px] w-2/3 bg-gradient-to-r from-transparent to-black/60"
        />
        <div
          class="absolute -left-[1px] bottom-0 h-2/3 w-[1px] bg-gradient-to-b from-transparent to-black/60"
        />
      </div>
    </div>
  </div>
</template>
<script>
import QuestionHover from '~/assets/social/sidebar/Question-hover.svg';
import Question from '~/assets/social/sidebar/Question.svg';

export default {
  setup() {
    const searchStore = useSearchStore();
    const socialStore = useSocialStore();
    return { socialStore, searchStore };
  },
  data() {
    return {
      solvedKey: true,
      unsolvedKey: true,
      tabIndex: 0,
      isQuestionHover: false,
    };
  },
  computed: {
    Question() {
      return Question;
    },
    QuestionHover() {
      return QuestionHover;
    },
  },
  methods: {
    onSolved() {
      if (!this.solvedKey) {
        this.solvedKey = true;
      } else if (this.unsolvedKey) {
        this.solvedKey = false;
      } else if (!this.unsolvedKey) {
        this.solvedKey = false;
        this.unsolvedKey = true;
      }
    },
    onUnsolved() {
      if (!this.unsolvedKey) {
        this.unsolvedKey = true;
      } else if (this.solvedKey) {
        this.unsolvedKey = false;
      } else if (!this.solvedKey) {
        this.unsolvedKey = false;
        this.solvedKey = true;
      }
    },
    onQuestion() {
      this.searchStore.isFocus = true;
      this.searchStore.type = 'question';
    },
  },
};
</script>

<style scoped>
.filter-bg {
  background: linear-gradient(93deg, #000 17.86%, #000 100%);
}
.filter-bg-action {
  background: linear-gradient(93deg, #d0d40d 17.86%, rgba(0, 0, 0, 0) 95%);
}
.bg-gradient-top-success {
  background: linear-gradient(to right, #03d80b 20%, rgba(0, 0, 0, 0) 90%);
}
.bg-gradient-top-fail {
  background: linear-gradient(0deg, #f00 0%, rgba(0, 0, 0, 0) 70%);
}
</style>

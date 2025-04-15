<template>
  <div>
    <div class="mb-4 flex justify-between gap-4">
      <div
        class="group relative flex h-12 flex-1 cursor-pointer items-center justify-center bg-black transition-all active:scale-95"
        :class="isQuestionHover ? 'border-anim' : ''"
        data-cy="23dcc2af2e32475b"
        @mouseenter="isQuestionHover = true"
        @mouseleave="isQuestionHover = false"
        @click.stop="onQuestion"
      >
        <div
          class="absolute left-[1.5rem] top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center"
        >
          <img
            :src="isQuestionHover ? QuestionHover : Question"
            class="h-3 w-3 transition-all"
            :class="isQuestionHover ? 'h-4 w-4' : 'h-3 w-3'"
            alt=""
          />
        </div>

        <div class="text-xs transition-all group-hover:font-semibold">
          {{ $t('post.question.label') }}
        </div>
        <div
          class="pointer-events-none absolute left-0 top-0 z-20 h-full w-full rounded-tl border-l border-t border-[#f1f1f1]/80 transition-all"
          :class="isQuestionHover ? 'opacity-0' : 'opacity-100'"
        >
          <div
            class="absolute -top-[1px] right-0 h-[1px] w-2/3 bg-gradient-to-r from-transparent to-black"
          />
          <div
            class="absolute -left-[1px] bottom-0 h-2/3 w-[1px] bg-gradient-to-b from-transparent to-black"
          />
        </div>
      </div>
      <div
        class="group relative flex h-12 flex-1 cursor-pointer items-center justify-center bg-black transition-all active:scale-95"
        :class="isPostHover ? 'border-anim' : ''"
        data-cy="3553bf4be7dfc3c1"
        @mouseenter="isPostHover = true"
        @mouseleave="isPostHover = false"
        @click.stop="onSocial"
      >
        <div
          class="absolute left-[2.5rem] top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center"
        >
          <img
            src="~/assets/social/sidebar/Add.svg"
            class="h-3 w-3 transition-all group-hover:h-4 group-hover:w-4"
            alt=""
          />
        </div>
        <div class="text-xs transition-all group-hover:font-semibold">Post</div>
        <div
          class="pointer-events-none absolute left-0 top-0 z-20 h-full w-full rounded-br border-b border-r border-[#f1f1f1]/80"
          :class="isPostHover ? 'opacity-0' : 'opacity-100'"
        >
          <div
            class="absolute -bottom-[1px] left-0 h-[1px] w-2/3 bg-gradient-to-l from-transparent to-black"
          />
          <div
            class="absolute -right-[1px] top-0 h-2/3 w-[1px] bg-gradient-to-t from-transparent to-black"
          />
        </div>
      </div>
    </div>

    <div
      class="relative rounded border border-[#f1f1f1]/40 bg-black/60 shadow-[0px_4px_4px_rgba(0,0,0,0.6)]"
    >
      <div class="flex h-11 items-center px-4">
        <div class="relative h-6 text-sm font-semibold">
          {{ $t('base.member.followers') }}
          <div
            class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-full"
          />
        </div>
      </div>

      <div class="hide-scrollbar h-[13.5rem] overflow-y-auto px-4 pt-1">
        <div
          v-for="item in Followers"
          :key="item"
          class="group relative mb-2 flex cursor-pointer items-center rounded px-2 py-1.5 text-xs transition-all duration-300 hover:bg-[#181818]"
        >
          <div class="relative mr-5 h-6 w-6 rounded bg-white">
            <img
              src="~/assets/social/sidebar/Satus.svg"
              class="absolute bottom-0 right-0 h-2 w-2"
              alt=""
            />
          </div>
          <div class="underline-offset-4 group-hover:underline">
            Zain Korsgaard
          </div>
          <div
            class="group/item absolute right-1.5 top-1/2 flex h-[1.625rem] w-[7.25rem] -translate-y-1/2 items-center justify-center rounded bg-[#B39600] text-xs text-white opacity-0 shadow-[0px_4px_4px_rgba(0,0,0,0.6)] group-hover/item:font-semibold group-hover:opacity-100"
            data-cy="733cfc3e17d53fb5"
            @click="onGoProfile"
          >
            <i class="fa-solid fa-chevron-right" />
            {{ $t('personal.profile.go') }}
          </div>
        </div>
      </div>

      <div
        class="bg-task absolute bottom-[1px] left-0 h-3 w-full shadow-[0px_4px_4px_rgba(0,0,0,0.6)]"
      />

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

    <div
      class="relative mt-4 rounded border border-[#f1f1f1]/40 bg-black/60 shadow-[0px_4px_4px_rgba(0,0,0,0.6)]"
    >
      <div
        class="relative flex h-11 items-center justify-center px-4 text-sm font-semibold"
      >
        {{ $t('category.top.users') }}
        <div
          class="bg-gradient-top absolute bottom-0 left-1/2 h-[1px] w-[9.75rem] -translate-x-1/2"
        />
      </div>

      <div class="relative min-h-[16rem] pt-1 text-xs">
        <div class="mb-1 text-center text-xs text-[rgba(112,112,112,0.47)]">
          {{ $t('category.contribute.users') }}
        </div>

        <div class="relative mb-5 overflow-hidden">
          <SocialSidebarDate class="mb-6" />

          <SocialSidebarRank :data="rankList" />

          <div
            class="absolute bottom-0 left-1/2 h-[23rem] w-[41rem] -translate-x-1/2 overflow-hidden rounded-[50%] bg-[#0C0C0C]"
          >
            <div
              class="absolute bottom-[1px] left-0 h-full w-full rounded-[50%] border border-[#f1f1f1]/40"
            />
            <div
              class="absolute bottom-0 left-1/2 z-10 h-8 w-[10rem] bg-gradient-to-r from-transparent to-[#0C0C0C]"
            />
            <div
              class="absolute bottom-0 right-1/2 z-10 h-8 w-[10rem] bg-gradient-to-l from-transparent to-[#0C0C0C]"
            />
          </div>
        </div>
        <div
          class="bg-gradient-top absolute bottom-0 left-1/2 h-[1px] w-full -translate-x-1/2"
        />
      </div>

      <div
        class="flex items-center justify-between pb-4 pl-4 pr-6 pt-2 text-xs text-[#707070]"
      >
        <div class="flex items-center">
          <div class="mr-2">137</div>
          <img
            src="~/assets/social/sidebar/rank2.png"
            class="mr-3 h-8 w-8 rounded"
            alt=""
          />
          <div class="text-[#f1f1f1]">You</div>
        </div>
        <div>1</div>
      </div>

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
      rankList: [
        {
          firstName: 'Bator',
          lastName: 'Emerson',
          number: 124,
          isQuestion: false,
        },
        {
          firstName: 'Calzoni',
          lastName: 'Jordyn',
          number: 126,
          isQuestion: false,
        },
        {
          firstName: 'Culhane',
          lastName: 'Phillip',
          number: 125,
          isQuestion: false,
        },
      ],
      isQuestionHover: false,
      isPostHover: false,
      Followers: [1, 2, 3, 4, 5, 6, 7],
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
    onQuestion() {
      this.searchStore.isFocus = true;
      this.searchStore.type = 'question';
    },
    onSocial() {
      this.searchStore.isFocus = true;
      this.searchStore.type = 'social';
    },
    onGoProfile() {
      this.$router.push('/profile');
    },
  },
};
</script>
<style scoped>
.bg-task {
  background: linear-gradient(0deg, #060606 65.62%, rgba(6, 6, 6, 0) 100%);
}
</style>

<template>
  <div
    class="group/edit pointer-events-none absolute -right-[1px] h-8 cursor-pointer pb-1 transition-all duration-200 group-hover:pointer-events-auto group-hover:-top-8 group-hover:opacity-100"
    :class="{
      '-top-8 opacity-100': loading,
      'top-0 opacity-0': !loading,
      'pointer-events-none hidden': !isBestAnswer && !isOwner,
    }"
    data-cy="6f30a155413ffa82"
    @click="onClick"
  >
    <div
      class="flex h-full w-full items-center gap-2 rounded rounded-br-none border px-2 py-1"
      :class="
        isBestAnswer
          ? 'border-[#295d1b] bg-[#4ca433]'
          : 'border-transparent bg-[#101010]'
      "
    >
      <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
      <div
        v-else
        class="flex h-4 w-4 items-center justify-center rounded border transition-all"
        :class="
          isBestAnswer
            ? 'border-white bg-white shadow'
            : 'border-white/50 group-hover/edit:border-white'
        "
      >
        <i v-if="isBestAnswer" class="fa-solid fa-check text-[#295d1b]" />
      </div>
      <div>
        {{ $t('post.answer.best') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    isOwner: Boolean,
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    return { authStore, socialStore };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    question() {
      return this.socialStore.postItem;
    },
    answers() {
      return this.socialStore.commentsData;
    },
    qa() {
      return this.courseStore.qa.data || [];
    },
    isBestAnswer() {
      return this.question.answerId === this.item.id;
    },
  },
  methods: {
    async onClick() {
      if (this.loading) {
        return;
      }
      if (!this.isOwner) {
        return;
      }
      /*
       *  NOT ANSWERED -> Trigger: Question posted
       *  ANSWERED -> Trigger: a comment in the question
       *  SOLVED -> Trigger: owner put a comment as the "best Answer"
       */
      try {
        this.loading = true;
        await this.socialStore.solveAnswer({
          id: this.question.id,
          answerId: this.item.id,
        });
        this.loading = false;

        await this.$nextTick();
        this.question.status = 'solved';
        this.question.answerId = this.item.id;
      } catch (error) {
        this.loading = false;
      }
    },
  },
};
</script>

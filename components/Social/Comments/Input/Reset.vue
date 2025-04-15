<template>
  <div
    v-show="socialStore.answerReplying && socialStore.answer.body"
    class="absolute right-[0.85rem] top-2 z-30"
  >
    <span
      class="cursor-pointer text-base text-white/50 transition-all hover:text-white active:scale-95"
      data-cy="39e14bd451d020d5"
      @click.stop="onClose"
    >
      <i class="fa-regular fa-xmark" />
    </span>
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  methods: {
    onClose() {
      this.socialStore.answer = {
        title: '',
        body: '',
      };
    },
  },
};
</script>

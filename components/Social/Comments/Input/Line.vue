<template>
  <div
    class="bg-gradient-top w-full opacity-50 transition-all duration-300"
    :class="socialStore.answerReplying ? 'mb-2 h-[1px]' : 'mb-0 h-0'"
  />
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
};
</script>

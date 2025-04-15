<template>
  <div
    class="pointer-events-none absolute left-0 right-0 top-0 h-1/2 w-full rounded-t border-l border-r border-t transition-all duration-300"
    :class="
      socialStore.answerReplying
        ? 'border-[#888] opacity-100'
        : 'border-white/0 opacity-0'
    "
  >
    <div
      class="absolute -left-[1px] top-2 h-full w-[1px] bg-gradient-to-t from-black to-[#888]"
    />
    <div
      class="absolute -right-[1px] top-2 h-full w-[1px] bg-gradient-to-t from-black to-[#888]"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
};
</script>

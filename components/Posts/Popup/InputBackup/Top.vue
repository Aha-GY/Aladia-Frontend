<template>
  <div
    class="absolute -top-10 left-0 z-20 flex h-8 items-center gap-2 bg-black transition-all duration-300"
    :class="
      socialStore.answerReplying
        ? 'opacity-100'
        : 'pointer-events-none top-0 opacity-0'
    "
  >
    <div
      class="group flex h-8 w-8 items-center justify-center rounded border border-white/30 bg-black shadow-[0px_3px_6px_#000000] transition-all active:scale-95"
      data-cy="5bcea465118c9f61"
      @click="socialStore.answerCollapse = !socialStore.answerCollapse"
    >
      <span
        class="cursor-pointer text-xl text-white/50 transition-all duration-300 group-hover:scale-110 group-hover:text-white"
        :class="socialStore.answerCollapse ? 'rotate-180' : 'rotate-0'"
      >
        <i class="fa-solid fa-chevron-up text-[#f1f1f1]" />
      </span>
    </div>
    <span>
      {{ $t('meet.chat.reply') }}
    </span>
    <div class="flex items-center gap-2 rounded-[6.25rem] bg-white/5 p-2">
      <div class="relative h-7 w-7">
        <BaseAvatarNext
          :picture="answerToUser?.picture"
          :round="true"
          :online="answerToUser?.online"
          size="sm"
          class="border-[1px] border-white/5 !bg-transparent"
        />
      </div>
      <span class="pr-2 font-light text-[#D4D4D4]">
        {{ answerToUser?.name }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  computed: {
    answerTo() {
      return this.socialStore.answerTo;
    },
    answerToUser() {
      return this.answerTo?.owner || {};
    },
  },
};
</script>

<template>
  <div
    class="absolute -top-12 left-0 z-20 flex items-center gap-2 transition-all duration-300"
    :class="
      socialStore.answerReplying
        ? 'opacity-100'
        : 'pointer-events-none !top-0 z-0 opacity-0'
    "
  >
    <span class="pl-11 text-xs font-medium text-[#707070]">
      {{ $t('meet.chat.reply') }}
    </span>
    <div class="flex items-center gap-2 rounded-[6.25rem] bg-[#0d0d0d] p-1">
      <div class="relative">
        <BaseAvatarNext
          :picture="answerToUser?.picture"
          :round="true"
          :show-story="false"
          :online="answerToUser?.online"
          size="sm"
        />
      </div>

      <span class="max-w-80 truncate pr-2 font-light text-[#D4D4D4]">
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

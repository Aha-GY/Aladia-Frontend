<template>
  <div
    class="absolute -top-12 left-0 right-0 z-20 flex flex-wrap items-center gap-1 rounded-[6.25rem] transition-all duration-300"
    :class="
      socialStore.answerReplying
        ? 'opacity-100'
        : 'pointer-events-none top-0 z-0 opacity-0'
    "
  >
    <span
      class="flex-shrink-0 pl-1 text-center text-[0.625rem] font-medium text-[#707070] 2xl:text-xs"
    >
      {{
        socialStore.isReplay
          ? $t('flux.comment.replyTo')
          : $t('flux.comment.addC')
      }}
    </span>
    <div
      class="flex min-w-0 items-center gap-1 rounded-[6.25rem] bg-[#100E0c] p-1 px-[0.375rem]"
    >
      <div class="relative">
        <BaseAvatarNext
          :picture="answerToUser?.picture"
          :round="true"
          :online="answerToUser?.online"
          size="sm"
        />
      </div>

      <span
        class="w-auto overflow-hidden text-ellipsis whitespace-nowrap pr-2 text-center text-sm font-normal leading-6 text-[#D4D4D4] xl:w-auto"
        :title="answerToUser?.name"
      >
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

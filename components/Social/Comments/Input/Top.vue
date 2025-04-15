<template>
  <div
    class="absolute -top-10 left-0 z-20 flex h-8 items-center gap-2 bg-black transition-all duration-300"
    :class="
      socialStore.answerReplying
        ? 'opacity-100'
        : 'pointer-events-none opacity-0'
    "
  >
    <div
      class="group flex h-8 w-8 items-center justify-center rounded border border-white/30 bg-black shadow-[0px_3px_6px_#000000] transition-all active:scale-95"
      data-cy="947bfbee6f999c51"
      @click="socialStore.answerCollapse = !socialStore.answerCollapse"
    >
      <span
        class="cursor-pointer text-xl text-white/50 transition-all duration-300 group-hover:scale-110 group-hover:text-white"
        :class="socialStore.answerCollapse ? 'rotate-180' : 'rotate-0'"
      >
        <i class="fa-solid fa-chevron-up text-[#f1f1f1]" />
      </span>
    </div>
    <BaseAvatarNext
      :picture="answerToUser?.picture"
      :round="false"
      :show-online="false"
      size="sm"
      class="size-8 bg-transparent"
    />
    <div
      class="flex h-8 items-center gap-2 rounded border border-white/30 bg-black px-2 text-13 shadow-[0px_3px_6px_#000000]"
    >
      <span class="text-white/50">
        {{ $t('personal.certificate.to') }}
      </span>
      <span class="font-light">
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

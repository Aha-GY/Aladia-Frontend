<template>
  <div class="flex flex-col gap-1 px-2.5 py-1.5">
    <div
      class="flex h-[2.8125rem] cursor-pointer items-center gap-2.5 rounded-md p-1.5 transition-all hover:bg-white/5"
      data-cy="bde1d87dcbbd27f7"
      @click="$emit('onChange', 'Notification')"
    >
      <div class="flex h-5 w-5 items-center justify-center text-white/70">
        <i class="fa-solid fa-bell text-xs" />
      </div>
      <div class="text-base font-[500] text-white/70">
        {{ $t('org.activity.chat.setting.notification') }}
      </div>
    </div>

    <div
      class="flex h-[2.8125rem] cursor-pointer items-center gap-2.5 rounded-md p-1.5 transition-all hover:bg-white/5"
    >
      <div class="flex h-5 w-5 items-center justify-center text-white/70">
        <i class="fa-solid fa-bookmark text-xs" />
      </div>
      <div class="text-base font-[500] text-white/70">
        {{ $t('org.activity.chat.bookmark') }}
      </div>
    </div>
    <div
      class="flex h-[2.8125rem] cursor-pointer items-center gap-2.5 rounded-md p-1.5 transition-all hover:bg-white/5"
      data-cy="86261efe8d617830"
      @click="$emit('onChange', 'Customize Chat')"
    >
      <div class="flex h-5 w-5 items-center justify-center text-white/70">
        <i class="fa-solid fa-pencil text-xs" />
      </div>
      <div class="text-base font-[500] text-white/70">
        {{ $t('org.activity.chat.setting.customize') }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
};
</script>

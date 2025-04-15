<template>
  <div class="flex h-[3.125rem] items-center gap-1.5 px-2.5">
    <div class="h-8 w-8 rounded-md">
      <img
        :src="info.image"
        alt="avatar"
        class="h-full w-full rounded-md object-cover"
      />
    </div>
    <div class="flex w-0 flex-1 flex-col gap-0.5">
      <div class="text-sm font-semibold leading-4 text-white/70 transition-all">
        {{ info.name }}
      </div>
      <div class="text-xs text-white/30 transition-all">
        {{
          $t('org.activity.member.count', {
            count: moneyFormat(info.numberOf?.members || 0, 0),
          })
        }}
      </div>
    </div>
    <div
      class="flex h-4 w-4 cursor-pointer items-center justify-center text-white/70 transition-all hover:text-white/90"
      data-cy="e2852740a2bf3a10"
      @click="onClose"
    >
      <i
        class="fa-sharp fa-solid fa-arrow-up-right-and-arrow-down-left-from-center text-xs"
      />
    </div>
    <div
      class="flex h-4 w-4 cursor-pointer items-center justify-center text-white/70 transition-all hover:text-white/90"
      data-cy="00908a84816c1abb"
      @click="onCloseChat"
    >
      <i class="fa-solid fa-xmark text-xs" />
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  computed: {
    info() {
      return this.hubChatStore.lateralRoomInfo;
    },
  },
  methods: {
    onClose() {
      this.hubChatStore.isChat = false;
      this.hubChatStore.rightSiderType = '';
      this.hubChatStore.lateralChatId = null;
      this.hubChatStore.roomId = null;
    },
    onCloseChat() {
      this.hubChatStore.isChat = false;
      this.hubChatStore.lateralChatId = null;
    },
  },
};
</script>

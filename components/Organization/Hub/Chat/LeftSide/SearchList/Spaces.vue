<template>
  <div class="flex h-full flex-col">
    <div
      class="flex h-9 items-center justify-between rounded-sm bg-[#0c0c0c] px-2 text-xs text-[#b0b0b0]"
    >
      <div>
        {{ $t('org.activity.chat.frequent') }}
      </div>
      <!-- <BaseButton type="tertiary" size="small" @click="showMore = !showMore" data-cy="7a7f5eca7cf39ef2">
        Show more
      </BaseButton> -->
    </div>
    <div
      v-if="recents.length"
      v-infinite-scroll="recentRooms"
      :infinite-scroll-disabled="recentLoading || !recentNext"
      class="hide-scrollbar grid grid-cols-4 gap-3 overflow-hidden overflow-y-auto overscroll-contain py-3"
    >
      <div
        v-for="item in recents"
        :key="item.id"
        class="flex cursor-pointer flex-col items-center gap-1 rounded-[0.3125rem] p-1 text-center text-white/80 hover:bg-white/5"
        data-cy="72a4114d50680e16"
        @click="() => $emit('locate-room', item)"
      >
        <OrganizationHubChatLeftSideMemberAvatar :item="item" />
        <div
          class="line-clamp-2 w-full flex-1 truncate whitespace-normal break-words text-xs"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div v-else class="flex flex-1 items-center">
      <BaseNoData />
    </div>
  </div>
</template>
<script>
export default {
  emits: ['locate-room'],
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      showMore: false,
      recents: [],
      recentNext: null,
      recentLoading: false,
    };
  },
  mounted() {
    this.searchHistory();
    this.recentRooms();
  },
  methods: {
    async searchHistory() {
      await this.hubChatStore.getSearchHistory();
    },
    async recentRooms() {
      this.recentLoading = true;
      const {
        data,
        cursor: { next },
      } = await this.hubChatStore.getRecentRooms({
        type: 'space',
        limit: 0,
        next: this.recentNext,
      });
      this.recents = [...this.recents, ...data];
      this.recentNext = next;
      this.recentLoading = false;
    },
  },
};
</script>

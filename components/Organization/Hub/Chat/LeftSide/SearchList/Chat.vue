<template>
  <div class="flex h-full flex-col">
    <div
      class="flex h-9 items-center justify-between rounded-sm bg-[#0c0c0c] px-2 text-xs text-[#b0b0b0]"
    >
      <div>
        {{ $t('org.activity.chat.frequent') }}
      </div>
      <BaseButton type="tertiary" size="small" @click="showMore = !showMore">
        {{ !showMore ? $t('post.content.more') : $t('post.content.less') }}
      </BaseButton>
    </div>

    <div
      v-if="recents.length"
      v-infinite-scroll="recentRooms"
      :infinite-scroll-disabled="recentLoading || !recentNext"
      class="hide-scrollbar grid grid-cols-4 gap-3 overflow-y-auto overscroll-contain py-1 transition-all"
      :class="showMore ? 'h-auto' : 'h-[7.5rem]'"
    >
      <div
        v-for="item in recents"
        :key="item.id"
        class="flex flex-shrink-0 cursor-pointer flex-col items-center gap-1 rounded-5 p-1 text-center text-white/80 hover:bg-white/5"
        data-cy="cb125ed2fcde5a4b"
        @click.stop="() => $emit('locate-room', item)"
      >
        <BaseAvatarNext :picture="item.image" size="md" :show-online="false" />
        <div
          class="line-clamp-2 w-full truncate whitespace-normal break-words text-xs"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div v-else-if="recentLoading" class="grid grid-cols-4 gap-3">
      <div v-for="i in 4" :key="i" class="flex gap-1 p-2 px-4">
        <BaseSkeleton
          :length="1"
          class="h-full w-[3.5rem] flex-shrink-0 rounded-full [&_div]:rounded-full"
          height="3.5rem"
        />
      </div>
    </div>
    <div v-else class="h-2" />

    <div
      class="flex h-9 items-center justify-between rounded-sm bg-[#0c0c0c] px-2 text-xs text-[#b0b0b0]"
    >
      <div>
        {{ $t('calendar.search.history.label') }}
      </div>
      <BaseButton
        type="tertiary"
        size="small"
        :loading="clearLoading"
        data-cy="f62e735c3fb5032a"
        @click="clear"
      >
        {{ $t('base.upload.clear') }}
      </BaseButton>
    </div>
    <div
      v-if="historys.length"
      v-infinite-scroll="searchHistory"
      :infinite-scroll-disabled="historyLoading || !historyNext"
      class="no-scrollbarflex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain py-1"
    >
      <OrganizationHubChatLeftSideMember
        v-for="item in historys"
        :key="item.id"
        :item="item"
        :is-search="true"
        data-cy="ba69046fdc9d55e6"
        @click="() => $emit('locate-room', item)"
      />
      <div v-if="historyLoading" class="flex flex-col">
        <div v-for="i in 4" :key="i" class="flex gap-1 p-2">
          <BaseSkeleton :length="1" class="w-10" />
          <BaseSkeleton :length="1" class="flex-1" />
        </div>
      </div>
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
      historys: [],
      historyNext: null,
      historyLoading: false,
      clearLoading: false,
    };
  },
  mounted() {
    this.searchHistory();
    this.recentRooms();
  },
  methods: {
    async searchHistory() {
      this.historyLoading = true;
      const {
        data,
        cursor: { next },
      } = await this.hubChatStore.getSearchHistory({
        next: this.historyNext,
      });
      this.historys = [...this.historys, ...data];
      this.historyNext = next;
      this.historyLoading = false;
    },
    async recentRooms() {
      this.recentLoading = true;
      const {
        data,
        cursor: { next },
      } = await this.hubChatStore.getRecentRooms({
        type: 'one-to-one',
        limit: 0,
        next: this.recentNext,
      });
      this.recents = [...this.recents, ...data];
      this.recentNext = next;
      this.recentLoading = false;
    },
    async clear() {
      if (this.clearLoading) {
        return;
      }
      this.clearLoading = true;
      await this.hubChatStore.clearSearchHistory();
      this.historys = [];
      this.clearLoading = false;
    },
  },
};
</script>

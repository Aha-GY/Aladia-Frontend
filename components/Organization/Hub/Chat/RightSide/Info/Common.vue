<template>
  <div class="flex h-0 flex-1 flex-col gap-2 bg-[#0c0c0c] p-4">
    <div class="sticky top-0 z-[100] flex flex-col bg-[#0c0c0c]">
      <div
        class="mb-2 flex items-center justify-between p-[0.375rem] pr-[0.75rem]"
      >
        <div class="flex items-center gap-2">
          <div class="flex w-12 items-center justify-center">
            <i class="fa-light fa-users text-sm" />
          </div>
          <div>
            {{ $t('event.common.groups') }}
          </div>
        </div>
        <div>{{ total }}</div>
      </div>
      <div class="my-3 px-4">
        <BaseInput
          v-model="query"
          search
          clear
          fixed
          class="text-sm"
          :placeholder="$t('base.search.label')"
        />
      </div>
    </div>
    <div
      v-infinite-scroll="load"
      :infinite-scroll-disabled="loading || !next"
      class="hide-scrollbar h-[calc(100vh-13rem)] overflow-y-auto overscroll-contain"
    >
      <div
        v-for="room in list"
        :key="room.id"
        class="flex cursor-pointer items-center gap-2 rounded-5 p-2 hover:bg-white/10 active:scale-[0.99]"
        data-cy="8abd0b4140007d6b"
        @click="locateRoom(room)"
      >
        <OrganizationHubChatLeftSideMemberAvatar :item="room" />
        <div class="flex-1 truncate" v-html="highlightName(room.name)" />
      </div>
      <BaseSkeleton v-show="loading" height="3.5rem" />
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      loading: false,
      list: [],
      next: null,
      total: 0,
      query: null,
    };
  },
  computed: {
    targerUserId() {
      return this.hubChatStore.roomInfo?.oneToOnePeer?.id;
    },
  },
  watch: {
    'hubChatStore.roomId'(val) {
      if (val) {
        this.next = null;
        this.list = [];
        this.total = 0;
        this.load();
      }
    },
    query() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.search();
      }, 500);
    },
  },
  methods: {
    async load() {
      this.loading = true;
      const params = {
        query: this.query?.trim(),
        userId: this.targerUserId,
        next: this.next,
        limit: 50,
      };
      const {
        cursor: { next, totalItems },
        data,
      } = await this.hubChatStore.listCommonRooms(params);
      this.list = [...this.list, ...data];
      this.total = totalItems;
      this.next = next;
      this.loading = false;
    },
    search() {
      this.next = null;
      this.list = [];
      this.load();
    },
    async locateRoom(room) {
      this.hubChatStore.closeRightSider();
      await this.hubChatStore.locateRoom(
        room.id,
        room.spaceRoomId,
        room.folderRoomId,
      );
    },
    highlightName(name) {
      if (this.query) {
        return highlightKeywords(name || '', [this.query.trim()]);
      } else {
        return name;
      }
    },
  },
};
</script>

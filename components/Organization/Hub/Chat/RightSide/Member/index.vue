<template>
  <div class="flex min-h-[12.5rem] flex-col bg-[#0c0c0c] p-4">
    <div class="sticky top-0 z-[100] flex flex-col bg-[#0c0c0c]">
      <OrganizationHubChatRightSideMemberHeader
        :total="total"
        @filter="filterMember"
      />
      <div class="my-3 px-4">
        <BaseInput
          v-model="query"
          search
          clear
          fixed
          class="text-sm"
          :placeholder="$t('base.search.user')"
        />
      </div>
    </div>
    <div
      v-if="!isO2ORoom"
      v-infinite-scroll="load"
      :infinite-scroll-disabled="loading || end"
      :infinite-scroll-distance="20"
      class="hide-scrollbar h-[calc(100vh-13rem)] overflow-y-auto"
    >
      <OrganizationHubChatRightSideMemberItem
        v-for="member in members"
        :key="member.id"
        :member="member"
      />
      <BaseSkeleton v-show="loading" height="3.5rem" />
    </div>
  </div>
</template>

<script>
import WebSocketService from '~/utils/websocket';

export default {
  setup() {
    const hubChatStore = useHubChatStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    const websocket = WebSocketService.getInstance();
    return { hubChatStore, websocket, hubSpaces, hubSidebar };
  },
  data() {
    return {
      loading: false,
      timer: null,
      end: false,
      next: null,
      total: 0,
      members: [],
      filterRoles: null,
      query: null,
    };
  },
  computed: {
    room() {
      return this.hubChatStore.roomInfo;
    },
    isO2ORoom() {
      return this.room?.type === 'one-to-one';
    },
    invite() {
      return this.hubSidebar.invite;
    },
    roles() {
      return this.invite.roles;
    },
  },
  watch: {
    // 从 Invite 组件跳转过来时，重新加载数据
    'invite.state'(state) {
      if (!state) {
        this.init();
      }
    },
    'roles.length'() {
      this.init();
    },
    'room.id'(val) {
      if (val) {
        this.init();
      }
    },
    query(val) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.searchMember(val);
      }, 500);
    },
  },
  mounted() {
    this.websocket.on('broadcast', this.handleUserConnectStatus);
  },
  beforeUnmount() {
    this.websocket.off('broadcast', this.handleUserConnectStatus);
  },
  methods: {
    async init() {
      this.end = false;
      this.next = null;
      this.members = [];
      this.load();
    },
    async load() {
      if (!this.room?.id) {
        return;
      }
      this.search();
    },
    async filterMember(roles = null) {
      this.end = false;
      this.next = null;
      this.members = [];
      this.filterRoles = roles;
      await this.search(roles);
    },
    async searchMember() {
      this.end = false;
      this.next = null;
      this.members = [];
      await this.search();
    },
    async search(roles = null) {
      this.loading = true;
      const {
        data,
        cursor: { next, totalItems },
      } = await this.hubChatStore.searchRoomMembers({
        roles: this.filterRoles,
        query: this.query,
        roomId: this.room?.id,
        next: roles ? null : this.next,
        limit: 50,
      });
      this.members = [...this.members, ...data];
      this.members.forEach((item) => {
        item.fullName = this.highlightName(item.fullName);
      });
      this.next = next;
      this.end = !next;
      this.total = totalItems;
      this.loading = false;
    },
    handleUserConnectStatus(res) {
      if (!res || !res.data) {
        return;
      }
      const { userId, online } = res.data;
      this.members.forEach((item) => {
        if (item.id === userId) {
          item.isOnline = online;
        }
      });
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

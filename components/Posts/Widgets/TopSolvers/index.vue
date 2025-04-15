<template>
  <PostsWidgetsBox :label="$t('post.users.best')">
    <BaseInput
      v-model="name"
      search
      fixed
      clear
      :placeholder="$t('post.users.placeholder')"
      class="!w-full"
    />

    <div
      v-infinite-scroll="loadTopSolvers"
      :infinite-scroll-disabled="loading || !next"
      :infinite-scroll-distance="20"
      class="mt-2 h-[16rem] overflow-y-auto"
    >
      <BaseMemberFollower
        v-for="item in topSolverMembers"
        :key="item.id"
        avatar-size="small"
        class="mb-3 last:mb-0"
        :source="'topSolverMembers'"
        :item="item"
        @on-following="changeFollow(item)"
      />
      <div v-show="loading">
        <BaseSkeleton :length="6" class="mb-3" />
      </div>
    </div>
  </PostsWidgetsBox>
</template>
<script>
import WebSocketService from '~/utils/websocket';

export default {
  setup() {
    const websocket = WebSocketService.getInstance();
    const globalStore = useGlobalStore();
    return { globalStore, websocket };
  },
  data() {
    return {
      loading: false,
      next: null,
      name: '',
      timer: null,
      topSolverMembers: [],
    };
  },
  watch: {
    name() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 1000);
    },
  },
  mounted() {
    this.websocket.on('broadcast', this.handleUserConnectStatus);
    this.init();
  },
  unmounted() {
    this.websocket.off('broadcast', this.handleUserConnectStatus);
  },
  methods: {
    init() {
      this.topSolverMembers = [];
      this.loading = false;
      this.next = null;
      this.loadTopSolvers();
    },
    async loadTopSolvers() {
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;
        const {
          data,
          cursor: { next },
        } = await this.globalStore.searchProfile({
          text: this.name || undefined,
          next: this.next,
          limit: 10,
          sortBy: 'numberOfSolved',
          sortDirection: 'desc',
        });
        this.next = next;
        this.topSolverMembers = [...this.topSolverMembers, ...data];
      } finally {
        this.loading = false;
      }
    },
    handleUserConnectStatus(data) {
      if (!data || !data.data) {
        return;
      }

      const { userId, online } = data.data;

      // members list
      (this.topSolverMembers || []).forEach((item) => {
        if (item.id === userId) {
          item.online = online;
        }
      });
    },
    changeFollow(item) {
      const index = this.topSolverMembers.findIndex(
        (member) => member.id === item.id,
      );
      if (index !== -1) {
        this.topSolverMembers[index].isFollowing =
          !this.topSolverMembers[index].isFollowing;
      }
    },
  },
};
</script>

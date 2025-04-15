<template>
  <PostsWidgetsRightBox
    :label="$t('meet.member.online')"
    :total-items="totalItems"
    :expandable="onlineUsers.length > 4"
    @expand="handleExpand"
  >
    <div
      v-if="currentlyShown.length > 0"
      class="grid w-[20rem] grid-cols-4 gap-2 bg-[#131313]"
    >
      <div v-for="item in currentlyShown" :key="item.id">
        <div class="flex flex-col items-center">
          <BaseAvatarNext
            :picture="item.picture"
            :story="item?.story"
            :user-id="item?.id"
            size="md"
            :online="item.online"
            @click="handleAvatarClick(item)"
          />
          <div
            class="line-clamp-2 w-full cursor-pointer break-words text-center text-xs text-white underline-offset-2 hover:underline"
            @click="handleUserClick(item)"
          >
            {{ item.name || item.fullName }}
          </div>
        </div>
      </div>
    </div>
    <PostsWidgetsOnlineSkeleton v-else />
  </PostsWidgetsRightBox>
</template>

<script>
export default {
  setup() {
    const globalStore = useGlobalStore();
    const profileStore = useProfileStore();
    const fluxesStore = useFluxesStore();

    const authStore = useAuthStore();
    return {
      globalStore,
      profileStore,
      authStore,
      fluxesStore,
    };
  },
  data() {
    return {
      onlineUsers: [],
      currentlyShown: [],
      onlineUsersLoading: false,
      totalItems: 0,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.onlineUsers = [];
      this.onlineUsersLoading = false;
      this.loadOnlineUsers();
    },
    async loadOnlineUsers() {
      if (this.onlineUsersLoading) {
        return;
      }
      try {
        this.onlineUsersLoading = true;
        const { data } = await this.globalStore.searchProfile({
          next: null,
          limit: 0,
          online: true,
        });

        this.onlineUsers = [...data];
        this.onlineUsers = this.onlineUsers.filter(
          (user) => user.id !== this.authStore.context,
        );
        this.handleExpand(false);
      } finally {
        this.onlineUsersLoading = false;
      }
    },
    handleExpand(showMore) {
      this.currentlyShown = showMore
        ? this.onlineUsers
        : this.onlineUsers.slice(0, 4);
      this.totalItems = this.onlineUsers.length;
    },
    handleUserClick(item) {
      this.profileStore.gotoProfilePage(item);
    },
    handleAvatarClick(item) {
      if (['active', 'viewed'].includes(item.story?.status)) {
        return;
      }
      this.handleUserClick(item);
    },
  },
};
</script>

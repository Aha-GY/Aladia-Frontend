<template>
  <PostsWidgetsRightBox
    :label="$t('post.record.followers')"
    :total-items="totalItems"
  >
    <div>
      <PostsWidgetsItem
        v-for="item in followers"
        :key="item.id"
        class="mb-3 last:mb-0"
        :item="item"
        :suggestion="false"
        @chat="handleChat"
      />
      <div v-show="followersLoading">
        <BaseSkeletonSuggestedUser :length="6" class="mb-3" />
      </div>
      <div>
        <div
          v-show="!followersLoading && followers.length === 0"
          class="hide-scrollbar flex h-[10rem] w-[20rem] flex-col items-center justify-center overflow-y-auto"
        >
          <i class="fa-solid fa-users mb-4 text-[2.8125rem]" />
          <div class="text-center text-xs">
            {{ $t('post.empty.followers') }}
          </div>
          <div class="text-center text-xs">
            {{ $t('post.check.friends') }}
          </div>
          <div class="text-center text-xs">
            {{ $t('post.network.build') }}
          </div>
        </div>
      </div>
    </div>
  </PostsWidgetsRightBox>
</template>
<script>
export default {
  setup() {
    const globalStore = useGlobalStore();
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    const fluxesStore = useFluxesStore();

    const route = useRoute();
    return {
      route,
      globalStore,
      hubChatStore,
      authStore,
      fluxesStore,
    };
  },
  data() {
    return {
      followers: [],
      followersLoading: false,
      followersNext: null,
      totalItems: 0,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.followers = [];
      this.followersLoading = false;
      this.followersNext = null;
      this.loadSuggestion();
    },
    async loadSuggestion() {
      if (this.followersLoading) {
        return;
      }
      try {
        this.followersLoading = true;
        const {
          data,
          cursor: { next, totalItems },
        } = await this.hubChatStore.getFollowers({
          followerId: this.route.params.name,
          limit: 100,
        });
        this.followersNext = next;
        this.totalItems = totalItems;
        this.followers = [...this.followers, ...data];
      } finally {
        this.followersLoading = false;
      }
    },
    handleChat({ item }) {
      if (this.authStore.logged) {
        this.$router.push(
          `${this.authStore.hub}/chat?${item.entityType === 'organization' ? 'orgId' : 'userId'}=${item.id}`,
        );
      } else {
        this.authStore.popup = true;
      }
    },
  },
};
</script>

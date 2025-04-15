<template>
  <div
    class="__feed-main relative mx-auto w-[42.5rem] max-2xl:w-[38rem] max-md:w-screen max-md:px-2"
  >
    <div
      v-if="showNewPostButton"
      class="fixed left-1/2 top-28 z-[50] -translate-x-1/2 transform"
    >
      <div
        class="tex-xs flex cursor-pointer gap-2 rounded-5 border border-[#292929] bg-[#161616] px-3 py-1.5 text-sm font-semibold text-[#FAFAFA] text-white/80 transition hover:bg-black/95"
        @click="onNewPostClick"
      >
        <i class="fa-solid fa-arrow-up mt-[0.2rem] text-[0.75rem]" />
        <div class="text-sm">New Posts</div>
      </div>
    </div>
    <FluxesStory />
    <PostsCreationTrigger
      data-cy="feeds"
      @change-tab="onChangeTabManual"
      @send="onSend"
    />
    <SocialItemUploadProgress />
    <SocialItemRepostProgress />

    <SocialContextSwitch />

    <BaseInfiniteLoad
      class="__feed-list"
      :disabled="
        socialStore.postsLoading ||
        !socialStore.posts.next ||
        socialStore.suggestionsLoading ||
        socialStore.organizationSuggestionsLoading
      "
      @load-more="load"
    >
      <template v-for="item in posts" :key="item.id || item.type">
        <template v-if="item.type === 'suggestion'">
          <SocialSuggestedRow
            :length="socialStore.suggestions.length"
            :title="$t('category.suggested.users')"
            type="Users"
          >
            <MarketCardUser
              v-for="user in socialStore.suggestions"
              :key="user.id"
              :user="user"
              type="feed"
            />
          </SocialSuggestedRow>
        </template>

        <template v-else-if="item.type === 'organizationSuggestion'">
          <SocialSuggestedRow
            :length="socialStore.organizationSuggestions.length"
            :title="$t('category.suggested.org')"
            type="Organizations"
          >
            <MarketCardTeacher
              v-for="organization in socialStore.organizationSuggestions"
              :key="organization.id"
              :user="organization"
              type="organization"
              from="feed"
            />
          </SocialSuggestedRow>
        </template>

        <template v-else-if="item.type === 'reelSuggestion'">
          <FluxesReel />
        </template>

        <template v-else-if="item.type === 'hidden'">
          <BaseHidden
            :label="$t('post.reel.hidden.label')"
            :title="$t('post.reel.hidden.content')"
            @undo="undo(item.id)"
          />
        </template>

        <div v-else-if="item.type === 'repost'" class="mb-5 last:mb-0">
          <PostsItemMentionPost
            v-if="item.numberOf"
            :item="item"
            :data-cy="`feeds-mention-card-${item.id}`"
          />
          <PostsItemRepost
            v-else
            :item="item"
            :data-cy="`feeds-repost-card-${item.id}`"
          />
        </div>

        <PostsItem
          v-else
          :item="item"
          class="mb-5 last:mb-0"
          :data-cy="`feeds-post-card-${item.id}`"
        />
      </template>

      <div v-show="socialStore.postsLoading">
        <PostsSkeleton v-for="n in 5" :key="n" class="mb-5 last:mb-0" />
      </div>
    </BaseInfiniteLoad>
  </div>
</template>

<script>
import WebSocketService from '~/utils/websocket';

export default {
  setup() {
    const websocket = WebSocketService.getInstance();
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const searchStore = useSearchStore();
    const globalStore = useGlobalStore();
    const fluxesStore = useFluxesStore();
    const profileStore = useProfileStore();

    return {
      authStore,
      socialStore,
      searchStore,
      globalStore,
      websocket,
      fluxesStore,
      profileStore,
    };
  },
  data() {
    return {
      showNewPostButton: false,
      inactivityTimer: null,
      inactivityDuration: 1000 * 10,
    };
  },
  computed: {
    posts() {
      return this.socialStore.posts.posts;
    },
    isReelCreated() {
      return this.fluxesStore.reelCreated;
    },
    isReelEdited() {
      return this.fluxesStore.reelEdited;
    },
  },
  watch: {
    $route(newVal) {
      newVal.query.postId && this.switchPopup(newVal.query.postId);
    },
    isReelCreated(newVal) {
      if (newVal === true) {
        this.getPosts();
        this.fluxesStore.reelCreated = false;
      }
    },
    isReelEdited(newVal) {
      if (newVal === true) {
        this.getPosts();
        this.fluxesStore.reelEdited = false;
      }
    },
    'socialStore.postPopup'(val) {
      if (val === true) {
        this.showNewPostButton = false;
      }
    },
  },
  mounted() {
    this.websocket.on('broadcast', this.handleUserConnectStatus);
    this.firstInit();

    window.addEventListener('mousemove', this.handleActivity);
    window.addEventListener('scroll', this.handleActivity);
    window.addEventListener('keydown', this.handleActivity);

    this.resetInactivityTimer();
  },
  unmounted() {
    this.websocket.off('broadcast', this.handleUserConnectStatus);
    this.socialStore.hidePostsPopup();
    this.socialStore.tabIndex = 0;

    window.removeEventListener('mousemove', this.handleActivity);
    window.removeEventListener('scroll', this.handleActivity);
    window.removeEventListener('keydown', this.handleActivity);
  },
  methods: {
    handleActivity() {
      if (!this.showNewPostButton) {
        this.resetInactivityTimer();
      }
    },
    resetInactivityTimer() {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(() => {
        this.showNewPostButton = true;
      }, this.inactivityDuration);
    },
    onNewPostClick() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.getPosts();
      this.showNewPostButton = false;
    },
    onChangeTabManual(index) {
      this.socialStore.postsSearching = false;
      this.$nextTick(() => {
        this.onChangeTab(index);
      });
    },
    async onChangeTab(index) {
      if (!this.socialStore.postsSearching) {
        this.socialStore.tabIndex = index;
      }
      window.scrollTo({ top: 0 });
      this.socialStore.posts.posts = [];
      this.socialStore.posts.next = null;
      this.socialStore.posts.totalRecords = 0;
      await this.load();
    },
    async load() {
      if (this.socialStore.postsSearching) {
        await this.socialStore.searchPostsList({
          type: 'question',
          title: this.searchStore.query.title,
          next: this.socialStore.posts.next,
        });
      } else {
        await this.socialStore.getPosts({
          next: this.socialStore.posts.next,
          suggestion: true,
          type: [undefined, 'post', 'question'][this.socialStore.tabIndex],
        });
      }
    },
    async firstInit() {
      const { postId } = this.$route.query;
      postId && this.openDetailPopup(postId);
      await this.onChangeTab(
        this.$route.query.index || this.socialStore.tabIndex,
      );
      const correctPointer = this.socialStore.posts.posts.find(
        (item) => item.id === postId,
      );
      correctPointer && (this.socialStore.postItem = correctPointer);
    },
    async switchPopup(postId) {
      if (!postId) {
        return;
      }
      const postData = await this.socialStore.retreivePost(postId);
      if (!postData) {
        return;
      }
      this.socialStore.postItem = postData;
      this.socialStore.postPopup = false;
      this.$nextTick(() => {
        this.socialStore.postPopup = true;
      });
    },
    async openDetailPopup(postId) {
      const postData = await this.socialStore.retreivePost(postId);
      if (!postData) {
        return;
      }
      if (postData?.parent) {
        if (!postData?.numberOf) {
          this.socialStore.repostItem = postData;
          this.socialStore.postItem = postData.parent;
        } else {
          this.socialStore.showMentionPopup(postData, postData.parent);
          return;
        }
      } else {
        this.socialStore.postItem = postData;
      }
      this.socialStore.postPopup = true;
      // TODO: delete
      // switch (postData.type) {
      //   case 'post':
      //     this.socialStore.commentsPopup = true;
      //     break;
      //   case 'question':
      //     this.socialStore.questionPopup = true;
      //     break;
      //   default:
      //     break;
      // }
    },
    handleUserConnectStatus(data) {
      if (!data || !data.data) {
        return;
      }
      const { userId, online } = data.data;
      (this.socialStore.posts.posts || []).forEach((item) => {
        if (item.owner?.id === userId) {
          item.owner.online = online;
        }
      });
    },
    async undo(postId) {
      await this.socialStore.unHidePost({
        userId: this.authStore.context,
        postId,
      });
    },
    async getPosts() {
      this.socialStore.postsSearching = false;
      this.socialStore.tabIndex = undefined;
      this.socialStore.posts.posts = [];
      this.socialStore.posts.next = null;
      this.socialStore.posts.totalRecords = 0;
      this.socialStore.createLoading = true;
      this.showNewPostButton = false;
      try {
        await this.socialStore.getPosts({});
      } finally {
        this.socialStore.createLoading = false;
      }
    },
    onSend(/* type */) {
      // 原本一级一级触发 `send` 事件，就是为了在列表页面执行刷新帖子列表的操作
      // 后来这个行为被优化为直接在列表头部插入新创建或修改的帖子，无需刷新帖子列表
      // TODO: 因此一级一级触发 `send` 事件的行为在上述优化修改稳定后可被移除
      // console.log('onSend', type);
    },
  },
};
</script>

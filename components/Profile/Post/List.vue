<template>
  <div class="__profile-post-list">
    <PostsCreationTrigger
      v-if="!isView"
      :switch-visible="false"
      @change-tab="onChangeTab"
      @send="onSend"
    />
    <SocialItemUploadProgress />
    <SocialItemRepostProgress />
    <BaseNoData
      v-if="!posts.length && !socialStore.postsLoading"
      class="mt-[10rem]"
    />

    <BaseInfiniteLoad
      class="__post-list"
      :disabled="socialStore.postsLoading || !socialStore.posts.next"
      @load-more="load"
    >
      <template v-for="item in posts" :key="item.id">
        <template v-if="item.type === 'hidden'">
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
export default {
  props: {
    // 是否是只读模式（查看别人的主页）
    isView: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();
    const authStore = useAuthStore();
    return { socialStore, fluxesStore, authStore };
  },
  computed: {
    userId() {
      return this.$route.params.name;
    },
    posts() {
      return this.socialStore.posts.posts;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async onChangeTab(index) {
      window.scrollTo({ top: 0 });
      this.socialStore.tabIndex = index;
      this.socialStore.posts.posts = [];
      this.socialStore.posts.next = null;
      this.socialStore.posts.totalRecords = 0;
      await this.load();
    },
    init() {
      this.socialStore.tabIndex = undefined;
      this.socialStore.posts.posts = [];
      this.socialStore.posts.next = null;
      this.socialStore.posts.totalRecords = 0;
      this.load();
    },
    async load() {
      this.socialStore.postsLoading = true;
      const { data } = await this.socialStore.searchPosts({
        next: this.socialStore.posts.next,
        ownerId: this.userId,
        type: 'post,repost,auto-post',
      });
      this.socialStore.posts.posts = [...data];
      this.socialStore.postsLoading = false;
    },
    async getPosts() {
      this.socialStore.tabIndex = undefined;
      this.socialStore.posts.posts = [];
      this.socialStore.posts.next = null;
      this.socialStore.posts.totalRecords = 0;
      this.socialStore.createLoading = true;
      try {
        await this.load();
      } finally {
        this.socialStore.createLoading = false;
      }
    },
    async undo(postId) {
      await this.socialStore.unHidePost({
        userId: this.authStore.context,
        postId,
      });
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

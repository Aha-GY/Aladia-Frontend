<template>
  <BaseNoData
    v-if="!posts.length && !socialStore.postsLoading"
    class="mt-[10rem]"
  />

  <BaseInfiniteLoad
    class="__reel-list"
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
</template>

<script>
export default {
  props: {
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
      await this.socialStore.getPosts({
        next: this.socialStore.posts.next,
        ownerId: this.userId,
        type: 'reel',
      });
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
  },
};
</script>

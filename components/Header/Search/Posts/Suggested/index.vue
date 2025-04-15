<template>
  <div class="flex h-full flex-col px-4">
    <div class="mb-3 flex h-0 flex-1 flex-col">
      <div class="mb-3 text-base">
        {{ $t('nav.header.notification.banner.post.suggested') }}
      </div>
      <div class="h-0 flex-1 overflow-hidden">
        <div v-if="loading" class="flex flex-col gap-1">
          <HeaderSearchSkeletonPost v-for="n in 3" :key="n" />
        </div>
        <div v-else class="flex flex-col gap-1">
          <HeaderSearchTypePost
            v-for="item in posts"
            :key="item.id"
            :item="item"
          />
        </div>
      </div>
    </div>
    <HeaderSearchTypeTopics />
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();
    return { socialStore, fluxesStore };
  },
  data() {
    return {
      posts: [],
      loading: false,
    };
  },
  mounted() {
    this.getPosts();
  },
  methods: {
    async getPosts() {
      this.loading = true;
      const { data } = await this.socialStore.getPostsList({
        limit: 3,
      });
      this.posts = data;
      this.loading = false;
    },
  },
};
</script>

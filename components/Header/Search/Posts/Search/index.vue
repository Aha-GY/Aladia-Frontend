<template>
  <div class="flex h-full w-full flex-col gap-4">
    <BaseNoData v-if="!posts.length && !loading" class="mt-24" />
    <div
      v-if="loading"
      class="hide-scrollbar flex h-0 w-full flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-4"
    >
      <HeaderSearchSkeletonPost v-for="n in 10" :key="n" />
    </div>
    <div
      v-else
      class="hide-scrollbar relative flex h-0 w-full flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-4"
    >
      <HeaderSearchTypePost v-for="item in posts" :key="item.id" :item="item" />
    </div>
    <HeaderSearchTypeMore v-if="!loading" @more="onMore" />
  </div>
</template>

<script>
export default {
  setup() {
    const searchStore = useSearchStore();
    const fluxesStore = useFluxesStore();
    return { searchStore, fluxesStore };
  },
  data() {
    return {
      posts: [],
      timer: null,
      loading: false,
    };
  },
  computed: {
    title() {
      return this.searchStore.query.title;
    },
  },
  watch: {
    title() {
      this.posts = [];
      this.loading = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.search();
      }, 1000);
    },
  },
  mounted() {
    this.search();
  },
  methods: {
    async search() {
      try {
        this.loading = true;
        const { data } = await this.searchStore.searchPosts({
          limit: 10,
          text: this.title,
        });
        this.posts = data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    onMore() {
      this.searchStore.isFocus = false;
      //
    },
  },
};
</script>

<template>
  <PostsWidgetsBox :label="$t('post.course.category.list')">
    <BaseInput
      v-model="name"
      search
      fixed
      clear
      :placeholder="$t('post.topic.placeholder')"
      class="!w-full"
    />
    <div class="mt-2 h-[16rem] overflow-y-auto">
      <div
        v-infinite-scroll="load"
        class="my-2 flex w-full flex-wrap"
        :infinite-scroll-disabled="loading || !next"
        :infinite-scroll-distance="20"
      >
        <div
          v-for="item in categoryData"
          :key="item.id + name"
          class="flex aspect-square w-1/3 flex-col"
        >
          <div
            class="h-full w-full cursor-pointer"
            data-cy="c22a583b0c38ea19"
            @click="onCategoryClick(item)"
          >
            <div
              class="m-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] overflow-hidden rounded-[0.3125rem]"
            >
              <span
                class="block h-full w-full transition-all duration-300 hover:scale-150"
              >
                <img
                  :src="item?.image?.url"
                  :alt="item.name"
                  class="h-full w-full object-cover"
                />
              </span>
            </div>
          </div>
          <div class="w-full p-1 text-center">
            <div class="truncate text-xs text-white/70" :title="item.name">
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <PostsWidgetsCategoriesSkeleton v-show="loading" />
    </div>
  </PostsWidgetsBox>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  data() {
    return {
      categoryData: [],
      next: null,
      loading: false,
      name: '',
      timer: null,
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
    this.init();
  },
  methods: {
    async init() {
      this.next = null;
      this.categoryData = [];
      this.load();
    },
    async load() {
      this.loading = true;

      try {
        const {
          data,
          cursor: { next },
        } = await this.socialStore.searchCategories({
          limit: 12,
          next: this.next,
          name: this.name || undefined,
        });

        this.next = next;
        this.categoryData = [...this.categoryData, ...data].filter(
          (item) => item.status === 'active',
        );
      } finally {
        this.loading = false;
      }
    },
    onCategoryClick(item) {
      this.$router.push(`/marketplace?categoryId=${item.id}`);
    },
  },
};
</script>

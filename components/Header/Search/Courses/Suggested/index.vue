<template>
  <div v-if="loading" class="flex flex-col gap-2 px-4">
    <div v-for="n in 5" :key="n" class="skeleton h-[12rem] rounded" />
  </div>
  <div v-else class="flex flex-col gap-2 px-4">
    <HeaderSearchCoursesSuggestedItem
      v-for="item in categories"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const marketStore = useMarketStore();
    return { marketStore };
  },
  computed: {
    loading() {
      return this.marketStore.categoriesLoading;
    },
    categories() {
      return this.marketStore.categories;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (this.categories.length === 0) {
        await this.marketStore.getCategories();
      }
    },
  },
};
</script>

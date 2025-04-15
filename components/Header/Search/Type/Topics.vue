<template>
  <div>
    <div class="mb-3">{{ $t('nav.header.search.trending') }}</div>
    <div v-if="categoriesLoading" class="flex flex-wrap">
      <div
        v-for="n in length"
        :key="n"
        class="mb-3 flex w-[16.6%] flex-col items-center justify-center gap-1"
      >
        <div class="skeleton size-10 rounded-md" />
        <div class="skeleton h-3 w-4/5 rounded" />
      </div>
    </div>
    <div v-else class="flex flex-wrap">
      <div
        v-for="item in categories"
        :key="item.id"
        class="mb-3 flex w-[16.6%] cursor-pointer flex-col items-center justify-center gap-1 text-center text-xs"
      >
        <BaseCategoryIcon :image="item.image.url" class="!size-10" />
        <div class="w-4/5 truncate">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    length: {
      type: Number,
      default: 12,
    },
  },
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  computed: {
    categories() {
      return [
        ...this.socialStore.categories,
        ...this.socialStore.categories,
      ].slice(0, this.length);
    },
    categoriesLoading() {
      return this.socialStore.categoriesLoading;
    },
  },
  mounted() {
    this.getTopics();
  },
  methods: {
    getTopics() {
      this.socialStore.getCategories();
    },
  },
};
</script>

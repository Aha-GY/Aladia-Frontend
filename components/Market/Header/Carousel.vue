<template>
  <div v-loading="loading" class="h-full w-full">
    <div class="absolute inset-0 z-0 h-full w-full bg-black">
      <img
        v-if="item.image?.url"
        class="relative z-0 h-full w-full object-cover opacity-60"
        :src="item.image?.url"
      />
    </div>
    <div
      class="absolute inset-0 z-10 h-full w-full pt-6 sm:pt-12"
      :class="marketStore.subCategoriesOpen ? 'backdrop-blur-2xl' : ''"
    >
      <div
        v-if="item.name"
        class="mb-0 flex items-center gap-8 px-4 sm:mb-8 sm:px-12"
      >
        <div class="text-lg font-bold sm:text-4xl">
          {{ item.name }}
        </div>
        <div
          id="all-categories"
          class="next-icon -mb-4 hidden cursor-pointer items-center gap-2 text-lg sm:flex"
          data-cy="219606e42c07cea3"
          @click="onAllClick"
        >
          {{ $t('category.all') }}
          <BaseNextWhite />
        </div>
      </div>
      <div
        v-if="item?.loaded"
        class="hide-scrollbar relative flex flex-wrap justify-between overflow-y-auto overflow-x-hidden pt-3 after:flex-auto"
        :class="marketStore.subCategoriesOpen ? 'h-[22rem] sm:h-[24rem]' : ''"
      >
        <MarketHeaderItem
          v-for="(subCategory, index) in subCategories"
          :key="subCategory.id"
          :item="subCategory"
          :index="index"
          :category-id="item.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const searchStore = useSearchStore();
    const marketStore = useMarketStore();
    return { searchStore, marketStore };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    active() {
      return this.marketStore.categoryActive === this.item.index;
    },
    subCategoryId() {
      return this.$route.query?.subCategoryId;
    },
    subCategories() {
      const subCategories = this.item?.subCategories || [];
      const index = subCategories.findIndex(
        (item) => item.id === this.subCategoryId,
      );
      if (this.$device.isMobile) {
        if (index > 3) {
          const start = index - (index % 4);
          const end = start + 4;
          return this.marketStore.subCategoriesOpen
            ? subCategories
            : subCategories.slice(start, end);
        } else {
          return this.marketStore.subCategoriesOpen
            ? subCategories
            : subCategories.slice(0, 4);
        }
      } else {
        if (index > 9) {
          const start = index - (index % 10);
          const end = start + 10;
          return this.marketStore.subCategoriesOpen
            ? subCategories
            : subCategories.slice(start, end);
        } else {
          return this.marketStore.subCategoriesOpen
            ? subCategories
            : subCategories.slice(0, 10);
        }
      }
    },
  },
  watch: {
    active: {
      async handler(state) {
        if (!state || this.item.loaded || this.loading) {
          return;
        }
        await sleep(300);
        this.loading = true;
        await this.marketStore.getSubCategories({
          parentId: this.item.id,
        });
        this.loading = false;
      },
      immediate: true,
    },
  },
  methods: {
    async onAllClick() {
      this.searchStore.type = 'courses';
      document.querySelector('#search input').focus();
      await sleep(50);
      this.searchStore.isFocus = true;
    },
  },
};
</script>

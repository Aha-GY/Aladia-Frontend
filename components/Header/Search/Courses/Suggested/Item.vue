<template>
  <div
    v-loading="loading && hover"
    class="relative h-[12rem] overflow-hidden rounded"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="relative h-full w-full">
      <img
        class="h-full w-full origin-right object-cover transition-all duration-300"
        :class="hover ? 'scale-125' : ''"
        :src="item.image?.url"
      />
      <div
        class="absolute inset-0 h-full w-full bg-gradient-to-r from-black/80"
      />
    </div>
    <div class="absolute inset-0 h-full w-full">
      <div
        class="absolute left-[1.6rem] top-6 flex items-end gap-1 text-2xl transition-all"
        :class="hover ? '-translate-y-3' : 'translate-y-0'"
      >
        {{ item.name }}
        <div
          class="cursor-pointer pb-0.5 text-sm transition-all delay-150 duration-200"
          :class="
            hover ? 'translate-x-3 opacity-100' : 'translate-x-0 opacity-0'
          "
          data-cy="a724ab8599520aaa"
          @click="onClick"
        >
          {{ $t('course.viewAll') }}
          <i class="fa-solid fa-arrow-right" />
        </div>
      </div>
      <div
        v-if="!loading"
        class="flex gap-1 px-6 pt-[3.5rem] transition-all duration-200"
        :class="hover ? 'opacity-100' : 'opacity-0'"
      >
        <div class="relative h-36 flex-1 overflow-y-auto">
          <div
            v-for="sub in subCategories"
            :key="sub.id"
            class="mr-4 inline-block h-6 w-44 cursor-pointer truncate rounded px-1.5 text-13 leading-6 transition-all hover:bg-white/20"
            data-cy="1be67f35150f4a30"
            @click="onSubClick(sub)"
            @mouseenter="show = sub"
            @mouseleave="show = null"
          >
            {{ sub.name }}
          </div>
        </div>
        <div class="w-56 text-center">
          <div
            class="flex flex-col items-center text-center text-sm font-black transition-all duration-200"
            :class="show ? 'opacity-100' : 'opacity-0'"
          >
            <BaseCategoryIcon :image="show?.image?.url" class="mb-3 !size-24" />
            {{ show?.name }}
          </div>
        </div>
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
      hover: false,
      loading: false,
      show: null,
    };
  },
  computed: {
    categories() {
      return this.marketStore.categories;
    },
    subCategories() {
      return this.item.subCategories || [];
    },
    index() {
      const find = this.marketStore.categories.find(
        (item) => item.id === this.item.id,
      );
      return find?.index;
    },
  },
  watch: {
    async hover(val) {
      if (!val) {
        return;
      }
      if (this.loading) {
        return;
      }
      if (this.item.loaded) {
        return;
      }
      if (this.searchStore.query.title) {
        return;
      }
      this.loading = true;
      await this.marketStore.getSubCategories({
        parentId: this.item.id,
      });
      this.loading = false;
    },
  },
  methods: {
    async onClick() {
      this.$router.push(`/marketplace?categoryId=${this.item.id}`);
      this.marketStore.categoryActive = this.index;
      await sleep(50);
      this.searchStore.isFocus = false;
    },
    async onSubClick(sub) {
      this.$router.push({
        path: '/marketplace',
        query: {
          categoryId: this.item.id,
          subCategoryId: sub.id,
        },
      });

      this.marketStore.categoryActive = this.index;
      await sleep(50);
      this.searchStore.isFocus = false;
    },
  },
};
</script>

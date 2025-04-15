<template>
  <div class="container mx-auto flex h-[22.5rem] flex-col p-4 pb-3">
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="$t('base.search.gif')"
      class="mb-2 w-full rounded-[0.5rem] border-[0.0315rem] border-gray-400 p-2 text-xs text-[#707070]"
    />
    <div v-if="!searchQuery" class="mb-2 mt-1 text-sm text-white">
      {{ $t('personal.profile.trending') }}
    </div>
    <div
      v-infinite-scroll="fetchGifs"
      :infinite-scroll-disabled="loading || reachedEnd"
      :infinite-scroll-distance="10"
      class="hide-scrollbar grid flex-grow grid-cols-3 gap-1 overflow-y-auto"
    >
      <div v-for="gif in gifs" :key="gif.id" class="h-full w-full">
        <img
          :src="gif.images.fixed_height.url"
          alt="GIF"
          class="w-full cursor-pointer rounded-lg"
          @click="onSelected(gif)"
        />
      </div>
    </div>
    <div class="flex justify-end pt-1">
      <img
        src="~/assets/images/gifly_logo.gif"
        class="h-[2.625rem] w-[12.5rem]"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initialGifs: {
      type: Array,
      default: () => [],
    },
    initialialPage: {
      type: Number,
      default: 0,
    },
  },
  emits: ['select'],
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  data() {
    return {
      gifs: [...this.initialGifs],
      searchQuery: '',
      loading: false,
      page: this.initialialPage,
      limit: 9,
      reachedEnd: false,
    };
  },
  watch: {
    searchQuery() {
      this.debouncedSearch();
    },
  },
  methods: {
    async fetchGifs() {
      if (this.loading || this.reachedEnd) {
        return;
      }

      this.loading = true;

      const params = {
        q: this.searchQuery || undefined,
        limit: this.limit,
        offset: this.page * this.limit,
      };

      try {
        const response = this.searchQuery
          ? await searchGifs(params)
          : await fetchTrendingGifs(params);

        if (response.data.length < this.limit) {
          this.reachedEnd = true;
        } else {
          this.reachedEnd = false;
        }

        this.gifs = [...this.gifs, ...response.data];
        this.page++;
      } catch (error) {
        console.error('Error fetching GIFs:', error);
      } finally {
        this.loading = false;
      }
    },
    resetAndFetchGifs() {
      this.gifs = [];
      this.page = 0;
      this.reachedEnd = false;
      this.fetchGifs();
    },
    onSelected(gif) {
      this.socialStore.gif = gif.images.fixed_height.url;
      this.$emit('select', gif);
    },
    debouncedSearch: debounce(function () {
      this.resetAndFetchGifs();
    }, 500),
  },
};
</script>

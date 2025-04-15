<template>
  <div class="relative z-10 flex h-9 w-full items-center gap-2 px-4 text-sm">
    <i class="fa-solid fa-magnifying-glass text-xs" />
    <input type="email" class="hidden" name="email" />
    <input
      ref="input"
      v-model.trim="searchStore.query.title"
      :readonly="!searchStore.isFocus"
      name="search-all"
      maxlength="100"
      role="presentation"
      class="h-full w-0 flex-1 bg-transparent text-13 outline-none placeholder:text-white/50"
      :placeholder="$t('nav.header.search.hint', { type: searchStore.type })"
      data-cy="all-search-text-field"
      @keydown.enter="onEnter"
      @input="onInput"
    />
    <div
      v-show="searchStore.query.title"
      class="relative z-20 shrink-0 cursor-pointer text-sm text-[#707070] hover:text-[#ffffff]"
      data-cy="6cbbb0b9193ddef8"
      @click.stop="onClose"
    >
      <i class="fa-regular fa-xmark" />
    </div>
    <div
      class="bg-gradient-top absolute bottom-0 left-0 right-0 h-[1px] w-full opacity-80"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const searchStore = useSearchStore();
    return { searchStore };
  },
  mounted() {
    this.searchStore.query.title = this.$route.query.title || '';
  },
  methods: {
    onEnter() {
      //
    },
    onSearch() {
      //
    },
    onInput() {
      //
    },
    onClose() {
      this.searchStore.query.title = '';
      this.searchStore.isFocus = false;
    },
  },
};
</script>

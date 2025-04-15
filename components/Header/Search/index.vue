<template>
  <div
    class="pointer-events-none absolute inset-0 z-10 flex h-full w-full items-center justify-center"
  >
    <div
      id="search"
      class="group/input pointer-events-auto relative h-full rounded-md pt-2 transition-all"
      :class="searchStore.isFocus ? 'w-full sm:w-[50rem]' : 'w-3/5 sm:w-1/3'"
    >
      <HeaderSearchEnter />
      <div
        v-if="searchStore.isFocus"
        class="absolute top-0 z-0 w-full rounded-md bg-black/80 pt-16 backdrop-blur-md transition-all duration-200"
      >
        <LazyHeaderSearchMenu />
        <div class="h-[36rem]">
          <LazyHeaderSearchAll v-if="searchStore.type === 'all'" />
          <LazyHeaderSearchCourses v-if="searchStore.type === 'courses'" />
          <LazyHeaderSearchProfiles v-if="searchStore.type === 'profiles'" />
          <LazyHeaderSearchPosts v-if="searchStore.type === 'posts'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const searchStore = useSearchStore();
    return { searchStore };
  },
  beforeMount() {
    document.body.removeEventListener('click', this.onBodyClick);
  },
  mounted() {
    document.body.addEventListener('click', this.onBodyClick);
  },
  methods: {
    onBodyClick(event) {
      if (event.target.closest('#clear-input')) {
        return;
      }
      this.searchStore.isFocus = !!event.target.closest('#search');
      if (!event.target.closest('#search')) {
        this.searchStore.isFocus = false;
      }
    },
  },
};
</script>

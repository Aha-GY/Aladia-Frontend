<template>
  <div class="hide-scrollbar relative h-full overflow-y-auto">
    <HeaderSearchPostsSearch v-if="title" />
    <HeaderSearchPostsSuggested v-else />
  </div>
</template>

<script>
export default {
  setup() {
    const searchStore = useSearchStore();
    return { searchStore };
  },
  computed: {
    title() {
      return this.searchStore.query.title;
    },
  },
};
</script>

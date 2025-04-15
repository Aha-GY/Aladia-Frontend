<template>
  <div
    ref="main"
    class="flex items-center justify-between gap-2 rounded bg-black p-2 transition-all hover:bg-[#141414]"
  >
    <div class="flex w-0 flex-1 flex-col gap-1.5">
      <HeaderSearchTypePostHeader :item="item" />
      <HeaderSearchTypePostContent :item="item" />
      <PostsItemFooter
        :is-search="true"
        :item="item"
        @show-popup="handleShowPopup"
      />
    </div>
    <HeaderSearchTypePostThumbnail :item="item" />
    <PostsItemReactPopup v-if="socialStore.reactId === item.id" :item="item" />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const socialStore = useSocialStore();
    const searchStore = useSearchStore();
    return { socialStore, searchStore };
  },
  methods: {
    handleShowPopup() {
      const $main = this.$refs.main;
      const mainRect = $main.getBoundingClientRect();
      this.socialStore.offsetTop = mainRect.top;
      this.socialStore.offsetHeight = mainRect.height;
      this.socialStore.showPostsPopup(this.item);
    },
    handleDelete(item) {
      this.$emit('delete', item);
    },
    handleHide(item) {
      this.$emit('hide', item);
    },
  },
};
</script>

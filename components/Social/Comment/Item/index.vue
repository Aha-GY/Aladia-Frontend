<template>
  <div ref="main" class="relative rounded-lg bg-[#060606] p-4">
    <PostsItemHeader :item="item" @delete="handleDelete" @hide="handleHide" />
    <PostsItemInfo :item="item" @show-popup="handleShowPopup" />
    <PostsItemReact :item="item" @show-popup="handleShowPopup" />
    <PostsItemFooter :item="item" @show-popup="handleShowPopup" />
    <PostsItemReactPopup v-if="socialStore.reactId === item.id" :item="item" />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const searchStore = useSearchStore();
    return { authStore, socialStore, searchStore };
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

<template>
  <div
    ref="main"
    class="__posts-item"
    :data-cy="`${dataCy}`"
    :class="
      reelType
        ? 'relative overflow-hidden rounded-lg bg-[#060606] pb-0'
        : 'relative rounded-lg bg-[#060606] p-4'
    "
  >
    <PostsItemHeader
      :item="item"
      :is-chat="isChat"
      @delete="handleDelete"
      @hide="handleHide"
    />
    <PostsItemInfo
      :item="item"
      :data-cy="`${dataCy}-info`"
      @show-popup="handleShowPopup"
    />
    <PostsItemReact
      v-if="!reelType"
      :item="item"
      :data-cy="`${dataCy}-react`"
      @show-popup="handleShowPopup"
    />
    <PostsItemFooter
      v-if="!reelType"
      :item="item"
      :data-cy="`${dataCy}-footer`"
      :is-chat="isChat"
      @show-popup="handleShowPopup"
    />
    <PostsItemReactPopup v-if="socialStore.reactId === item.id" :item="item" />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    dataCy: {
      type: String,
      default: 'posts-card-item',
    },
    isChat: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const socialStore = useSocialStore();
    const searchStore = useSearchStore();
    return { socialStore, searchStore };
  },
  computed: {
    postType() {
      return this.item.type;
    },
    reelType() {
      return this.postType === 'reel';
    },
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

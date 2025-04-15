<template>
  <div
    ref="main"
    :data-cy="`${dataCy}`"
    :class="
      reelType
        ? 'relative overflow-hidden rounded-lg bg-[#060606] pb-0'
        : 'relative rounded-lg bg-[#060606] p-4'
    "
  >
    <div class="mb-4">
      <PostsItemRepostHeader
        :item="item"
        :data-cy="`repost-header`"
        @delete="handleDelete"
        @hide="handleHide"
      />
    </div>
    <PostsItemHeader
      :item="item.parent"
      :is-repost="true"
      @delete="handleDelete"
      @hide="handleHide"
    />
    <PostsItemInfo
      :item="item.parent"
      :data-cy="`${dataCy}-info`"
      @show-popup="handleShowPopup"
    />
    <PostsItemReact
      v-if="!reelType"
      :item="item.parent"
      :data-cy="`${dataCy}-react`"
      @show-popup="handleShowPopup"
    />
    <PostsItemFooter
      v-if="!reelType"
      :item="item.parent"
      :is-repost="true"
      :parent-item="item"
      :data-cy="`${dataCy}-footer`"
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
    isRepost() {
      return this.item?.type === 'repost';
    },
  },
  methods: {
    handleShowPopup() {
      const $main = this.$refs.main;
      const mainRect = $main.getBoundingClientRect();
      this.socialStore.offsetTop = mainRect.top;
      this.socialStore.offsetHeight = mainRect.height;
      if (this.isRepost) {
        this.socialStore.showPostsPopup(this.item.parent);
        this.socialStore.repostItem = this.item;
      } else {
        this.socialStore.showPostsPopup(this.item);
      }
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

<template>
  <div
    ref="main"
    :data-cy="`${dataCy}`"
    class="relative rounded-lg bg-[#060606] p-4"
  >
    <PostsItemMentionHeader
      :item="item"
      @delete="handleDelete"
      @hide="handleHide"
    />
    <PostsItemInfo
      :item="item"
      :data-cy="`${dataCy}-info`"
      @show-popup="handleShowPopup"
    />

    <div class="mb-2 rounded-[7.5px] border-[0.75px] border-[#707070] p-2">
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
    </div>

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
      this.socialStore.repostItem = this.item;
      this.socialStore.showMentionPopup(this.item, this.item.parent);
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

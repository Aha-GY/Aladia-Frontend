<template>
  <div
    ref="main"
    class="__posts-item relative rounded-lg bg-[#060606]"
    :data-cy="`${dataCy}`"
  >
    <div v-if="isMention" class="p-4">
      <PostsItemMentionHeader :item="item" :is-repost="true" />
      <PostsItemInfo :item="item" />

      <div class="mb-2 rounded-[7.5px] border-[0.75px] border-[#707070] p-2">
        <PostsItemHeader :item="item.parent" :is-repost="true" />
        <PostsItemInfo
          :item="item.parent"
          :data-cy="`${dataCy}-info`"
          @show-popup="handleShowPopup"
        />
      </div>
    </div>

    <div v-else>
      <div class="px-2 pt-2">
        <PostsItemRepostHeader v-if="isRepost" :item="item" :is-repost="true" />
      </div>
      <PostsItemHeader :is-repost="true" :item="postItem" class="!px-2 pt-2" />
      <PostsItemInfo
        class="px-4"
        :item="postItem"
        :data-cy="`${dataCy}-info`"
        @show-popup="handleShowPopup"
      />
    </div>
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
    isRepost() {
      return this.item?.subType === 'repost';
    },
    isMention() {
      return this.item?.subType === 'mention';
    },
    postItem() {
      if (this.isRepost) {
        return this.item.parent;
      }

      return this.item;
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
      } else if (this.isMention) {
        this.socialStore.showMentionPopup(this.item, this.item.parent);
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

<template>
  <client-only>
    <PostsPopup v-if="socialStore.postPopup" @delete="handleDelete" />
    <PostsItemMentionPopup
      v-if="socialStore.mentionPopup"
      @delete="handleDelete"
    />
    <PostsItemReactSelect v-if="socialStore.reactSelect" />
  </client-only>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  methods: {
    handleDelete(item) {
      this.$emit('delete', item);
    },
  },
};
</script>

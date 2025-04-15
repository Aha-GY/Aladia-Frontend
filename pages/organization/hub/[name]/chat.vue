<template>
  <OrganizationHubChat
    class="h-[calc(100vh-8rem)]"
    data-cy="organization-hub-chat-page-1"
  />
  <client-only>
    <PostsPopup v-if="socialStore.postPopup" />
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

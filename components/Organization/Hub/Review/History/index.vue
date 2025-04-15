<template>
  <div
    class="relative mt-1 flex flex-col gap-2 text-[#D9D9D9]"
    :class="
      hubReviewStore.open ? 'h-[calc(100vh-25rem)]' : 'h-[calc(100vh-10rem)]'
    "
  >
    <OrganizationHubReviewHistoryHeader />
    <client-only>
      <OrganizationHubReviewHistoryTable />
    </client-only>
    <BasePagination
      :total="hubReviewStore.total"
      :params="hubReviewStore.params"
    />
    <PostsDetail @delete="handleDelete" @hide="handleDelete" />
  </div>
</template>

<script>
export default {
  setup() {
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore };
  },
  methods: {
    handleDelete() {
      this.hubReviewStore.getPosts(this.hubReviewStore.tableQuery);
    },
  },
};
</script>

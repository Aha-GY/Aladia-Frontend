<template>
  <BaseTable
    v-loading="loading"
    class="h-0 flex-1"
    :border="true"
    :data="reviews"
    default-expand-all
  >
    <el-table-column width="380">
      <template #header>
        <OrganizationHubReviewHistoryTitleCourses />
      </template>
      <template #default="scope">
        <OrganizationHubReviewHistoryListCourses :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="160">
      <template #header>
        <OrganizationHubReviewHistoryTitleStatus />
      </template>
      <template #default="scope">
        <OrganizationHubReviewHistoryListStatus :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="130">
      <template #header>
        <OrganizationHubReviewHistoryTitleRate />
      </template>
      <template #default="scope">
        <BaseStars :value="scope.row.rating" />
      </template>
    </el-table-column>
    <el-table-column width="140">
      <template #header>
        {{ $t('filter.review.title') }}
      </template>
      <template #default="scope">
        <OrganizationHubReviewHistoryListTitle :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column :resizable="false">
      <template #header>
        <div class="truncate">
          {{ $t('filter.review.desc') }}
        </div>
      </template>
      <template #default="scope">
        <OrganizationHubReviewHistoryListDescription :item="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="160" :resizable="false">
      <template #header><OrganizationHubReviewHistoryTitleFrom /></template>
      <template #default="scope">
        <OrganizationHubReviewHistoryListFrom :item="scope.row" />
      </template>
    </el-table-column>
  </BaseTable>
</template>

<script>
export default {
  setup() {
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore };
  },
  computed: {
    index() {
      return this.hubReviewStore.index;
    },
    reviews() {
      return this.hubReviewStore.reviews2;
    },
    loading() {
      return this.hubReviewStore.loading;
    },
  },
  watch: {
    // 'hubReviewStore.params': {
    //   handler() {
    //     this.hubReviewStore.getPosts();
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    'hubReviewStore.tableQuery': {
      handler(val) {
        this.hubReviewStore.getPosts(val);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.hub-table {
  :deep(td.el-table__cell) {
    &:nth-child(2),
    &:nth-child(3) {
      border-bottom-color: transparent !important;
    }
  }
}
</style>

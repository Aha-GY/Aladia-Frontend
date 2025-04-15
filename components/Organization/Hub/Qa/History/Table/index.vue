<template>
  <div>
    <BaseTable
      v-loading="loading"
      class="mb-4 flex-1"
      :border="true"
      :data="questions.data"
    >
      <el-table-column v-if="!hubQaStore.filter == 'feed'" width="280">
        <template #header>
          {{ $t('nav.header.search.menu.courses') }}
        </template>
        <template #default="scope">
          <OrganizationHubQaHistoryListCourses :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template #header>
          {{ $t('nav.header.search.menu.question') }}
        </template>
        <template #default="scope">
          <OrganizationHubQaHistoryListQuestion :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template #header>
          {{ $t('category.transaction.status') }}
        </template>
        <template #default="scope">
          <OrganizationHubQaHistoryListStatus :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column>
        <template #header>
          {{ $t('course.question.title') }}
        </template>
        <template #default="scope">
          <OrganizationHubReviewHistoryListDescription :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column width="200">
        <template #header>
          {{ $t('nav.header.search.menu.user') }}
        </template>
        <template #default="scope">
          <OrganizationHubQaHistoryListFrom :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column width="80">
        <template #header>
          {{ $t('nav.header.search.menu.replies') }}
        </template>
        <template #default="scope">
          <OrganizationHubQaHistoryListReplies :item="scope.row" />
        </template>
      </el-table-column>
      <el-table-column width="190" :resizable="false">
        <template #header>
          {{ $t('nav.header.search.menu.participants') }}
        </template>
        <template #default="scope">
          <OrganizationHubQaHistoryListPartecipants
            :item="scope.row"
            @delete="(item) => $emit('delete', item)"
          />
        </template>
      </el-table-column>
    </BaseTable>
    <BasePagination
      class="justify-end"
      :cursor="questions.cursor"
      @change="onChange"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const hubQaStore = useHubQaStore();
    return { hubQaStore };
  },
  computed: {
    questions() {
      return this.hubQaStore.questions;
    },
    loading() {
      return this.hubQaStore.questionsLoading;
    },
  },
  methods: {
    onChange({ type, token }) {
      this.hubQaStore.getPosts({
        [type]: token,
      });
    },
  },
};
</script>

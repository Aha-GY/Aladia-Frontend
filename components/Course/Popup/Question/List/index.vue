<template>
  <div class="relative flex-1">
    <div class="absolute h-full w-full">
      <BaseTable
        v-loading="loading"
        row-key="id"
        :data="data"
        class="question-table h-96 min-h-96"
        :scrollbar-always-on="false"
        @row-click="onRowClick"
      >
        <template #empty>
          <BaseNoData class="pt-12" />
        </template>
        <el-table-column width="200">
          <template #header>
            <div>{{ $t('course.question.title') }}</div>
          </template>
          <template #default="scope">
            <OrganizationHubReviewHistoryListDescription :item="scope.row" />
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <div>{{ $t('course.question.status.title') }}</div>
          </template>
          <template #default="scope">
            <div class="flex items-center gap-2">
              <div class="size-3 rounded-full bg-[#ebd55a]" />
              <div>{{ getStatus(scope.row.status) }}</div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column>
        <template #header>
          <div>Rate</div>
        </template>
        <template #default="scope">
          {{ scope.row.rate }}
        </template>
      </el-table-column> -->
        <el-table-column>
          <template #header>
            <div>{{ $t('course.question.owner') }}</div>
          </template>
          <template #default="scope">
            <div class="flex items-center gap-3">
              <BaseAvatarNext
                :show-online="false"
                :picture="scope.row.owner.picture"
                size="sm"
              />
              <div>
                {{ scope.row.owner.name }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template #header>
            <div>{{ $t('course.question.date') }}</div>
          </template>
          <template #default="scope">
            <div class="flex items-center gap-3">
              {{ formatDate(scope.row.createdAt, 'DD MMM YYYY') }}
              <div
                class="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-white/10"
              >
                <i class="fa-solid fa-ellipsis" />
              </div>
            </div>
          </template>
        </el-table-column>
      </BaseTable>
      <BasePagination class="justify-end" :cursor="cursor" @change="onChange" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    const courseStore = useCourseStore();
    return { courseStore, socialStore };
  },
  computed: {
    loading() {
      return this.courseStore.question.loading;
    },
    data() {
      return this.courseStore.question.data;
    },
    cursor() {
      return this.courseStore.question.cursor;
    },
  },
  mounted() {
    this.courseStore.getQuestions();
  },
  methods: {
    onChange({ type, token }) {
      console.log(type, token);
    },
    getStatus(status) {
      return status.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    },
    onRowClick(row) {
      this.socialStore.postItem = row;
      this.socialStore.postPopup = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.question-table {
  :deep(.el-table__row) {
    .el-table__cell {
      cursor: pointer;
    }
  }
}
</style>

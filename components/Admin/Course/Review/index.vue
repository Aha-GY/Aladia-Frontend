<template>
  <div class="mb-36 px-8 pt-4">
    <el-table
      v-loading="loading"
      border
      :data="courses.data"
      class-name="min-h-96 w-full"
    >
      <el-table-column :label="$t('course.label')" width="300">
        <template #default="scope">
          <div
            class="cursor-pointer underline underline-offset-1"
            @click="handleNavigationCourseDetail(scope.row)"
          >
            {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('course.thumbnail.name')" width="110">
        <template #default="scope">
          <BaseCourseThumbnail class="h-12" :url="scope.row.thumbnail?.url" />
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <div
            class="relative flex shrink-0 items-center gap-2"
            @click="handleNavigationProfile(scope.row.owner?.id)"
          >
            <BaseAvatarNext
              :picture="scope.row.owner?.picture"
              :user-id="scope.row.owner?.id"
              :online="scope.row.owner?.online"
              :story="scope.row.owner?.story"
              size="sm"
              class="shrink-0"
            />
            <p class="cursor-pointer hover:underline">
              {{ scope.row.owner?.name }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #default="scope">
          <div class="flex items-center justify-end">
            <div class="mr-2">
              <AdminCourseReviewBtn :course="scope.row" />
            </div>
            <el-button
              size="small"
              data-cy="bec8b0aad39fcf62"
              @click="handleCourseReviewPublish(scope.row)"
            >
              {{ $t('admin.course.publish') }}
            </el-button>
            <el-button
              size="small"
              type="danger"
              data-cy="6d9f77105932be8d"
              @click="handleCourseReviewReject(scope.row)"
            >
              {{ $t('admin.course.reject') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex items-center justify-end border-t border-white/20 pt-4">
      <BasePagination :cursor="courses.cursor" @change="onChange" />
    </div>
  </div>
</template>

<script>
import { ElMessageBox } from 'element-plus';

export default {
  setup() {
    const adminStore = useAdminStore();
    const hubSidebar = useHubSidebarStore();
    return { adminStore, hubSidebar };
  },
  data() {
    return {
      loading: true,

      courses: {
        cursor: null,
        data: [],
        histogram: null,
      },

      next: null,
      prev: null,
    };
  },
  watch: {
    'hubSidebar.course.state'(value) {
      if (!value) {
        this.hubSidebar.state = false;
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.next = null;
      this.prev = null;
      this.load();
    },
    async load(params = {}) {
      this.loading = true;
      const {
        data,
        cursor: { prev, next, totalItems },
      } = await this.adminStore.getCoursesSearchVerifying({
        limit: 10,
        ...params,
      });
      this.next = params.next;
      this.prev = params.prev;
      this.courses.data = data;
      this.courses.cursor = { prev, next, totalItems };
      this.loading = false;
    },
    onChange({ type, token }) {
      this.load({
        [type]: token,
      });
    },
    async handleCourseReviewPublish(row) {
      await ElMessageBox.confirm(
        `${row.title} ${this.$t('admin.course.published')}`,
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          cancelButtonText: 'No',
        },
      );

      await this.adminStore.reviewCourse({
        id: row.id,
        status: 'published',
      });
      await this.load({
        next: this.next,
        prev: this.prev,
      });
    },
    async handleCourseReviewReject(row) {
      await ElMessageBox.confirm(
        `${row.title} ${this.$t('admin.course.rejected')}`,
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          cancelButtonText: 'No',
        },
      );
      await this.adminStore.reviewCourse({
        id: row.id,
        status: 'rejected',
      });
      await this.load({
        next: this.next,
        prev: this.prev,
      });
    },
    async handleNavigationCourseDetail(course) {
      this.hubSidebar.course.state = false;
      this.hubSidebar.state = false;
      await this.$nextTick();
      this.hubSidebar.course.data = course;
      this.hubSidebar.course.state = true;
      this.hubSidebar.state = true;
      this.$router.push(`/courses/${course.id}`);
    },
    handleNavigationProfile(userId) {
      this.$router.push(`/profile/${userId}`);
    },
  },
};
</script>

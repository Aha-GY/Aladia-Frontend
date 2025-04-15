<template>
  <div class="h-[60vh] flex-1 overflow-hidden overflow-y-scroll">
    <BaseNoData v-if="!data?.length" class="pt-36" />
    <template v-else>
      <template v-for="item in data" :key="item.id || index">
        <template v-if="item.type === 'hidden'">
          <BaseHidden
            :label="$t('post.reel.hidden.label')"
            :title="$t('post.reel.hidden.content')"
            @undo="undo(item.id)"
          />
        </template>

        <PostsItem
          v-else
          :item="item"
          class="mb-5 last:mb-0"
          @delete="onDelete"
          @hide="onDelete"
        />
      </template>
      <div v-show="loading">
        <PostsSkeleton v-for="n in 3" :key="n" class="mb-5 last:mb-0" />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    const socialStore = useSocialStore();
    const authStore = useAuthStore();
    return { courseStore, socialStore, authStore };
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
    onRowClick(row) {
      this.socialStore.postItem = row;
      this.socialStore.postPopup = true;
    },
    onDelete(item) {
      this.courseStore.deleteQuestion(item);
    },
    async undo(postId) {
      await this.socialStore.unHidePost({
        userId: this.authStore.context,
        postId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.review-table {
  :deep(.el-table__row) {
    .el-table__cell {
      cursor: pointer;
    }
  }
}
</style>

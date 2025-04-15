<template>
  <div class="pt-4">
    <CoursePopupReviewHeader />
    <div class="flex gap-4">
      <CoursePopupReviewState />
      <CoursePopupReviewGrid v-if="review.view === 'grid'" />
      <CoursePopupReviewList v-if="review.view === 'list'" />
    </div>
    <PostsCreation type="review" @send="handleCreated" />
    <PostsDetail @delete="handleDelete" @hide="handleDelete" />
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    review() {
      return this.courseStore.review;
    },
  },
  methods: {
    handleCreated() {
      this.courseStore.refreshReviews();
    },
    handleDelete(item) {
      this.courseStore.deleteReview(item);
    },
  },
};
</script>

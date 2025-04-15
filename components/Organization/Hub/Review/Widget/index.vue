<template>
  <div
    class="relative flex items-center gap-1.5 text-[#D9D9D9] transition-all duration-300"
    :class="hubReviewStore.open ? 'h-[15.3125rem]' : 'h-0 opacity-0'"
  >
    <OrganizationHubReviewWidgetRate />
    <OrganizationHubReviewWidgetRank
      v-loading="hubReviewStore.reviewsRankingLoading"
    />
    <!-- <OrganizationHubReviewWidgetReview
      v-loading="hubReviewStore.reviewsReviewLoading"
    /> -->
  </div>
</template>

<script>
export default {
  setup() {
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore };
  },
  mounted() {
    this.hubReviewStore.getReviewsRating();
    this.hubReviewStore.getReviewsRank();
    // this.hubReviewStore.getReviewOverview();
  },
};
</script>

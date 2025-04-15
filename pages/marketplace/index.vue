<template>
  <NuxtLayout>
    <Head>
      <Title>
        {{ $t('course.recorded') }}
      </Title>
    </Head>
    <div class="relative z-10 pb-6">
      <MarketHeader />
      <MarketSubCategory v-if="isSubCategory" />
      <MarketCategory v-else-if="isCategory" />
      <MarketSearch v-else-if="isSearch" />
      <MarketCommon v-else />
    </div>
    <MarketCardFloat v-if="marketStore.floatCourse" />
  </NuxtLayout>
</template>

<script>
export default {
  setup() {
    const marketStore = useMarketStore();
    return { marketStore };
  },
  computed: {
    isSubCategory() {
      return this.$route.query?.subCategoryId;
    },
    isCategory() {
      return this.$route.query?.categoryId;
    },
    isSearch() {
      const { query } = this.$route;
      return (
        query.title ||
        query.minCost ||
        query.maxCost ||
        query.minDuration ||
        query.maxDuration ||
        query.languageIds ||
        query.startDate ||
        query.endDate ||
        query.skills
      );
    },
  },
  beforeUnmount() {
    this.marketStore.$reset();
  },
};
</script>

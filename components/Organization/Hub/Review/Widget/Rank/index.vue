<template>
  <div
    class="group/item relative flex h-full w-0 flex-1 flex-col rounded-md bg-black/60 p-4 backdrop-blur"
  >
    <div
      class="mb-2 flex items-center justify-between border-b border-white/15 pb-2 pr-2 group-hover/item:border-transparent"
    >
      <div class="flex items-end gap-1">
        <div class="text-lg font-semibold opacity-80">
          {{ $t('course.rank.label') }}
        </div>
        <div class="text-base font-light text-white/30">
          {{ $t('course.rank.best') }}
        </div>
      </div>
      <div
        v-if="
          hubReviewStore.reviewFilter === 'all' &&
          hubReviewStore.courseId === null
        "
        class="group/sort flex cursor-pointer items-center justify-center gap-3 rounded-md p-1.5 transition-all hover:bg-white/5 active:scale-95"
        data-cy="f920cd41a98de000"
        @click="sort = !sort"
      >
        <div
          class="text-xs opacity-0 transition-all group-hover/sort:opacity-100"
        >
          {{
            reviewType !== 'Negative'
              ? $t('course.rank.see.best')
              : $t('course.rank.see.worst')
          }}
        </div>
        <i
          class="fa-solid fa-arrow-up-arrow-down text-xs"
          :class="
            reviewType !== 'Negative'
              ? 'group-hover/sort:text-[#FDCC1E]'
              : 'group-hover/sort:text-[#B31414]'
          "
        />
      </div>
      <div
        v-if="hubReviewStore.courseId"
        class="flex cursor-pointer items-center gap-3 rounded-md p-1.5 text-xs text-[#707070] transition-all hover:bg-white/5 active:scale-95"
        data-cy="fe9a145fc20ce4ba"
        @click="hubReviewStore.courseId = null"
      >
        <i class="fa-light fa-rotate-left" />
        {{ $t('course.rank.reset') }}
      </div>
    </div>

    <div class="flex h-0 flex-1 flex-col gap-1 overflow-y-auto">
      <OrganizationHubReviewWidgetRankItem
        v-for="(item, index) in filterList"
        :key="item.id"
        :index="index + 1"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore };
  },
  data() {
    return {
      sort: false,
    };
  },
  computed: {
    dataList() {
      return this.hubReviewStore.reviews.reviews;
    },
    filterList() {
      return (this.dataList || []).sort((a, b) =>
        this.sort ? a.rating - b.rating : b.rating - a.rating,
      );
    },
    // filterList() {
    //   const isSort = (item) =>
    //     this.hubReviewStore.reviewFilter === 'all' ||
    //     Math.floor(item.rating) === this.hubReviewStore.reviewFilter;
    //   const isPositive = (item) =>
    //     this.hubReviewStore.reviewType === 'Positive' && item.rating >= 3;
    //   const isNegative = (item) =>
    //     this.hubReviewStore.reviewType === 'Negative' && item.rating < 3;
    //   const isAll = (item) =>
    //     this.hubReviewStore.reviewType === 'Total' ||
    //     isPositive(item) ||
    //     isNegative(item);
    //   return this.dataList
    //     .filter((item) => isSort(item) && isAll(item))
    //     .sort((a, b) =>
    //       this.sort ? a.rating - b.rating : b.rating - a.rating,
    //     );
    // },
    reviewType() {
      return this.hubReviewStore.reviewType;
    },
  },
};
</script>
<style lang="scss" scoped>
.box-white {
  box-shadow:
    0px 0px 5px white,
    0px 0px 5px white,
    0px 0px 5px white,
    0px 0px 5px white;
}
</style>

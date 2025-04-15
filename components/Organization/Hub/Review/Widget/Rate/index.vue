<template>
  <div
    class="group/item relative h-full w-[32rem] rounded-md bg-black/60 p-4 backdrop-blur"
  >
    <div
      v-if="hubReviewStore.courseId"
      class="mb-2 flex items-center justify-between border-b border-white/15 pb-2 pr-2 group-hover/item:border-transparent"
    >
      <div class="flex h-7 items-center gap-1">
        <div class="truncate text-base font-semibold text-white/70">
          {{ selectCourseItem?.title || '---' }}
        </div>
        <div class="text-sm font-light text-white/50">
          {{ $t() }}
        </div>
      </div>
    </div>

    <div
      v-else
      class="mb-2 flex items-center justify-between border-b border-white/15 pb-2 pr-2 group-hover/item:border-transparent"
    >
      <div class="flex items-center gap-1">
        <div class="text-lg font-semibold opacity-80">
          {{ $t('filter.rate') }}
        </div>
        <div class="text-base font-light text-white/30">
          {{ $t('filter.chart.label') }}
        </div>
      </div>
      <div
        v-if="hubReviewStore.reviewFilter === 'all'"
        class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-all hover:bg-white/5 active:scale-95"
      >
        All
        <i class="fa-solid fa-grid-2" />
      </div>
      <div
        v-else
        class="flex cursor-pointer items-center gap-3 rounded-md p-1.5 text-xs text-[#707070] transition-all hover:bg-white/5 active:scale-95"
        data-cy="d50764b8faea90b3"
        @click="hubReviewStore.reviewFilter = 'all'"
      >
        <i class="fa-light fa-rotate-left" />
        Reset
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div class="relative h-[8rem] w-[15.625rem]">
        <OrganizationHubReviewWidgetRateChart />
        <div
          ref="dot"
          class="pointer-events-none absolute bottom-0 left-2.5 flex h-[0.0625rem] w-[0.0625rem] items-center justify-center"
          :style="{
            transform: `rotate(${(rating.average / 5) * 180}deg)`,
            transformOrigin: `7.1875rem 0rem`,
          }"
        >
          <div
            class="box-white h-2.5 w-2.5 shrink-0 translate-x-1 rounded-full border-2 border-black/50 bg-white"
          />
        </div>
        <div
          class="pointer-events-none absolute top-14 w-full text-center font-semibold leading-none"
        >
          <div class="mb-2 text-[2.5rem] text-white/80">
            {{ rating.average }}
          </div>
          <div class="text-sm text-white/50">Global rate</div>
        </div>
      </div>
      <div class="flex w-[12.5rem] flex-col gap-1 p-2 pt-4">
        <div
          v-for="(item, index) in rateCount"
          :key="index"
          class="flex cursor-pointer items-center gap-1.5 transition-all hover:gap-1"
          :class="[
            hubReviewStore.reviewFilterHover === `${5 - index}` ? 'gap-1' : '',
            hubReviewStore.reviewFilter !== 'all' &&
            hubReviewStore.reviewFilter !== `${5 - index}`
              ? 'opacity-30'
              : '',
            rateClass(5 - index),
          ]"
          data-cy="8271f171a439694c"
          @mouseenter="hubReviewStore.reviewFilterHover = `${5 - index}`"
          @mouseleave="hubReviewStore.reviewFilterHover = `all`"
          @click="onChange(`${5 - index}`)"
        >
          <div class="w-4 text-center text-sm transition-all">
            {{ 5 - index }}
          </div>

          <i class="fa-solid fa-star text-10 text-[#FDCC1E]" />
          <div
            class="h-1.5 flex-1 overflow-hidden rounded-md bg-white/10 transition-all active:scale-95"
          >
            <div
              class="transition-width h-full w-0 rounded-md bg-[#FDCC1E] duration-300"
              :style="{ width: `${item}%` }"
            />
          </div>
          <div class="w-8 text-center text-xs transition-all">
            <span v-if="max">
              {{ `${item}%` }}
            </span>
            <span v-else>0%</span>
          </div>
        </div>
      </div>
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
      // rating: {
      //   average: 4.17,
      // }
    };
  },
  computed: {
    rating() {
      return this.hubReviewStore.reviews.rating;
    },
    rateCount() {
      const { rateCount } = this.rating;
      if (Object.keys(rateCount).length) {
        return [
          rateCount['fiveStar'],
          rateCount['fourStar'],
          rateCount['threeStar'],
          rateCount['twoStar'],
          rateCount['oneStar'],
        ];
      } else {
        return [0, 0, 0, 0, 0];
      }
    },
    max() {
      return Math.max(...this.rateCount);
    },
    hover() {
      return this.hubReviewStore.reviewFilterHover;
    },
    reviewType() {
      return this.hubReviewStore.reviewType;
    },
    selectCourseItem() {
      if (!this.hubReviewStore.courseId) {
        return null;
      }

      return this.hubReviewStore.reviews.reviews.find(
        (item) => item.id === this.hubReviewStore.courseId,
      );
    },
  },
  methods: {
    rateClass(index) {
      if (this.reviewType === 'Positive') {
        return index >= 3 ? '' : 'opacity-30';
      }
      if (this.reviewType === 'Negative') {
        return index < 3 ? '' : 'opacity-30';
      }
      return '';
    },
    onChange(index) {
      this.hubReviewStore.reviewFilter =
        this.hubReviewStore.reviewFilter === index ? 'all' : index;
    },
  },
};
</script>
<style lang="scss" scoped>
.box-white {
  box-shadow:
    0rem 0rem 0.3125rem white,
    0rem 0rem 0.3125rem white,
    0rem 0rem 0.3125rem white,
    0rem 0rem 0.3125rem white;
}
</style>

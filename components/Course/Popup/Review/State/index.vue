<template>
  <div class="w-80 overflow-hidden">
    <div class="relative z-0 mb-10 flex justify-center">
      <div
        class="relative flex h-[10rem] w-[20rem] items-center justify-center"
      >
        <CoursePopupReviewStateChart />
        <div
          ref="dot"
          class="pointer-events-none absolute bottom-0 left-[3px] flex h-[1px] w-[1px] items-center justify-center"
          :style="{
            transform: `rotate(${(rating / 5) * 180}deg)`,
            transformOrigin: `9.8rem 0px`,
          }"
        >
          <div
            class="size-3 shrink-0 translate-x-[3px] rounded-full border-2 border-black/30 bg-white"
          />
        </div>
      </div>
      <div
        class="pointer-events-none absolute top-16 w-full text-center leading-none"
      >
        <div class="mb-3 text-[3.5rem] font-medium text-white">
          {{ rating.toFixed(1) }}
        </div>
        <div class="flex justify-center text-base font-light text-white/70">
          ({{ total }} {{ $t('course.review.title.upper') }} )
        </div>
      </div>
    </div>
    <div class="relative z-10 flex w-full flex-col gap-2 px-2">
      <div
        v-for="(item, index) in ratings"
        :key="index"
        class="flex cursor-pointer items-center gap-3 transition-all"
        data-cy="f43f917c3c9517a4"
        @mouseenter="review.hover = 5 - index"
        @mouseleave="review.hover = 0"
        @click="review.rating = 5 - index"
      >
        <div
          class="w-2 text-center text-sm transition-all"
          :class="
            review.rating === 5 - index || review.hover === 5 - index
              ? 'scale-125'
              : ''
          "
        >
          {{ 5 - index }}
        </div>
        <i
          class="fa-solid fa-star text-xs text-[#f5ce4c] transition-all"
          :class="
            review.rating === 5 - index || review.hover === 5 - index
              ? 'scale-125'
              : ''
          "
        />
        <div
          class="h-1.5 flex-1 overflow-hidden rounded-md bg-white/10 transition-all active:scale-95"
          :class="
            review.rating === 5 - index || review.hover === 5 - index
              ? 'scale-y-125'
              : ''
          "
        >
          <div
            class="h-full rounded-md bg-[#f5ce4c]"
            :style="{ width: `${item}%` }"
          />
        </div>
        <div
          class="w-11 text-center text-xs transition-all"
          :class="
            review.rating === 5 - index || review.hover === 5 - index
              ? 'scale-125'
              : ''
          "
        >
          <span v-if="total">{{ `${item}%` }}</span>
          <span v-else>0%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    review() {
      return this.courseStore.review;
    },
    rating() {
      return this.course.review.globalRating;
    },
    ratings() {
      return this.course.review.ratings
        .map((item) => item.percentage)
        .reverse();
    },
    total() {
      return this.course.review.totalReviews;
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

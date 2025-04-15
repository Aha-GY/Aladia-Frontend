<template>
  <div
    class="flex cursor-pointer items-center gap-2 rounded-md p-1.5 transition-all hover:bg-white/5"
    :class="[
      hubReviewStore.courseId && hubReviewStore.courseId !== item.id
        ? 'opacity-30'
        : '',
      hubReviewStore.courseId === item.id ? 'bg-white/5' : '',
    ]"
    data-cy="16d1e87b7b99eab0"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="hubReviewStore.courseId = item.id"
  >
    <div
      class="flex w-5 items-center justify-center"
      :class="
        index <= 3
          ? colorClass + 'text-sm font-semibold'
          : 'text-xs font-medium text-white/70'
      "
    >
      {{ index }}
    </div>
    <div class="flex w-0 flex-1 items-center gap-2">
      <div
        class="flex h-5 w-8 shrink-0 items-center justify-center rounded-md bg-white/5"
      >
        <BaseCourseThumbnail class="h-full w-full" :url="item.signedUrl" />
      </div>
      <div class="texs-base truncate font-medium leading-5">
        {{ item.title || '---' }}
      </div>
      <div
        v-if="item.amountOfReviews"
        class="shrink-0 text-xs italic text-white/30"
      >
        {{ item.amountOfReviews }} {{ $t('course.review.title.lower') }}
      </div>
    </div>
    <div class="flex items-center gap-0.5">
      <div
        class="flex w-6 items-center justify-center"
        :class="
          index <= 3
            ? colorClass + 'text-sm font-semibold'
            : 'text-xs font-medium text-white/70'
        "
      >
        {{ item.rating }}
      </div>
      <i
        v-show="hubReviewStore.courseId === item.id || hover"
        class="fa-solid fa-star text-10 text-[#FDCC1E]"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 1,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore };
  },
  data() {
    return {
      hover: false,
      // rating: {
      //   average: 4.17,
      // }
    };
  },
  computed: {
    reviewType() {
      return this.hubReviewStore.reviewType;
    },
    colorClass() {
      return this.reviewType !== 'Negative'
        ? 'text-[#FDCC1E]'
        : 'text-[#B31414]';
    },
  },
};
</script>

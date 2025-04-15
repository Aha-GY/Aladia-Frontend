<template>
  <div
    class="relative flex h-full w-[19.125rem] items-center rounded-md bg-black/60 p-3 backdrop-blur"
  >
    <div
      class="relative h-[13.375rem] w-[13.375rem]"
      :class="reviewType !== 'Total' ? 'pointer-events-none' : ''"
    >
      <OrganizationHubReviewWidgetReviewChart
        :index="hoverIndex"
        :data="charProportion"
      />
      <div
        class="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-2"
      >
        <div class="text-[1.625rem] font-bold text-white/80">
          {{ reviewCount }}
        </div>
        <div class="text-sm text-white/50">
          {{ reviewType }} {{ $t('filter.review.label') }}
        </div>
      </div>
    </div>
    <div class="absolute right-6 top-3">
      <div
        class="flex items-center gap-1 rounded-md p-1.5 transition-all"
        :class="reviewType !== 'Total' ? 'cursor-pointer hover:bg-white/5' : ''"
        data-cy="6e7102a1e9a94e17"
        @click="hubReviewStore.reviewType = 'Total'"
      >
        <div class="text-lg font-semibold text-white/80">
          {{ $t('course.header.review') }}
        </div>
        <div
          v-if="reviewType === 'Total'"
          class="text-sm font-light text-white/60"
        >
          {{ $t('filter.balance.label') }}
        </div>
        <div
          v-if="reviewType !== 'Total'"
          class="text-sm font-light text-white/50"
        >
          {{ $t('filter.undo') }}
        </div>
        <i
          v-if="reviewType !== 'Total'"
          class="fa-light fa-rotate-left ml-4 text-xs"
        />
      </div>
      <div class="mt-2 flex flex-col gap-1 pl-8">
        <div
          class="flex cursor-pointer items-center gap-2"
          :class="legendClass('Positive')"
          data-cy="d75506f82ad469a4"
          @mouseenter="hoverIndex = 0"
          @mouseleave="hoverIndex = null"
          @click="hubReviewStore.reviewType = 'Positive'"
        >
          <div class="h-2 w-2 rounded-full bg-[#42AC1D]" />
          <div class="text-xs font-medium text-[#42AC1D]">
            {{ $t('filter.positive') }}
          </div>
          <div
            class="ml-2 flex items-center gap-1 text-xs text-white/70 transition-all"
            :class="
              hoverIndex === 0 || reviewType === 'Positive'
                ? 'opacity-100'
                : 'opacity-0'
            "
          >
            <i class="fa-solid fa-star text-9 text-[#FDCC1E]" />
            &gt;= 3
          </div>
        </div>
        <div
          class="flex cursor-pointer items-center gap-2"
          :class="legendClass('Negative')"
          data-cy="eae5a47ed76699f9"
          @mouseenter="hoverIndex = 1"
          @mouseleave="hoverIndex = null"
          @click="hubReviewStore.reviewType = 'Negative'"
        >
          <div class="h-2 w-2 rounded-full bg-[#B31414]" />
          <div class="text-xs font-medium text-[#B31414]">
            {{ $t('filter.negative') }}
          </div>
          <div
            class="ml-2 flex items-center gap-1 text-xs text-white/70 transition-all"
            :class="
              hoverIndex === 1 || reviewType === 'Negative'
                ? 'opacity-100'
                : 'opacity-0'
            "
          >
            <i class="fa-solid fa-star text-9 text-[#FDCC1E]" />
            &lt; 3
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
      hoverIndex: null,
      // rating: {
      //   average: 4.17,
      // }
    };
  },
  computed: {
    reviewType() {
      return this.hubReviewStore.reviewType;
    },
    reviewSource() {
      return this.hubReviewStore.reviews.overview;
    },
    charProportion() {
      const positive = this.reviewSource?.positive || 0;
      const total = this.reviewSource?.total || 0;

      if (total === 0) {
        return [0, 0];
      }

      const positiveRate = ~~((positive / total) * 100);
      const negativeRate = 100 - positiveRate;

      return [positiveRate, negativeRate];
    },
    reviewCount() {
      if (this.reviewType === 'Positive') {
        return this.reviewSource?.positive || 0;
      }
      if (this.reviewType === 'Negative') {
        return this.reviewSource?.negative || 0;
      }
      return this.reviewSource?.total || 0;
    },
  },
  methods: {
    legendClass(name) {
      if (this.reviewType !== 'Total' && this.reviewType !== name) {
        return 'opacity-70';
      }

      return '';
    },
  },
};
</script>

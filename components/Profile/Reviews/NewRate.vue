<template>
  <div
    class="sticky top-[0rem] z-50 flex w-full flex-col items-center justify-between overflow-hidden px-2"
  >
    <div class="relative h-[10rem] w-[20rem]">
      <ProfileRateChart
        :hover-index="hoverIndex"
        :filter-index="filterIndex"
        :hover="onHover"
        :change="onChange"
      />
      <div
        ref="dot"
        class="pointer-events-none absolute bottom-0 left-[1rem] flex h-[1px] w-[1px] items-center justify-center"
        :style="{
          transform: `rotate(${(detail?.review?.globalRating / 5) * 180}deg)`,
          transformOrigin: `9rem 0px`,
        }"
      >
        <div
          class="box-white h-2.5 w-2.5 shrink-0 translate-x-1 rounded-full border-2 border-black/50 bg-white"
        />
      </div>
      <div
        class="pointer-events-none absolute top-[5rem] w-full text-center font-semibold leading-none"
      >
        <div class="text-[3.125rem] font-semibold text-white/80">
          {{ detail?.review?.globalRating?.toFixed(2) }}
        </div>
        <div class="mt-[1rem] text-xs text-[#D9D9D9]">
          ({{ detail.review?.totalReviews }}
          {{ $t('course.review.title.upper') }})
        </div>
      </div>
    </div>
    <div class="mt-2 flex w-full flex-1 flex-col gap-3 p-1.5">
      <div
        v-for="(item, index) in ratings"
        :key="index"
        class="flex h-6 cursor-pointer items-center gap-1.5 transition-all"
        :class="[filterIndex && filterIndex !== item.star ? 'opacity-30' : '']"
        data-cy="54d1b8127cbd12fb"
        @mouseenter="hoverIndex = item.star"
        @mouseleave="hoverIndex = null"
        @click="onChange(item.star)"
      >
        <div
          class="w-4 text-center font-semibold text-white/80 transition-all"
          :class="[hoverIndex === item.star ? 'text-base' : 'text-sm']"
        >
          {{ item.star }}
        </div>

        <i class="fa-solid fa-star text-10 text-[#FDCC1E]" />

        <div
          class="h-1.5 w-0 flex-1 overflow-hidden rounded-md bg-white/10 transition-all"
        >
          <div
            v-if="item.percentage !== 0"
            class="h-full rounded-md bg-[#FDCC1E]"
            :style="{ width: `${item.percentage}%` }"
          />
        </div>
        <div
          class="w-8 text-center transition-all"
          :class="[
            hoverIndex === item.star
              ? 'text-sm text-[#FFFFFF]/80'
              : 'text-xs text-[#FFFFFF]/60',
          ]"
        >
          {{ `${item.percentage}%` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['change']);
const hoverIndex = ref(null);
const filterIndex = ref(null);

const ratings = computed(() => {
  const reviews = props.detail.review;
  return reviews?.ratings ? [...reviews.ratings].reverse() : [];
});
const onChange = (index) => {
  filterIndex.value = index === filterIndex.value ? null : index;
  emit('change', filterIndex.value);
};
const onHover = (index) => {
  hoverIndex.value = index;
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

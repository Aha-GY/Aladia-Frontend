<template>
  <ProfileBox>
    <div class="mb-6 flex items-center justify-between">
      <div class="text-base font-medium text-[#B0B0B0]">
        {{ $t('course.rate.course') }}
      </div>
      <ProfileViewMore
        v-if="props.position === 'about'"
        data-cy="c01552ca6b2a0ea6"
        @click="$emit('goTab', 6)"
      />
      <div
        v-else
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
      >
        <i class="fa-light fa-refresh text-[#707070]" />
      </div>
    </div>
    <div
      class="flex items-center justify-between"
      :class="{
        'flex-col': props.position !== 'about',
        'flex-row': props.position === 'about',
      }"
    >
      <div class="relative mx-3 h-[8.75rem] w-[17.5rem]">
        <ProfileRateChart
          :hover-index="hoverIndex"
          :filter-index="filterIndex"
          :hover="onHover"
          :change="onChange"
        />
        <div
          ref="dot"
          class="pointer-events-none absolute bottom-0 left-2 flex h-[1px] w-[1px] items-center justify-center"
          :style="{
            transform: `rotate(${(detail?.review?.globalRating / 5) * 180}deg)`,
            transformOrigin: `133px 0px`,
          }"
        >
          <div
            class="box-white h-2.5 w-2.5 shrink-0 translate-x-1 rounded-full border-2 border-black/50 bg-white"
          />
        </div>
        <div
          class="pointer-events-none absolute top-14 w-full text-center font-semibold leading-none"
        >
          <div class="text-[3.125rem] font-semibold text-white/80">
            {{ detail?.review?.globalRating?.toFixed(2) }}
          </div>
          <div
            class="font-inter flex items-center justify-center text-[0.875rem] font-light leading-[0.75rem] text-[#D9D9D9]"
          >
            (10 {{ $t('org.rate.reviews') }})
          </div>
        </div>
      </div>
      <div
        class="mt-1.5 flex w-full flex-1 flex-col p-1.5"
        :class="`${position === 'about' ? 'gap-3' : 'gap-6'}`"
      >
        <div
          v-for="(item, index) in ratings"
          :key="index"
          class="flex h-6 cursor-pointer items-center gap-1.5 transition-all"
          :class="[
            filterIndex && filterIndex !== item.star ? 'opacity-30' : '',
          ]"
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
  </ProfileBox>
</template>

<script setup>
const props = defineProps({
  position: {
    type: String,
    default: '',
  },
  detail: {
    type: Object,
    required: true,
  },
});
defineEmits(['goTab']);
const hoverIndex = ref(null);
const filterIndex = ref(null);

const ratings = computed(() => {
  const reviews = props.detail.review;
  return reviews?.ratings ? [...reviews.ratings].reverse() : [];
});
const onChange = (index) => {
  filterIndex.value = index;
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

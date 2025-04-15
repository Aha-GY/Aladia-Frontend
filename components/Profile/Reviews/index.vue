<template>
  <div class="relative w-full">
    <ProfileReviewsHeader from-type="reviews" @change="handleChangeFilter" />
    <div class="mt-10 flex w-full justify-between pb-[2rem]">
      <div class="mr-4 flex-1">
        <ProfileReviewsList
          v-if="filterObject.viewType === 'list'"
          :filter="filterObject"
          :owner-id="detail.id"
        />
        <ProfileReviewsGrid
          v-if="filterObject.viewType === 'grid'"
          :filter="filterObject"
          :owner-id="detail.id"
        />
      </div>
      <div class="w-[20rem] overflow-hidden">
        <ProfileReviewsNewRate :detail="chartData" @change="handleChangeRate" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { getQuestionsReviewsOverview } from '~/api/v2/analytics';
import { profileEvent } from '~/constant/eventBus';

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});
const { $eventBus } = useNuxtApp();
const filterObject = ref({});
const chartData = ref({
  review: {
    globalRating: 0,
    totalReviews: 0,
    ratings: [
      { star: 5, percentage: 0 },
      { star: 4, percentage: 0 },
      { star: 3, percentage: 0 },
      { star: 2, percentage: 0 },
      { star: 1, percentage: 0 },
    ],
  },
});
const handleChangeFilter = (data) => {
  filterObject.value = {
    ...filterObject.value,
    ...data,
  };
};
const handleChangeRate = (data) => {
  filterObject.value.rating = data;
};
const handleChartData = async () => {
  const res = await getQuestionsReviewsOverview({
    [filterObject.value.selectType === 'posted' ? 'reviewOwner' : 'userId']:
      props.detail.id,
    courseType: filterObject.value.courseType?.value,
    courseIds: filterObject.value.courses?.map((item) => item.id),
    startDate: filterObject.value.date?.startDate,
    endDate: filterObject.value.date?.endDate,
  });
  chartData.value = {
    review: {
      globalRating: res.average || 0,
      totalReviews: res.totalReviews || 0,
      ratings: [
        { star: 5, percentage: res.percentages.fiveStar || 0 },
        { star: 4, percentage: res.percentages.fourStar || 0 },
        { star: 3, percentage: res.percentages.threeStar || 0 },
        { star: 2, percentage: res.percentages.twoStar || 0 },
        { star: 1, percentage: res.percentages.oneStar || 0 },
      ],
    },
  };
};
onBeforeMount(() => {
  $eventBus.on(profileEvent.DELETE_PROFILE_QA_REVIEWS, initFetch);
});

onBeforeUnmount(() => {
  $eventBus.off(profileEvent.DELETE_PROFILE_QA_REVIEWS, initFetch);
});
const initFetch = () => {
  filterObject.value = {
    ...filterObject.value,
    i: new Date().getTime(),
  };
};
watch(
  () => filterObject.value,
  () => {
    handleChartData();
  },
  {},
);
</script>

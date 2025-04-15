<template>
  <div class="flex pb-24">
    <div class="w-0 flex-1">
      <ProfileCoursesHeader
        :profile-id="route.params.name"
        @change="onChangeHeaderParams"
      />
      <div class="relative flex flex-wrap bg-[#101010] pb-10 pt-5">
        <template v-if="loading">
          <MarketSkeletonCourse
            v-for="item in 10"
            :key="item"
            class="!w-full shrink-0 p-4 md:!w-1/2 lg:!w-1/2 xl:!w-1/3 2xl:!w-1/4"
          />
        </template>
        <template v-else-if="couresesList.length">
          <ProfileCoursesCourseItem
            v-for="course in couresesList"
            :key="course.id"
            :course="course"
          />
        </template>
        <div
          v-else
          class="col-span-12 flex w-full items-center justify-center pt-24"
        >
          <BaseNoData />
        </div>
      </div>
      <!-- <div class="flex justify-end">
        <BasePagination :cursor="paginationCursor" @change="onPageChange" />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { searchCourses } from '~/api/v2/course';

const route = useRoute();
const paginationCursor = ref({});
const loading = ref(true);
const couresesList = ref([]);
const onChangeHeaderParams = (params) => {
  getCoursesList(params);
};
// const onPageChange = (params) => {
//   console.log('--------------↓↓↓↓↓---------------------');
//   console.log(params);
//   console.log('--------------↑↑↑↑↑---------------------');
// };
const getCoursesList = async (params = {}) => {
  loading.value = true;
  const { data, cursor } = await searchCourses({
    limit: 0,
    profileId: route.params.name,
    ...params,
  });
  paginationCursor.value = cursor;
  couresesList.value = data;
  loading.value = false;
};
</script>

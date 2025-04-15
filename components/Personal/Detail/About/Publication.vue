<template>
  <ProfileBox>
    <div class="mb-2 flex h-7 items-center justify-between">
      <div class="text-base font-medium text-[#B0B0B0]">
        {{ $t('personal.application.list') }}
      </div>
      <ProfileViewMore data-cy="067b975d7a5edad0" @click="$emit('goTab', 3)" />
    </div>
    <MarketCardCourse
      v-if="couresesList.length"
      class="!w-full !p-0"
      :course="couresesList[0]"
      type="profile"
    />

    <BaseNoData v-else />
  </ProfileBox>
</template>

<script setup>
import { searchCourses } from '~/api/v2/course';

const route = useRoute();
const loading = ref(true);
const couresesList = ref([]);
const getCoursesList = async (params = {}) => {
  loading.value = true;
  const { data } = await searchCourses({
    limit: 1,
    profileId: route.params.name,
    ...params,
  });
  couresesList.value = data;
  loading.value = false;
};
getCoursesList({ enrollmentType: 'owner' });
</script>

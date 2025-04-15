<template>
  <div class="relative w-full">
    <ProfileAluminiHeader from-type="alumini" @change="handleChangeFilter">
      <template #left>
        <div class="flex items-center justify-between">
          <i class="fa-regular fa-graduation-cap text-xl text-[#b0b0b0]" />
          <span class="px-2 text-xl font-semibold text-[#b0b0b0]">
            {{ t('personal.alumini') }}
          </span>
          <span class="text-base font-medium text-[#989898]">
            {{ dataList.length || 0 }}
          </span>
        </div>
      </template>
    </ProfileAluminiHeader>
    <div class="mt-10 flex w-full justify-between pb-[2rem]">
      <ProfileAluminiList
        v-if="filterObject.viewType === 'list'"
        :filter="filterObject"
        :data="dataList"
        :loading="loading"
      />
      <ProfileAluminiGrid
        v-if="filterObject.viewType === 'grid'"
        :filter="filterObject"
        :data="dataList"
        :loading="loading"
      />

      <div
        v-if="!dataList.length && !loading"
        class="mt-[5rem] flex w-full items-center justify-center"
      >
        <BaseNoData />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

import { searchProfile } from '~/api/v2/profile';

const { t } = useI18n();

const profileStore = useProfileStore();
const detail = computed(() => profileStore.getOrganizationProfileDetail());
const filterObject = ref({});
const dataList = ref([]);
const loading = ref(false);

const getMembersList = async () => {
  try {
    if (loading.value) {
      return false;
    }
    dataList.value = [];
    loading.value = true;
    const { data } = await searchProfile({
      organizationId: detail.value.id,
      limit: 0,
      text: filterObject.value.search,
    });
    dataList.value = data;
  } finally {
    loading.value = false;
  }
};

const handleChangeFilter = (data) => {
  filterObject.value = {
    ...filterObject.value,
    ...data,
  };
  getMembersList();
};
</script>

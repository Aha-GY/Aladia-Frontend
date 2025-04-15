<template>
  <div class="w-full rounded-md bg-[#060606] p-4">
    <OrganizationDetailAboutCollaboratorsRow :length="collaboratorList.length">
      <template v-if="collaboratorList.length && !loading">
        <div v-for="user in collaboratorList" :key="user.id">
          <MarketCardUser class="!w-[13.4375rem]" :user="user" />
        </div>
      </template>
      <div
        v-if="!collaboratorList.length && !loading"
        class="flex h-[16.5rem] w-full items-center justify-center"
      >
        <BaseNoData />
      </div>

      <div
        v-if="loading"
        class="flex h-[16.5rem] w-full items-center justify-center"
      >
        <div v-loading="loading" class="!z-0" />
      </div>
    </OrganizationDetailAboutCollaboratorsRow>
  </div>
</template>

<script setup>
import { searchProfile } from '~/api/v2/profile';

const profileStore = useProfileStore();
const collaboratorList = ref([]);
const loading = ref(false);
const detail = computed(() => profileStore.getOrganizationProfileDetail());

const getMembersList = async () => {
  try {
    if (loading.value) {
      return false;
    }
    loading.value = true;
    const { data } = await searchProfile({
      organizationId: detail.value.id,
      limit: 0,
    });
    collaboratorList.value = data;
  } finally {
    loading.value = false;
  }
};

getMembersList();
</script>

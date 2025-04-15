<template>
  <ProfileBox>
    <PersonalDetailAboutTimelineHeader
      :data="experiencesStore.experiences"
      @change="handleChangeType"
    />
    <div
      v-loading="loading"
      class="flex min-h-60 w-full items-center justify-center"
    >
      <PersonalDetailAboutTimelineChart
        v-if="experiences.length"
        :data="experiences"
      />
      <BaseNoData v-if="!loading && !experiences.length" />
    </div>
  </ProfileBox>
</template>

<script setup>
const route = useRoute();
const experiencesStore = useExperiencesStore();
const loading = ref(true);

const getData = async () => {
  loading.value = true;
  await experiencesStore.getListExperience(route.params.name);
  loading.value = false;
};

onBeforeMount(() => {
  getData();
});

const actionsList = ref(['work', 'study', 'certificate']);
const handleChangeType = (actions) => {
  actionsList.value = actions;
};
const experiences = computed(() => {
  const dataList = [];
  experiencesStore.experiences.forEach((item) => {
    if (actionsList.value?.includes(item.type)) {
      dataList.push(item);
    }
  });
  return dataList;
});
</script>

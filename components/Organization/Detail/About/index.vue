<template>
  <FluxesHighlight :is-view="!isMe" is-org />
  <div class="flex gap-8 pb-24">
    <div class="flex w-[22.375rem] flex-col gap-4">
      <PersonalDetailAboutDescription from="org" />
      <OrganizationDetailAboutOwner />
      <OrganizationDetailAboutContacts />
    </div>
    <div class="flex w-0 flex-1 flex-col gap-4">
      <OrganizationDetailAboutCourses @go-tab="goTab" />
      <OrganizationDetailAboutCollaborators @go-tab="goTab" />
      <ProfileReviewsRate position="about" :detail="detail" @go-tab="goTab" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  goTab: {
    type: Function,
    default: () => {},
  },
});
const route = useRoute();
const marketStore = useMarketStore();
const profileStore = useProfileStore();
const detail = computed(() => profileStore.getOrganizationProfileDetail());
const isMe = computed(
  () => profileStore.myProfileDetail.id === detail.value.id,
);

onMounted(async () => {
  try {
    // Call the searchCourses action from marketStore
    await marketStore.searchCourses({
      limit: 0,
      profileId: route.params.name,
      enrollmentType: 'owner',
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
});
</script>

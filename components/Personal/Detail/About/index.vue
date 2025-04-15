<template>
  <FluxesHighlight :is-view="!isMe" />
  <!-- mobile -->
  <div v-if="$device.isMobile" class="flex flex-col gap-2">
    <PersonalDetailAboutTimeline />
    <PersonalDetailAboutDescription />
    <PersonalDetailAboutContacts />
    <PersonalDetailAboutLanguage />
    <PersonalDetailAboutSkill />
    <PersonalDetailAboutPublication @go-tab="goTab" />
    <PersonalDetailAboutWorkEducationCertificate show-type="work" />
    <PersonalDetailAboutWorkEducationCertificate show-type="study" />
    <PersonalDetailAboutWorkEducationCertificate show-type="certificate" />
    <PersonalDetailAboutOrganizations />
  </div>
  <!-- pad  and pc -->
  <div v-else>
    <div class="flex gap-8 pb-24">
      <div class="flex w-[22.375rem] flex-col gap-4">
        <PersonalDetailAboutDescription />
        <PersonalDetailAboutContacts />
        <PersonalDetailAboutLanguage />
        <PersonalDetailAboutSkill />
        <PersonalDetailAboutPublication @go-tab="goTab" />
      </div>
      <div class="flex w-0 flex-1 flex-col gap-4">
        <PersonalDetailAboutTimeline />
        <PersonalDetailAboutWorkEducationCertificate show-type="work" />
        <PersonalDetailAboutWorkEducationCertificate show-type="study" />
        <PersonalDetailAboutWorkEducationCertificate show-type="certificate" />
        <PersonalDetailAboutOrganizations />
      </div>
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
const profileStore = useProfileStore();
const isMe = computed(
  () =>
    profileStore.myProfileDetail.id ===
    profileStore.getPersonalProfileDetail().id,
);
</script>

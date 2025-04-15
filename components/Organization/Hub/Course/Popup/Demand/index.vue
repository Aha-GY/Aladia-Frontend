<template>
  <div class="flex flex-col gap-4 pt-4">
    <OrganizationHubCoursePopupDemandThumbnail :lecture="lecture" />
    <OrganizationHubCoursePopupDemandVideo :lecture="lecture" />
    <OrganizationHubCoursePopupDemandPlayer :lecture="lecture" />
    <OrganizationHubCoursePopupDemandDescription :lecture="lecture" />
    <OrganizationHubEventAttachment :files="lecture.attachments" />
  </div>
</template>

<script>
export default {
  props: {
    lecture: Object,
  },
};
</script>

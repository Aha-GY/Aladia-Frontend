<template>
  <div class="flex h-[calc(100vh-5rem)] flex-col gap-2 p-2">
    <OrganizationHubCoursePreviewCertificateTemplates
      class="rounded border border-white/5 p-2"
    />
    <OrganizationHubCoursePreviewCertificateFooter />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
};
</script>

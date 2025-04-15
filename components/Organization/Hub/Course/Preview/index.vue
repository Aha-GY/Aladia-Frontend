<template>
  <div class="relative flex h-full w-full flex-col">
    <OrganizationHubCoursePreviewHeader />
    <OrganizationHubCoursePreviewCard v-if="step === 1 || step === 3" />
    <OrganizationHubCoursePreviewCategories v-if="step === 2" />
    <OrganizationHubCoursePreviewContent
      v-if="step === 4"
      :class="hubCourse.versionViewing ? 'pointer-events-none' : ''"
    />
    <OrganizationHubCoursePreviewCertificate v-if="step === 5" />
    <div
      v-if="hubCourse.deleteCheck.length && hubCourse.isPreview"
      class="fixed bottom-16 left-0 !z-[100] w-full p-4"
    >
      <div class="mx-auto w-3/6">
        <OrganizationHubCourseEditContentActionToolbar />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    step() {
      return this.hubCourse.step;
    },
  },
  beforeUnmount() {
    this.hubCourse.ai.open = false;
    this.hubCourse.popupOpen = false;
  },
};
</script>

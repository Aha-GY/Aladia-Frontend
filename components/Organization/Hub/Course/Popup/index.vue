<template>
  <div
    class="absolute right-0 top-0 z-50 flex h-full w-full flex-col rounded border border-white/10 bg-[#060606] font-light md:right-[calc(60vw-34rem)] md:w-[32rem]"
  >
    <OrganizationHubCoursePopupSubject>
      <div class="h-full w-full bg-[#0c0c0c] p-1.5 pb-0">
        <OrganizationHubCourseEditContentSubjectTeacherPopup />
      </div>
    </OrganizationHubCoursePopupSubject>
    <OrganizationHubCoursePopupMain />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    popupFrom() {
      return this.hubCourse.popupFrom;
    },
  },
};
</script>

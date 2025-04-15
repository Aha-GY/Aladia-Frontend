<template>
  <div class="relative mb-5 flex items-end gap-3">
    <div class="flex size-4 items-center justify-center pb-2">
      <BaseCourseType
        class="!text-white/50"
        :type="course.type"
        :use-name="false"
      />
    </div>
    <OrganizationHubCourseEditItem :value="course.type" title="Type">
      <BaseCourseType :use-icon="false" class="h-full" :type="course.type" />
    </OrganizationHubCourseEditItem>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
  },
};
</script>

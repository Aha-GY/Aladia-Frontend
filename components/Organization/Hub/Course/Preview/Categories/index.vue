<template>
  <div class="flex h-0 w-full flex-1 flex-col p-4">
    <OrganizationHubCoursePreviewCategoriesSearch />
    <OrganizationHubCoursePreviewCategoriesHeader />
    <OrganizationHubCoursePreviewCategoriesRows />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  mounted() {
    this.hubCourse.getCategories();
  },
};
</script>

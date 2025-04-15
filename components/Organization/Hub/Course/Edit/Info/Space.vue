<template>
  <div class="relative mb-5 flex items-end gap-3">
    <div class="flex size-4 items-center justify-center pb-2 text-white/50">
      <i class="fa-light fa-suitcase" />
    </div>
    <OrganizationHubCourseEditItem
      value="course.spaceId"
      :title="$t('nav.header.notification.banner.space.name')"
    >
      <div class="flex h-full items-center gap-2 text-white">
        <BaseSpaceLogo :space="space" />
        {{ space.name }}
      </div>
    </OrganizationHubCourseEditItem>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSidebar, hubCourse };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    spaces() {
      return this.hubCourse.spaces;
    },
    space() {
      return (
        this.hubSidebar.space.data ||
        this.spaces.find((space) => space.id === this.course.spaceId) ||
        {}
      );
    },
  },
};
</script>

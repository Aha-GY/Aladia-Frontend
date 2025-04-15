<template>
  <OrganizationHubSidebarWrap :open="open">
    <OrganizationHubSidebarHeader
      type="builder"
      data-cy="header-builder"
      @close="onClose"
    />
    <OrganizationHubSidebarVersionHeader v-if="hubCourse.versionViewing" />
    <OrganizationHubCourseEdit />
    <OrganizationHubCourseEditFooter v-if="!hubCourse.subjectOpen" />
  </OrganizationHubSidebarWrap>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSidebar };
  },
  data() {
    return {
      open: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.open = true;
    }, 100);
  },
  methods: {
    async onClose(target) {
      if (target === 'overview') {
        this.hubSidebar.course.state = false;
        this.hubSidebar.children.state = false;
      }
      this.open = false;
      await sleep(500);
      this.hubSidebar.builder.state = false;
    },
  },
};
</script>

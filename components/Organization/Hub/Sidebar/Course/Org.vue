<template>
  <OrganizationHubSidebarWrap :open="open">
    <OrganizationHubSidebarHeader
      type="course"
      data-cy="header-org-course"
      @close="onClose"
    />
    <div class="hide-scrollbar flex h-0 flex-1 flex-col overflow-y-auto">
      <div class="px-2">
        <OrganizationHubSpaceGridCourseItem class="!w-full" :course="course" />
      </div>
      <OrganizationHubSidebarCourseDetail />
      <OrganizationHubSidebarLicenseAssigned />
    </div>
  </OrganizationHubSidebarWrap>
</template>

<script>
export default {
  setup() {
    const hubSidebar = useHubSidebarStore();
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces, hubSidebar };
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
    course() {
      return this.hubSidebar.course.data;
    },
  },
  mounted() {
    this.init();
    setTimeout(() => {
      this.open = true;
    }, 100);
  },
  methods: {
    init() {
      //
    },
    async onClose() {
      this.open = false;
      await sleep(500);
    },
  },
};
</script>

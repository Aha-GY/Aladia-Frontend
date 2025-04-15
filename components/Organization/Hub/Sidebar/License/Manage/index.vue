<template>
  <OrganizationHubSidebarWrap :open="open">
    <div
      class="mb-4 flex h-12 shrink-0 items-center gap-2 rounded-t bg-[#0c0c0c] px-4 text-sm"
    >
      <div class="flex cursor-pointer items-center gap-2" @click="onClose">
        <i class="fa-solid fa-chevron-left" />
        {{ $t('course.license.manage') }}
      </div>
    </div>
    <OrganizationHubCourseLicensesContent
      ref="content"
      :course-id="course.id"
      :space-id="space.id"
      class="h-0 flex-1 overflow-hidden"
      @cancel="onClose"
      @apply="onApply"
    />
  </OrganizationHubSidebarWrap>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
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
      return this.hubSpaces.find(data?.id) || data;
    },
    folder() {
      return this.hubSidebar.course.folder;
    },
    course() {
      const { data } = this.hubSidebar.course;
      return this.hubSpaces.find(data.id) || data;
    },
  },
  mounted() {
    setTimeout(() => {
      this.open = true;
    }, 100);
  },
  methods: {
    async onApply() {
      await this.hubSpaces.getCourses({
        spaceId: this.space.id,
        folderId: this.folder.id,
      });
    },
    async onClose() {
      this.open = false;
      await sleep(500);
      this.hubSidebar.license.manage = false;
    },
  },
};
</script>

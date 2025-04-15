<template>
  <OrganizationHubSidebarWrap :open="open">
    <OrganizationHubSidebarHeader
      type="children"
      data-cy="header-children"
      @close="onClose"
    />
    <div class="flex h-0 flex-1 flex-col px-2 pb-2">
      <OrganizationHubSidebarChildrenTitle />
      <OrganizationHubSidebarChildrenEmpty v-if="isEmpty" />
      <div
        v-else
        class="hide-scrollbar h-0 flex-1 overflow-y-auto overscroll-contain"
        data-layout="sidebar"
      >
        <OrganizationHubSidebarChildrenFoldersEdit
          v-if="children.folderCreating"
        />
        <OrganizationHubSidebarChildrenFolders :folders="space.folders" />
        <OrganizationHubSidebarChildrenCourses
          :folder="space.rootFolder"
          :courses="space.courses"
          :level="0"
        />
      </div>
    </div>
    <OrganizationHubSidebarChildrenToolbar
      v-if="hubSpaces.checkeds.length"
      @refresh="onRefresh"
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
    children() {
      return this.hubSidebar.children;
    },
    loading() {
      return this.children.loading;
    },
    isEmpty() {
      return (
        !this.children.folderCreating &&
        !this.space.folders?.length &&
        !this.space.courses?.length
      );
    },
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
  },
  mounted() {
    this.getChildren();
    setTimeout(() => {
      this.open = true;
    }, 100);
  },
  methods: {
    async onClose() {
      this.open = false;
      await sleep(500);
      this.hubSidebar.children.state = false;
    },
    async getChildren() {
      try {
        this.children.loading = true;
        await Promise.all([
          this.hubSpaces.getFolders({
            spaceId: this.space.id,
          }),
          this.hubSpaces.getCourses({
            spaceId: this.space.id,
            folderId: this.space.rootFolder.id,
          }),
        ]);
        this.children.loading = false;
      } catch (error) {
        this.children.loading = false;
        throw error;
      }
    },
    async onRefresh({ folderIds }) {
      await this.getChildren();
      await Promise.all(
        folderIds.map((folderId) =>
          this.hubSpaces.getFolders({
            spaceId: this.space.id,
            folderId,
          }),
        ),
      );
    },
  },
};
</script>

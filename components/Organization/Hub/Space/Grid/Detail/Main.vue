<template>
  <div data-layout="grid">
    <OrganizationHubSpaceGridFolder v-if="isSpace" />
    <OrganizationHubSpaceGridCourse />
    <OrganizationHubSpaceEmpty v-if="isEmpty" />
  </div>
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
      loading: false,
    };
  },
  computed: {
    spaceId() {
      return this.$route.query.space;
    },
    folderId() {
      return this.$route.query.folder;
    },
    courseId() {
      return this.$route.query.course;
    },
    isFolder() {
      return !!this.folderId;
    },
    isSpace() {
      return !!this.spaceId && !this.isFolder;
    },
    space() {
      return this.hubSpaces.find(this.spaceId);
    },
    folder() {
      return this.hubSpaces.find(this.folderId);
    },
    isEmpty() {
      if (this.loading) {
        return false;
      }
      if (this.isFolder) {
        return this.folder.courses.length === 0;
      } else {
        return (
          this.space.courses.length === 0 && this.space.folders.length === 0
        );
      }
    },
  },
  watch: {
    '$route.query': {
      handler() {
        this.load();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async load() {
      if (this.loading) {
        return;
      }
      try {
        this.loading = true;
        await this.loadFolders();
        await this.loadCourses();
        this.openCourse();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async loadFolders() {
      await this.hubSpaces.getFolders({
        spaceId: this.spaceId,
      });
    },
    async loadCourses() {
      const folderId = this.isFolder
        ? this.folderId
        : this.space?.rootFolder?.id;

      if (folderId) {
        await this.hubSpaces.getCourses({
          spaceId: this.spaceId,
          folderId,
        });
      }
    },
    openCourse() {
      if (!this.courseId) {
        return;
      }
      const course = this.hubSpaces.find(this.courseId);
      if (!course) {
        return;
      }
      this.hubSidebar.edieCourse({
        course,
      });
    },
  },
};
</script>

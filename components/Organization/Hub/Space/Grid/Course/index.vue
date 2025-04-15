<template>
  <div
    id="courses"
    :data-collapse="$route.query.space"
    class="relative -m-4 flex min-h-96 flex-wrap"
  >
    <OrganizationHubSpaceGridCourseItem
      v-for="course in courses"
      :key="course.id"
      :course="course"
    />
    <OrganizationHubSpaceDragDroping v-if="isCollapse" />
  </div>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  computed: {
    spaceId() {
      return this.$route.query.space;
    },
    folderId() {
      return this.$route.query.folder;
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
    courses() {
      if (this.isSpace) {
        return this.space?.courses || [];
      }
      return this.folder?.courses || [];
    },
    isCollapse() {
      return (
        this.hubSpaces.isCollapse &&
        this.hubSpaces.collapseId === this.spaceId &&
        this.hubSpaces.dropLayout === 'grid'
      );
    },
  },
};
</script>

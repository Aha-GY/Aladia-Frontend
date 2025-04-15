<template>
  <div
    data-type="folder"
    :data-id="folder.id"
    class="relative mb-3 flex flex-col gap-2"
    :class="level === 0 ? 'min-h-72' : ''"
    :data-collapse="level === 0 ? space.id : null"
    :data-cy="`space-folder-list-${folder.id}`"
  >
    <OrganizationHubSidebarChildrenCoursesItem
      v-for="course in courses"
      :key="course.id"
      :course="course"
      :folder="folder"
      :level="level"
    />
    <OrganizationHubSpaceDragDroping v-if="isCollapse" />
  </div>
</template>

<script>
export default {
  props: {
    courses: {
      type: Array,
    },
    folder: {
      type: Object,
    },
    level: {
      type: Number,
    },
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSpaces, hubCourse, hubSidebar };
  },
  computed: {
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
    isCollapse() {
      return (
        this.hubSpaces.isCollapse &&
        this.hubSpaces.collapseId === this.space.id &&
        this.hubSpaces.dropLayout === 'sidebar'
      );
    },
  },
};
</script>

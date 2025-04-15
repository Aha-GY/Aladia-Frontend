<template>
  <div class="relative" :data-collapse="level === 0 ? space.id : null">
    <OrganizationHubSpaceListCourseTable
      :space="space"
      :folder="folder"
      :courses="courses"
      :level="level"
    />
    <OrganizationHubSpaceDragDroping v-if="isCollapse" />
  </div>
</template>

<script>
export default {
  props: {
    level: Number,
    space: Object,
    folder: Object,
    courses: Array,
  },
  setup() {
    const authStore = useAuthStore();
    const hubSpaces = useHubSpacesStore();
    return { authStore, hubSpaces };
  },
  data() {
    return {
      drag: false,
    };
  },
  computed: {
    isCollapse() {
      return (
        this.level === 0 &&
        this.hubSpaces.isCollapse &&
        this.hubSpaces.collapseId === this.space.id
      );
    },
    user() {
      return this.authStore.user;
    },
  },
};
</script>

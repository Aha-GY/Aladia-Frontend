<template>
  <div
    class="flex h-8 cursor-pointer items-center rounded"
    data-cy="32d96dc5fab84a01"
    @click="onEdit"
  >
    <div>{{ billing.frequency || '---' }}</div>
  </div>
</template>

<script>
export default {
  props: {
    course: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSpaces, hubCourse, hubSidebar };
  },
  computed: {
    billing() {
      return this.course.billing || {};
    },
    editable() {
      return this.hubSpaces.checkCourseEditable(this.course);
    },
  },
  methods: {
    onEdit() {
      if (!this.editable) {
        return;
      }
      this.hubCourse.focusField = 'frequency';
      this.hubSidebar.edieCourse({
        course: this.course,
        isBuilder: true,
      });
      this.hubCourse.step = 3;
    },
  },
};
</script>

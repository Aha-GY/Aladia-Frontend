<template>
  <div
    class="flex h-8 cursor-pointer items-center rounded"
    data-cy="8474534b33285340"
    @click="onEdit"
  >
    <BaseCourseVisibility v-if="visibility" :visibility="visibility" />
    <div v-else>---</div>
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
    editable() {
      return this.hubSpaces.checkCourseEditable(this.course);
    },
    visibility() {
      return this.course.visibility;
    },
  },
  methods: {
    onEdit() {
      if (!this.editable) {
        return;
      }
      this.hubCourse.focusField = 'visibility';
      this.hubSidebar.edieCourse({
        course: this.course,
        isBuilder: true,
      });
      this.hubCourse.step = 1;
    },
  },
};
</script>

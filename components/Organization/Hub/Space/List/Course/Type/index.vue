<template>
  <div class="flex h-8 items-center rounded">
    <BaseCourseType v-if="course.type" :type="course.type" />
    <div v-else>----</div>
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
  },
  methods: {
    onEdit() {
      if (!this.editable) {
        return;
      }
      this.hubCourse.focusField = 'type';
      this.hubSidebar.edieCourse({
        course: this.course,
        isBuilder: true,
      });
      this.hubCourse.step = 1;
    },
  },
};
</script>

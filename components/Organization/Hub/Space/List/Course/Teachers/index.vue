<template>
  <div data-cy="3893b606c7823f01" @click="onEdit">
    <BaseMemberPreview
      :members="teacher.data"
      :max="4"
      :add="true"
      :length="teacher.totalItems"
      class="translate-x-3"
    />
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
  data() {
    return {
      teacher: {
        data: [],
        totalItems: 0,
      },
    };
  },
  computed: {
    editable() {
      return this.hubSpaces.checkCourseEditable(this.course);
    },
  },
  mounted() {
    // this.load();
  },
  methods: {
    onEdit() {
      if (!this.editable) {
        return;
      }
      this.hubCourse.focusField = 'teacher';
      this.hubSidebar.edieCourse({
        course: this.course,
      });
    },
    async load() {
      const {
        data,
        cursor: { totalItems },
      } = await this.hubCourse.getMembers({
        courseId: this.course.id,
        roles: `course-teacher`,
        limit: 4,
      });
      this.teacher = { data, totalItems };
    },
  },
};
</script>

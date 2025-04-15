<template>
  <div data-cy="b723748363b4a442" @click="onEdit">
    <BaseMemberPreview
      :members="attendant.data"
      :max="4"
      :add="true"
      :length="attendant.totalItems"
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
      attendant: {
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
      this.hubCourse.focusField = 'attendant';
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
        roles: `course-attendant`,
        limit: 4,
      });
      this.attendant = { data, totalItems };
    },
  },
};
</script>

<template>
  <div
    class="flex h-8 cursor-pointer items-center rounded"
    data-cy="3c6ddb8f168776e7"
    @click="onEdit"
  >
    <div v-if="duration">{{ duration }}</div>
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
    dates() {
      return this.course.cycles[0]?.dates || {};
    },
    duration() {
      if (this.dates.startDate && this.dates.endDate) {
        return `${formatDate(this.dates.startDate, 'DD MMM YYYY')} - ${formatDate(this.dates.endDate, 'DD MMM YYYY')}`;
      } else {
        return '';
      }
    },
  },
  methods: {
    onEdit() {
      if (!this.editable) {
        return;
      }
      if (this.course.type === 'on-demand') {
        return;
      }
      this.hubCourse.focusField = 'duration';
      this.hubSidebar.edieCourse({
        course: this.course,
        isBuilder: true,
      });
      this.hubCourse.step = 1;
    },
  },
};
</script>

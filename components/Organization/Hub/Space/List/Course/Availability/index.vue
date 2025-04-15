<template>
  <div
    class="flex h-8 cursor-pointer items-center rounded"
    data-cy="3f8253e3275f6a16"
    @click="onEdit"
  >
    <div v-if="course.seatCount !== -1">{{ course.seatCount }}</div>
    <div v-else>
      {{ $t('course.availability.unlimited') }}
    </div>
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
      if (this.course.type === 'on-demand') {
        return;
      }
      this.hubCourse.focusField = 'seatCount';
      this.hubSidebar.edieCourse({
        course: this.course,
        isBuilder: true,
      });
      this.hubCourse.step = 1;
    },
  },
};
</script>

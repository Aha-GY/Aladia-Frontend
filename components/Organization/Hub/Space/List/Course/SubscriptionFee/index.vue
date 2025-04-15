<template>
  <div
    class="flex h-8 cursor-pointer items-center rounded"
    data-cy="9190c5a206e85844"
    @click="onEdit"
  >
    <div v-if="billing.subscriptionFee">
      {{ billing.subscriptionFee }},00 USD
    </div>
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
      if (this.course.type === 'on-demand') {
        return;
      }
      this.hubCourse.focusField = 'subscriptionFee';
      this.hubSidebar.edieCourse({
        course: this.course,
        isBuilder: true,
      });
      this.hubCourse.step = 3;
    },
  },
};
</script>

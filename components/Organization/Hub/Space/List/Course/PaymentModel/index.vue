<template>
  <div
    class="flex h-8 cursor-pointer items-center rounded"
    data-cy="8174c025972b4a30"
    @click="onEdit"
  >
    <BaseCoursePaymentModel
      v-if="billing.paymentModel"
      :payment-model="billing.paymentModel"
    />
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
    billing() {
      return this.course.billing || {};
    },
  },
  methods: {
    onEdit() {
      if (!this.editable) {
        return;
      }
      this.hubCourse.focusField = 'paymentModel';
      this.hubSidebar.edieCourse({
        course: this.course,
        isBuilder: true,
      });
      this.hubCourse.step = 3;
    },
  },
};
</script>

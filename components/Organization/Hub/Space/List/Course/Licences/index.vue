<template>
  <div
    class="flex h-8 cursor-pointer items-center rounded"
    data-cy="5ca61870e71453c1"
    @click="onEdit"
  >
    <div v-if="typeof course.purchases === 'number'">
      {{ course.purchases }}
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
    return { hubSpaces, hubCourse };
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
    },
  },
};
</script>

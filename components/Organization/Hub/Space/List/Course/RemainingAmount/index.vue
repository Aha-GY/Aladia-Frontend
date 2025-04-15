<template>
  <div class="flex h-8 items-center">
    <div v-if="billing.remainingAmount">
      {{ billing.remainingAmount }}.00 USD
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
    billing() {
      return this.course.billing || {};
    },
  },
};
</script>

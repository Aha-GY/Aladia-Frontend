<template>
  <div
    class="mb-4 flex w-full cursor-pointer items-center gap-2 text-sm"
    @click="placeholder.useProfilePicture = !placeholder.useProfilePicture"
  >
    <div class="flex size-5 items-center justify-center">
      <BaseCheckbox :active="placeholder.useProfilePicture" />
    </div>
    Use Profile Picture
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    placeholder() {
      return this.hubCourse.detail.certificateTemplate;
    },
  },
};
</script>

<template>
  <div class="mb-4 flex w-full cursor-pointer items-end gap-2 text-sm">
    <div class="flex size-5 items-center justify-center pb-1">
      <i class="fa-solid fa-signature text-sm text-white/50" />
    </div>
    <BaseInput
      v-model="placeholder.signatureName"
      title="Name for signature"
      required
      :max-length="30"
    />
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

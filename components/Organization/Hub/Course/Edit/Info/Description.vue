<template>
  <div class="relative mb-5 flex gap-3">
    <div class="flex size-4 items-center justify-center pt-2 text-white/50">
      <i class="fa-light fa-memo-pad" />
    </div>
    <div class="flex-1">
      <div class="mb-2 text-sm text-white/50">Description</div>
      <div>
        <LazyBaseEditor
          v-model="course.description"
          name="description-editor"
          type="textarea"
          :options="{
            placeholder:
              'Explain what it is and what it offers in a very brief and clear manner.',
          }"
          area-height="10rem"
          limit-character
          :characters-limit="500"
          :auto-focus="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
  },
};
</script>

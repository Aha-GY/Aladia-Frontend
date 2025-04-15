<template>
  <div
    class="absolute bottom-5 right-5 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#dabb4b] text-black hover:bg-[#dabb4b]/90"
    data-cy="578a98d8b90c170c"
    @click="version.edit.state = true"
  >
    <i class="fa-light fa-plus text-xl" />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    version() {
      return this.hubCourse.version;
    },
  },
};
</script>

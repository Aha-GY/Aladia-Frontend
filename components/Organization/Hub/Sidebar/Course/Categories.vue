<template>
  <div class="flex items-center gap-2">
    <div
      v-for="category in categories"
      :key="category.id"
      class="flex size-8 items-center justify-center overflow-hidden rounded"
    >
      <img class="size-8 rounded" :src="category.image" />
    </div>
    <div
      v-for="i in rest"
      :key="i"
      class="flex size-8 items-center justify-center rounded border border-dashed border-white/20"
    >
      <img class="size-5" src="~/assets/icons/selecte-category.svg" />
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
    categories() {
      return this.hubCourse.detail.originalSubCategories || [];
    },
    rest() {
      return 3 - this.categories.length;
    },
  },
};
</script>

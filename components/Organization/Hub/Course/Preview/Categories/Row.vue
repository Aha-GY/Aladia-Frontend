<template>
  <div
    :data-category-id="row.id"
    class="group/row relative flex min-h-[14rem] rounded transition-all duration-300"
    :class="open ? 'mb-16 max-h-[1024rem]' : 'mb-4 max-h-[14rem]'"
  >
    <img
      class="absolute inset-0 z-0 h-full w-full rounded object-cover opacity-50"
      :src="row.image?.url"
    />
    <div
      class="absolute inset-0 z-10 h-full w-full rounded"
      :class="open ? 'bg-black/10 backdrop-blur-md' : 'opacity-0'"
    />
    <div class="relative z-20 h-full w-full p-4">
      <div class="mb-6 text-lg font-semibold">{{ row.name }}</div>
      <div
        class="flex flex-wrap items-start opacity-80 transition-all duration-300 group-hover/row:opacity-100"
      >
        <OrganizationHubCoursePreviewCategoriesItem
          v-for="category in categories"
          :key="category.id"
          :row="row"
          :category="category"
        />
      </div>
    </div>
    <OrganizationHubCoursePreviewCategoriesLess
      v-if="open"
      @close="open = false"
    />
    <OrganizationHubCoursePreviewCategoriesMore v-else @open="open = true" />
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    categories() {
      if (this.open) {
        return this.row.subCategories;
      } else {
        return this.row.subCategories.slice(0, this.$device.isMobile ? 4 : 8);
      }
    },
  },
  mounted() {
    this.hubCourse.getSubCategories({
      parentId: this.row.id,
    });
  },
};
</script>

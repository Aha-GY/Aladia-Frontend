<template>
  <div class="h-0 flex-1 overflow-y-auto overscroll-contain pr-2">
    <OrganizationHubCoursePreviewCategoriesRow
      v-for="row in categories"
      v-show="row.subCategories.length"
      :key="row.id"
      :row="row"
    />
    <div
      v-if="empty && search"
      class="flex h-full flex-col items-center justify-center gap-1 text-center text-white/70"
    >
      <img src="~/assets/icons/category-empty.svg" />
      <div class="text-lg font-semibold">No Results Found for</div>
      <div class="text-lg text-white">"{{ search }}"</div>
      <div class="text-sm text-white/50">
        Please try searching with another term
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
    search() {
      return this.hubCourse.categorySearch;
    },
    empty() {
      return this.categories.every((item) => !item.subCategories.length);
    },
    categories() {
      const categories = this.hubCourse.categories;
      if (this.hubCourse.categoryId) {
        if (this.search) {
          const filters = categories.filter(
            (item) => item.id === this.hubCourse.categoryId,
          );
          return filters.map((item) => {
            const subCategories = item.originalSubCategories.filter((subItem) =>
              subItem.name.toLowerCase().includes(this.search.toLowerCase()),
            );
            return {
              ...item,
              subCategories,
            };
          });
        } else {
          return filters;
        }
      } else {
        if (this.search) {
          return categories.map((item) => {
            const subCategories = item.originalSubCategories.filter((subItem) =>
              subItem.name.toLowerCase().includes(this.search.toLowerCase()),
            );
            return {
              ...item,
              subCategories,
            };
          });
        } else {
          return categories;
        }
      }
    },
  },
};
</script>

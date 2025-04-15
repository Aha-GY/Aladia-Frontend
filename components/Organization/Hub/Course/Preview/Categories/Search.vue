<template>
  <div
    class="relative mb-4 flex h-8 w-full items-center gap-2 text-13 opacity-70 transition-all duration-300 hover:opacity-100"
  >
    <BaseInput
      v-model="hubCourse.categorySearch"
      fixed
      search
      placeholder=" Search a category"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      focus: false,
      timer: null,
    };
  },
  computed: {
    loading() {
      return this.hubCourse.categoriesLoading;
    },
  },
  methods: {
    onSearch() {
      this.hubCourse.categoryActive = -1;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.hubCourse.searchCategories({
          name: this.hubCourse.categorySearch,
        });
      }, 300);
    },
  },
};
</script>

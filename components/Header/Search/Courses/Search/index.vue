<template>
  <div class="flex h-full w-full flex-col gap-4">
    <BaseNoData v-if="!courses.length && !loading" class="mt-24" />
    <div
      v-if="loading"
      class="hide-scrollbar flex h-0 w-full flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4"
    >
      <HeaderSearchSkeletonCourse v-for="n in 5" :key="n" />
    </div>
    <div
      v-else
      class="hide-scrollbar relative flex h-0 w-full flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4"
    >
      <HeaderSearchTypeCourse
        v-for="course in courses"
        :key="course.id"
        :course="course"
      />
    </div>
    <HeaderSearchTypeMore v-if="!loading" @more="onMore" />
  </div>
</template>

<script>
export default {
  setup() {
    const searchStore = useSearchStore();
    return { searchStore };
  },
  data() {
    return {
      courses: [],
      timer: null,
      loading: false,
    };
  },
  computed: {
    title() {
      return this.searchStore.query.title;
    },
  },
  watch: {
    title() {
      this.courses = [];
      this.loading = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.search();
      }, 1000);
    },
  },
  mounted() {
    this.search();
  },
  methods: {
    async search() {
      try {
        this.loading = true;
        const { data } = await this.searchStore.searchCourses({
          limit: 10,
          title: this.title,
        });
        this.courses = data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    onMore() {
      this.searchStore.isFocus = false;
      this.$router.push({
        path: '/marketplace',
        query: {
          title: this.title,
        },
      });
    },
  },
};
</script>

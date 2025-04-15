<template>
  <div class="h-full px-4">
    <div class="mb-3">
      <div class="mb-3">
        {{ $t('nav.header.notification.banner.course.best') }}
      </div>
      <div v-if="bestCoursesLoading" class="flex flex-col gap-3">
        <HeaderSearchSkeletonCourse />
        <HeaderSearchSkeletonCourse />
      </div>
      <div v-else class="flex flex-col gap-3">
        <HeaderSearchTypeCourse
          v-for="course in bestCourses"
          :key="course.id"
          :course="course"
        />
      </div>
    </div>
    <div class="mb-3">
      <div class="mb-3">
        {{ $t('nav.header.notification.user.featured') }}
      </div>
      <div
        v-if="bestCoursesLoading"
        class="flex items-center justify-between gap-3"
      >
        <HeaderSearchSkeletonUser v-for="n in 3" :key="n" />
      </div>
      <div
        v-else
        class="hide-scrollbar flex items-center justify-between gap-3 overflow-x-auto overscroll-contain"
      >
        <HeaderSearchTypeUser
          v-for="user in featuredUsers"
          :key="user.id"
          :user="user"
        />
      </div>
    </div>
    <HeaderSearchTypeTopics :length="6" />
  </div>
</template>

<script>
export default {
  setup() {
    const searchStore = useSearchStore();
    const fluxesStore = useFluxesStore();
    return { searchStore, fluxesStore };
  },
  data() {
    return {
      bestCourses: [],
      bestCoursesLoading: true,
      featuredUsers: [],
      featuredUsersLoading: true,
    };
  },
  mounted() {
    this.getBestCourses();
    this.getFeaturedUsers();
  },
  methods: {
    async getBestCourses() {
      this.bestCoursesLoading = true;
      const { data } = await this.searchStore.getCourses({
        limit: 2,
        sortBy: 'purchases',
      });
      this.bestCourses = data;
      this.bestCoursesLoading = false;
    },
    async getFeaturedUsers() {
      this.featuredUsersLoading = true;
      const { data } = await this.searchStore.searchProfile({
        limit: 3,
        featuredUsers: true,
      });
      this.featuredUsers = data;
      this.featuredUsersLoading = false;
    },
  },
};
</script>

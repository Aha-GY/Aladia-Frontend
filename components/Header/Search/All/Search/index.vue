<template>
  <div class="flex h-full flex-col">
    <div
      class="hide-scrollbar h-0 flex-1 overflow-y-auto overscroll-contain px-4"
    >
      <div v-if="courses.length || loading" class="mb-3 min-h-56">
        <div class="mb-2">
          {{ $t('nav.header.notification.banner.course.name') }}
        </div>
        <div v-if="loading" class="flex flex-col gap-1">
          <HeaderSearchSkeletonCourse />
          <HeaderSearchSkeletonCourse />
        </div>
        <div v-else class="flex flex-col gap-1">
          <HeaderSearchTypeCourse
            v-for="course in courses"
            :key="course.id"
            :course="course"
          />
        </div>
      </div>
      <div v-if="profiles.length || loading" class="mb-3 min-h-44">
        <div class="mb-2">{{ $t('nav.header.profile.label') }}</div>
        <div v-if="loading" class="flex flex-col gap-1">
          <HeaderSearchSkeletonProfile />
          <HeaderSearchSkeletonProfile />
        </div>
        <div v-else class="flex flex-col gap-1">
          <HeaderSearchTypeProfile
            v-for="user in profiles"
            :key="user.id"
            :user="user"
          />
        </div>
      </div>
      <div v-if="posts.length || loading" class="mb-3 min-h-56">
        <div class="mb-3">
          {{ $t('nav.header.notification.banner.post.name.plural') }}
        </div>
        <div v-if="loading" class="flex flex-col gap-1">
          <HeaderSearchSkeletonPost />
          <HeaderSearchSkeletonPost />
        </div>
        <div v-else class="flex flex-col gap-1">
          <HeaderSearchTypePost
            v-for="post in posts"
            :key="post.id"
            :item="post"
          />
        </div>
      </div>
    </div>
    <HeaderSearchTypeMore v-if="!!title" @more="onMore" />
  </div>
</template>

<script>
export default {
  setup() {
    const searchStore = useSearchStore();
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();
    return { searchStore, socialStore, fluxesStore };
  },
  data() {
    return {
      posts: [],
      courses: [],
      profiles: [],
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
      this.posts = [];
      this.courses = [];
      this.profiles = [];
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
      this.loading = true;
      await Promise.all([
        this.searchCourses(),
        this.searchProfiles(),
        this.searchPosts(),
      ]);
      this.loading = false;
    },
    async searchCourses() {
      const { data } = await this.searchStore.searchCourses({
        limit: 2,
        title: this.title,
      });
      this.courses = data;
    },
    async searchProfiles() {
      const { data } = await this.socialStore.getProfiles({
        limit: 2,
        text: this.title,
      });
      this.profiles = data;
    },
    async searchPosts() {
      const { data } = await this.socialStore.searchPosts({
        limit: 2,
        text: this.title,
      });
      this.posts = data;
    },
    onMore() {
      this.searchStore.isFocus = false;
      this.$router.push({
        path: '/search',
        query: {
          title: this.title,
        },
      });
    },
  },
};
</script>

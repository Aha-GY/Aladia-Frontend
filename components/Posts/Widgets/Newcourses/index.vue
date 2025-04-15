<template>
  <PostsWidgetsBox
    :label="$t('post.new')"
    :border="false"
    class="h-[calc(100vh-7rem)] !pt-0"
  >
    <BaseInput
      v-model="name"
      search
      fixed
      clear
      :placeholder="$t('post.coursers.placeholder')"
      class="!w-full"
    />

    <div
      v-infinite-scroll="load"
      :infinite-scroll-disabled="loading || !next"
      :infinite-scroll-distance="20"
      class="hide-scrollbar mt-2 h-[calc(100%-4.625rem)] overflow-y-auto"
    >
      <PostsWidgetsNewcoursesItem
        v-for="item in courses"
        :key="item.id"
        :item="item"
        :search-value="name"
        class="mb-[0.625rem] last:mb-0"
      />

      <BaseSkeleton
        v-show="loading"
        :length="6"
        height="3.5rem"
        class="mb-[0.625rem]"
      />
    </div>
  </PostsWidgetsBox>
</template>
<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();

    return { socialStore, fluxesStore };
  },
  data() {
    return {
      courses: [],
      loading: false,
      next: null,
      name: '',
      timer: null,
    };
  },
  watch: {
    name() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 1000);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.courses = [];
      this.loading = false;
      this.next = null;
      this.load();
    },
    async load() {
      this.loading = true;

      try {
        const {
          data,
          cursor: { next },
        } = await this.socialStore.getCourses({
          title: this.name || undefined,
          limit: 20,
          next: this.next,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        });

        this.next = next;
        this.courses = [...this.courses, ...data];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

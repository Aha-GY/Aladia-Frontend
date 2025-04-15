<template>
  <div class="mb-4 px-6 py-3">
    <div class="mb-1 flex items-center justify-between pl-2">
      <div>
        {{ $t('nav.header.search.menu.courses') }}
      </div>
      <div
        class="cursor-pointer rounded px-2 py-1 hover:bg-white/10"
        data-cy="9aab6592cc533af2"
        @click="onSeeAll"
      >
        {{ $t('course.viewAll') }}
      </div>
    </div>
    <div v-if="loading" class="flex overflow-hidden">
      <MarketSkeletonCourse v-for="n in 10" :key="n" />
    </div>
    <div v-else class="flex overflow-hidden">
      <MarketCardCourse
        v-for="course in courses"
        :key="course.id"
        :course="course"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    courses: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onSeeAll() {
      this.$router.push({
        path: '/marketplace',
        query: {
          title: this.$route.query.title,
        },
      });
    },
  },
};
</script>

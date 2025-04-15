<template>
  <div class="mb-4 px-6 py-3">
    <div class="mb-1 flex items-center justify-between pl-2">
      <div>
        {{ $t('org.label') }}
      </div>
      <div
        class="cursor-pointer rounded px-2 py-1 hover:bg-white/10"
        @click="onSeeAll"
      >
        {{ $t('org.viewAll') }}
      </div>
    </div>
    <div v-if="loading" class="flex overflow-hidden">
      <MarketSkeletonTeacher v-for="n in 10" :key="n" />
    </div>
    <div v-else class="flex overflow-hidden">
      <MarketCardTeacher
        v-for="org in orgs"
        :key="org.id"
        :user="org"
        type="organization"
        from="search"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orgs: {
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
        path: '/organization',
        query: {
          title: this.$route.query.title,
        },
      });
    },
  },
};
</script>

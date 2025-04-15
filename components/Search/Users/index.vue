<template>
  <div class="mb-4 px-6 py-3">
    <div class="mb-1 flex items-center justify-between pl-2">
      <div>
        {{ $t('base.users.label') }}
      </div>
      <div
        class="cursor-pointer rounded px-2 py-1 hover:bg-white/10"
        @click="onSeeAll"
      >
        {{ $t('base.users.viewAll') }}
      </div>
    </div>
    <div v-if="loading" class="flex overflow-hidden">
      <MarketSkeletonUser v-for="n in 10" :key="n" />
    </div>
    <div v-else class="flex overflow-hidden">
      <MarketCardUser v-for="user in users" :key="user.id" :user="user" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    users: {
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
        path: '/profile',
        query: {
          title: this.$route.query.title,
        },
      });
    },
  },
};
</script>

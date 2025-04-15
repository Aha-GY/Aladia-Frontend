<template>
  <div class="pt-6">
    <MarketRow
      :length="profiles.length"
      icon="fa-people-arrows"
      :title="$t('personal.friends.suggested.title')"
    >
      <MarketCardTeacher v-for="user in profiles" :key="user.id" :user="user" />
    </MarketRow>
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
      profiles: [],
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      const { data } = await this.searchStore.searchProfile({
        limit: 16,
        type: 'teacher',
        featuredUsers: true,
      });
      this.profiles = data;
    },
  },
};
</script>

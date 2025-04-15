<template>
  <SocialSuggestedRow
    :length="suggestions.length"
    :title="$t('category.suggested.users')"
    type="suggested"
  >
    <div
      v-for="user in suggestions"
      :key="user.id"
      class="relative shrink-0 pr-8"
    >
      <SocialSuggestedUser :user="user" />
    </div>
  </SocialSuggestedRow>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const globalStore = useGlobalStore();
    return { authStore, profileStore, globalStore };
  },
  data() {
    return {
      showType: 'following',
      suggestions: [],
      suggestionsLoading: false,
      suggestionsNext: null,
      followeing: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.suggestions = [];
      this.suggestionsLoading = false;
      this.suggestionsNext = null;
      this.loadSuggestion();
    },
    async loadSuggestion() {
      if (this.suggestionsLoading) {
        return;
      }
      try {
        this.suggestionsLoading = true;
        const {
          data,
          cursor: { next },
        } = await this.globalStore.searchProfile({
          next: this.suggestionsNext,
          limit: 10,
          followSuggestion: true,
        });
        this.suggestionsNext = next;
        this.suggestions = [...this.suggestions, ...data];
      } finally {
        this.suggestionsLoading = false;
      }
    },
    async onFollowe() {
      if (this.authStore.logged) {
        if (this.followeing) {
          return;
        }
        try {
          this.followeing = true;
          const data = await this.profileStore.follow(this.user);
          this.user.isFollowing = !!data.followed;
          this.followeing = false;
        } catch (error) {
          this.followeing = false;
          throw error;
        }
      } else {
        this.authStore.popup = true;
      }
    },
    onMessage() {
      if (this.authStore.logged) {
        this.$router.push(`${this.authStore.hub}/chat?userId=${this.user.id}`);
      } else {
        this.authStore.popup = true;
      }
    },
  },
};
</script>

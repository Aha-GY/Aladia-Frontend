<template>
  <PostsWidgetsRightBox
    :label="$t('post.users.suggested')"
    :show-total-items="false"
  >
    <div>
      <PostsWidgetsItem
        v-for="item in suggestions"
        :key="item.id"
        class="mb-3 last:mb-0"
        :item="item"
        @change="handleChange"
      />
      <div v-show="suggestionsLoading">
        <BaseSkeletonSuggestedUser :length="6" class="mb-3" />
      </div>
    </div>
  </PostsWidgetsRightBox>
</template>
<script>
export default {
  setup() {
    const globalStore = useGlobalStore();
    const fluxesStore = useFluxesStore();

    return {
      globalStore,
      fluxesStore,
    };
  },
  data() {
    return {
      showType: 'following',
      suggestions: [],
      suggestionsLoading: false,
      suggestionsNext: null,
      totalItems: 0,
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
          cursor: { next, totalItems },
        } = await this.globalStore.searchProfile({
          next: this.suggestionsNext,
          limit: 100,
          followSuggestion: true,
        });
        this.suggestionsNext = next;
        this.totalItems = totalItems;
        this.suggestions = [...this.suggestions, ...data];
      } finally {
        this.suggestionsLoading = false;
      }
    },
    handleChange({ item, isfollow }) {
      if (isfollow) {
        this.suggestions = this.suggestions.map((s) => {
          if (s.id === item.id) {
            return {
              ...s,
              isFollowing: true,
            };
          }
          return s;
        });
      }
    },
  },
};
</script>

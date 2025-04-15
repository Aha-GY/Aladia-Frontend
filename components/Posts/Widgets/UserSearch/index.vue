<template>
  <PostsWidgetsRightBox
    :label="$t('post.result.search')"
    :total-items="totalItems"
  >
    <div
      class="hide-scrollbar mt-2 h-[calc(100vh-7rem)] w-[20rem] overflow-y-auto"
    >
      <div
        v-infinite-scroll="load"
        :infinite-scroll-disabled="loading || !next"
        :infinite-scroll-distance="10"
      >
        <PostsWidgetsItem
          v-for="item in profiles"
          :key="item.id"
          class="mb-3 last:mb-0"
          :item="item"
          :suggestion="!item.isFollowing"
          :name="name"
          @change="handleChange"
          @chat="handleChat"
        />
        <div v-show="loading">
          <BaseSkeletonSuggestedUser :length="10" class="mb-3" />
        </div>
      </div>
    </div>
  </PostsWidgetsRightBox>
</template>
<script>
export default {
  props: {
    profiles: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    next: {
      type: String,
      default: null,
    },
    load: {
      type: Function,
      default: () => {},
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: '',
    },
  },
  setup() {
    const globalStore = useGlobalStore();
    const profileStore = useProfileStore();
    const authStore = useAuthStore();
    return { globalStore, profileStore, authStore };
  },
  methods: {
    handleChat({ item }) {
      if (this.authStore.logged) {
        this.$router.push(
          `${this.authStore.hub}/chat?${item.entityType === 'organization' ? 'orgId' : 'userId'}=${item.id}`,
        );
      } else {
        this.authStore.popup = true;
      }
    },
    handleChange({ item, isfollow }) {
      this.$emit('change', { item, isfollow });
    },
  },
};
</script>

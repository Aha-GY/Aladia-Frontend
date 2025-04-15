<template>
  <div
    v-if="isAvailable"
    class="min-w-[21.875rem] max-sm:!max-w-[100%]"
    :class="isPopup ? 'max-w-[100%]' : 'max-w-[37.5rem]'"
  >
    <BaseSkeleton
      v-if="loading"
      :length="1"
      height="33rem"
      class="mb-1 w-[21.875rem]"
    />
    <div v-else class="mb-1">
      <PostsItem :item="post" :is-chat="true" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: String,
    ownerId: String,
    isPopup: Boolean,
  },
  setup() {
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();
    return { socialStore, profileStore };
  },
  data() {
    return {
      loading: true,
      post: {
        loading: true,
      },
    };
  },
  computed: {
    isAvailable() {
      return this.id && this.ownerId;
    },
  },
  mounted() {
    if (this.isAvailable) {
      this.load(this.id);
    }
  },
  methods: {
    async load(postId) {
      this.loading = true;
      const data = await this.socialStore.retreivePost(postId);
      this.post = data;
      this.loading = false;
    },
  },
};
</script>

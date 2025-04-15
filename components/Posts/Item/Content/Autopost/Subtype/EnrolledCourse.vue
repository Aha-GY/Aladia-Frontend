<template>
  <div>
    <p class="text-sm font-medium text-[#D9D9D9]">
      {{ $t('post.auto.journey.title1') }}
      <span
        class="cursor-pointer hover:underline hover:underline-offset-2"
        data-cy="f93b2ffd7f9b125a"
        @click="handleGoToCourse"
      >
        {{ entity?.title }}
      </span>
      {{ $t('post.auto.journey.title2') }}
    </p>
    <client-only>
      <PostsItemWidgetsCollapsableBubble
        v-if="item.content"
        class="text-[#B0B0B0]"
        :item="item"
        :is-popup="isPopup"
        @show-popup="handleShowDetail"
      />
    </client-only>
    <PostsItemWidgetsPlayer
      :item="item"
      :video="trailer"
      :image="thumbnail"
      :style-control="true"
      class="mt-4"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const searchStore = useSearchStore();
    return { authStore, socialStore, searchStore };
  },
  computed: {
    entity() {
      return this.item.entity;
    },
    thumbnail() {
      return {
        url: this.entity?.thumbnail?.url || '',
      };
    },
    trailer() {
      return {
        url: this.entity?.trailer?.url || '',
      };
    },
  },
  methods: {
    handleGoToCourse() {
      this.isPopup && this.socialStore.hidePostsPopup();

      if (['lecture', 'course'].includes(this.entity.type)) {
        // lecture 和 course 获取 courseId 的方法不同，需要兼容一下
        const courseId = this.entity?.courseId || this.entity?.entityId;
        return this.$router.push(`/courses/${courseId}`);
      }

      if (this.entity.ownerId && this.entity.type === 'category') {
        return this.$router.push(
          `/marketplace?categoryId=${this.entity.ownerId}`,
        );
      }

      this.$router.push(`/marketplace`);
    },
    handleShowDetail() {
      this.$emit('show-popup');
    },
  },
};
</script>

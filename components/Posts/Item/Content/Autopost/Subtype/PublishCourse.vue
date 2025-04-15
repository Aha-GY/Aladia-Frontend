<template>
  <div>
    <p class="text-sm font-medium">
      {{ $t('post.share.course') }}
    </p>
    <client-only>
      <PostsItemWidgetsCollapsableBubble
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
    handleShowDetail() {
      this.$emit('show-popup');
    },
  },
};
</script>

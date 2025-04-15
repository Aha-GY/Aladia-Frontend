<template>
  <div class="group flex items-center gap-2">
    <div class="shrink-0 pl-2 pr-4">
      <BaseCheckboxStyle
        :state="isSelect ? 'checked' : 'unchecked'"
        data-cy="682d8129135d00c1"
        @click="onSelect"
      />
    </div>
    <div class="relative h-6 w-10 shrink-0">
      <BaseCourseThumbnail class="h-full w-full" :url="entity.thumbnail?.url" />
    </div>
    <div
      class="w-0 flex-1 cursor-pointer truncate text-xs"
      data-cy="f682b8bc6aef7d1e"
      @click="handleClickItem"
    >
      {{ entity.title || '---' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const socialStore = useSocialStore();
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore, socialStore };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    entity() {
      return this.item.entity || {};
    },
    isSelect() {
      return this.hubReviewStore.selects.find(
        (item) => item.id === this.item.id,
      );
    },
  },
  methods: {
    onSelect() {
      if (this.isSelect) {
        this.hubReviewStore.selects = this.hubReviewStore.selects.filter(
          (item) => item.id !== this.item.id,
        );
      } else {
        this.hubReviewStore.selects = [
          ...this.hubReviewStore.selects,
          this.item,
        ];
      }
    },
    handleClickItem() {
      this.socialStore.showPostsPopup(this.item);
    },
  },
};
</script>

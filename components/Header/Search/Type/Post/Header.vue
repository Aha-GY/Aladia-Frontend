<template>
  <div class="flex items-center gap-1.5 text-13 text-white/50">
    <BaseAvatarNext
      :picture="item.owner?.picture"
      :story="item.owner?.story"
      :user-id="item.owner?.id"
      :online="item.owner?.online"
      size="sm"
    />
    <span
      class="max-w-64 cursor-pointer truncate text-white hover:underline"
      @click="onClick"
    >
      {{ item.owner?.name }}
    </span>
    <span>•</span>
    <div v-if="item.type === 'question'" class="flex items-center gap-1">
      <i class="fa-solid fa-messages-question" />
      <span>
        {{ $t('filter.qa') }}
      </span>
      <span>•</span>
    </div>
    <span>{{ timeAgo(item.createdAt) }}</span>
    <span>•</span>
    <PostsItemWidgetsVisibility :visibility="item.visibility" />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  setup() {
    const profileStore = useProfileStore();
    return { profileStore };
  },
  methods: {
    onClick() {
      this.profileStore.gotoProfilePage(this.item);
    },
  },
};
</script>

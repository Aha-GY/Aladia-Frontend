<template>
  <div
    class="flex items-center gap-2 rounded px-2 py-[0.375rem] transition-all hover:bg-white/5"
  >
    <BaseAvatarNext
      :picture="item.picture"
      :story="item?.story"
      :user-id="item?.id"
      :online="item.online"
      :source="source"
      size="md"
    />

    <div class="flex w-0 flex-1 items-center text-sm font-medium">
      <div
        class="cursor-pointer truncate text-[#F1F1F1] underline-offset-2 hover:underline"
        data-cy="07e516fda4c8ee98"
        @click="handleUserClick"
      >
        {{ item.name || item.fullName }}
      </div>
    </div>

    <div
      v-if="profileStore.myProfileDetail.id !== item.id"
      class="flex items-center"
    >
      <div
        class="flex h-6 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#E0B92C] px-2 text-black transition-all active:scale-95"
        data-cy="d77450c1b31286b3"
        @click="onChange"
      >
        <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
        <i v-else-if="item.isFollowing" class="fa-solid fa-circle-check" />
        <i v-else class="fa-solid fa-user-plus" />
        <div class="text-xs">
          {{
            item.isFollowing
              ? $t('base.member.following')
              : $t('base.member.follow')
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    showOnline: {
      type: Boolean,
      default: true,
    },
    userClick: Function,
    source: {
      type: String,
      default: '',
    },
  },
  setup() {
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    return { authStore, profileStore };
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async onChange() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        await this.profileStore.follow(this.item);
        this.$emit('onFollowing');
      } finally {
        this.loading = false;
      }
    },
    handleUserClick() {
      if (this.userClick) {
        this.userClick(this.item);
        return;
      }
      this.profileStore.gotoProfilePage(this.item);
    },
  },
};
</script>

<template>
  <div
    class="flex items-center gap-2 rounded bg-[#131313] px-2 py-[0.375rem] transition-all hover:bg-white/5"
  >
    <div class="relative">
      <BaseAvatarNext
        :picture="item.picture"
        :story="item?.story"
        :user-id="item?.id"
        size="md"
        :online="item.online"
      />
    </div>

    <div class="flex w-0 flex-1 items-center font-medium">
      <div class="flex flex-col truncate">
        <div
          class="cursor-pointer truncate text-[#F1F1F1] underline-offset-2 hover:underline"
          @click="handleUserClick"
          v-html="highlitedText"
        />

        <div class="text-xs">
          <div v-if="online" class="text-white/50">
            {{ $t('base.member.online') }}
          </div>
          <div v-else class="truncate text-white/50">
            {{ $t('base.member.lastSeen') }} {{ timeAgo(item.lastActivity) }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isMe && suggestion" class="flex items-center">
      <div
        class="flex h-6 cursor-pointer items-center justify-center gap-1 rounded-[0.3125rem] bg-[#E0B92C] px-1.5 py-1 text-[#0A0A0A] transition-all"
        @click="onChange"
      >
        <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
        <i
          v-else-if="item.isFollowing"
          class="fa-solid fa-circle-check text-xs"
        />
        <i v-else class="fa-light fa-user-plus text-xs font-[500]" />
        <div class="text-xs font-[500]">
          {{
            item.isFollowing
              ? $t('post.record.following')
              : $t('post.record.follow')
          }}
        </div>
      </div>
    </div>
    <div
      v-else-if="!isMe"
      class="flex h-7 w-7 cursor-pointer justify-center rounded p-2 hover:bg-white/5"
      @click="onChange"
    >
      <i class="fa-light fa-message text-sm" />
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
    suggestion: {
      type: Boolean,
      default: true,
    },
    name: {
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
      deleteFollowerLoading: false,
    };
  },
  computed: {
    isMe() {
      return this.authStore?.user?.id === this.item.id;
    },
    online() {
      return this.item.online;
    },
    highlitedText() {
      if (this.name !== '') {
        return highlightKeywords(this.item.name || this.item.fullName, [
          this.name,
        ]);
      }
      return this.item.name || this.item.fullName;
    },
  },
  methods: {
    async onChange() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        if (this.suggestion) {
          const res = await this.profileStore.follow(this.item);
          this.item.isFollowing = res.followed;
          this.$emit('change', {
            item: {
              ...this.item,
            },
            isfollow: res.followed,
          });
        } else {
          this.$emit('chat', {
            item: {
              ...this.item,
            },
          });
        }
      } finally {
        this.loading = false;
      }
    },
    handleHide() {
      this.$emit('hideItem', this.item.id);
    },
    handleUserClick() {
      this.profileStore.gotoProfilePage(this.item);
    },
  },
};
</script>

<template>
  <div
    class="flex items-center gap-2 rounded-md px-2 py-[0.375rem] transition-all hover:bg-white/5"
  >
    <div class="relative">
      <BaseAvatarNext
        :picture="item.picture"
        :story="item?.story"
        :user-id="item?.id"
        :size="'md'"
        :online="item.online"
        :source="source"
      />
    </div>

    <div class="flex flex-1 flex-col items-start text-sm">
      <div
        class="w-32 cursor-pointer truncate font-medium text-[#F1F1F1] underline-offset-2 hover:underline"
        :data-cy="`profile-${(item.name || item.fullName || '').toLowerCase().split(' ').join('-')}-name-button`"
        @click="handleUserClick"
        v-html="highlightKeywords(item.name || item.fullName, [searchName])"
      />
      <div
        class="truncate text-13 font-light tracking-tighter text-white/50"
        :class="isFollowerType ? 'w-32' : 'w-36'"
      >
        {{
          item.mainExperience
            ? isSuggest
              ? item.mainExperience?.name
              : item.mainExperience
            : item.bio
              ? stripHtml(item.bio)
              : '---'
        }}
      </div>
    </div>

    <div class="flex items-center">
      <div
        v-if="isSuggest"
        class="mx-2 cursor-pointer text-xs text-[#D9D9D9]/70 hover:text-[#D9D9D9]"
        data-cy="0d9a91ae9c59d2f6"
        @click="handleHide"
      >
        {{ $t('personal.profile.hide') }}
      </div>
      <div
        v-if="isFollowerType && isMinePage"
        class="mx-2 cursor-pointer text-xs text-[#D9D9D9]/70 hover:text-[#D9D9D9]"
        data-cy="636016cb4d0bac38"
        @click="handleRemoveFollower"
      >
        <i
          v-if="deleteFollowerLoading"
          class="fa-solid fa-spinner mr-1 animate-spin text-xs"
        />
        <span v-else>
          {{ $t('personal.profile.remove') }}
        </span>
      </div>

      <template v-if="!isSuggest">
        <div v-if="!isMinePage && item.isFollowing" class="text-[#D9D9D9]">
          <i class="fa-solid fa-circle-check" />
          {{ $t('base.member.following') }}
        </div>
      </template>
      <div
        v-if="!(!isMinePage && item.isFollowing)"
        class="flex h-6 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#E0B92C] px-2 text-black transition-all active:scale-95"
        data-cy="09e8a95bf827914a"
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
    isSuggest: {
      type: Boolean,
      default: false,
    },
    isFollowerType: {
      type: Boolean,
      default: false,
    },
    followerType: {
      type: String,
      default: 'profile',
    },
    isMinePage: {
      type: Boolean,
      default: false,
    },
    avatarSize: {
      type: String,
      default: 'large',
    },
    source: {
      type: String,
      default: '',
    },
    searchName: {
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
    avatarSizeClass() {
      switch (this.avatarSize) {
        case 'small':
          return {
            avatar: 'h-8 w-8',
            online: 'h-2 w-2',
          };
        case 'medium':
          return {
            avatar: 'h-10 w-10',
            online: 'h-3 w-3',
          };
        case 'large':
          return {
            avatar: 'h-12 w-12',
            online: 'h-4 w-4',
          };
        default:
          return {
            avatar: 'h-12 w-12',
            online: 'h-4 w-4',
          };
      }
    },
  },
  methods: {
    async handleRemoveFollower() {
      if (this.deleteFollowerLoading) {
        return;
      }
      try {
        this.deleteFollowerLoading = true;
        await this.profileStore.deleteFollower(this.item.id);

        if (this.isMinePage) {
          this.$emit('removeFollower', this.item.id);
          await this.profileStore.fetchProfile(
            this.profileStore.myProfileDetail,
          );
        }
      } finally {
        this.deleteFollowerLoading = false;
      }
    },
    async onChange() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const res = await this.profileStore.follow(this.item);
        this.$emit('change', {
          isSuggest: this.isSuggest,
          item: {
            ...this.item,
            isFollowing: res.followed,
          },
          isfollow: res.followed,
        });
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

<template>
  <div
    class="flex items-center justify-between gap-2 rounded p-2 transition-all hover:bg-white/10"
  >
    <div class="flex flex-1 items-center gap-4">
      <BaseAvatarNext
        :picture="user.picture"
        :story="user?.story"
        :user-id="user.id"
        source="search"
        size="md"
        :online="user.online"
      />
      <div class="flex-1">
        <div
          class="line-clamp-1 cursor-pointer break-all text-white hover:underline"
          :data-cy="`profile-${(user.name || user.fullName).toLowerCase().split(' ').join('-')}-name-button`"
          @click="handleUserClick"
          v-html="fullName"
        />
        <div class="text-sm text-white/50">
          <span v-if="type === 'organization'" class="capitalize">
            {{ $t('nav.header.notification.organization.name.singular') }}
          </span>
          <span v-else class="capitalize">{{ user.type }}</span>
          ·
          <span>
            {{ followers || 0 }}
            {{ $t('base.member.followers') }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div
        class="flex cursor-pointer items-center justify-center gap-1.5 rounded bg-[#E0B92C] px-3 py-1 text-black transition-all active:scale-95"
        :class="isSelf ? 'pointer-events-none opacity-50' : ''"
        data-cy="e1ab51ce8600a654"
        @click.stop="onFollowe"
      >
        <i v-if="followeing" class="fa-solid fa-spinner animate-spin text-sm" />
        <i v-else-if="isFollowing" class="fa-solid fa-circle-check" />
        <i v-else class="fa-light fa-user-plus" />
        <div class="text-sm">
          {{
            isFollowing ? $t('base.member.following') : $t('base.member.follow')
          }}
        </div>
      </div>
      <div
        v-if="!title"
        class="flex size-6 cursor-pointer items-center justify-center rounded text-sm hover:bg-white/20"
        data-cy="8739a1068fe7e532"
        @click.stop="onClose"
      >
        <i class="fa-regular fa-xmark" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      required: true,
      default: () => [],
    },
    user: {
      type: Object,
      required: true,
      default: () => ({
        numberOf: { followers: 0, followings: 0 },
      }),
    },
    type: {
      type: String,
      required: true,
      default: 'profile',
    },
  },
  setup() {
    const authStore = useAuthStore();
    const searchStore = useSearchStore();
    const profileStore = useProfileStore();
    const socialStore = useSocialStore();
    return {
      authStore,
      searchStore,
      socialStore,
      profileStore,
    };
  },
  data() {
    return {
      followeing: false,
      isFollowing: false,
      followers: 0,
      followings: 0,
    };
  },
  computed: {
    title() {
      return this.searchStore.query.title;
    },
    fullName() {
      const name =
        this.user.name ||
        this.user.fullName ||
        `${this.user.firstName} ${this.user.lastName}` ||
        '';

      if (this.title) {
        return highlightKeywords(name || '', [this.title]);
      } else {
        return name;
      }
    },
    isSelf() {
      return this.authStore.context === this.user.id;
    },
  },
  watch: {
    user: {
      handler() {
        this.isFollowing = this.user?.isFollowing || false;
        this.followers = this.user?.numberOf?.followers || 0;
        this.followings = this.user?.numberOf?.followings || 0;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleUserClick() {
      this.searchStore.isFocus = false;
      this.profileStore.gotoProfilePage({
        ...this.user,
        entityType: this.type,
      });
      if (this.authStore.logged) {
        this.socialStore.createProfileSearchHistory({
          id: this.user.id,
          type: this.type,
        });
      }
    },
    async onFollowe() {
      if (this.authStore.logged) {
        try {
          if (this.followeing) {
            return;
          }
          this.followeing = true;
          const data = await this.profileStore.follow(this.user);
          this.isFollowing = !!data.followed;
          this.followers = data.followed
            ? this.followers + 1
            : this.followers - 1 <= 0
              ? 0
              : this.followers - 1;
          this.followeing = false;
        } catch (error) {
          this.followeing = false;
          throw error;
        }
      } else {
        this.authStore.popup = true;
      }
    },
    async onClose() {
      if (this.authStore.logged) {
        this.users.splice(this.users.indexOf(this.user), 1);
        this.socialStore.deleteProfileSearchHistoryId({
          id: this.user.id,
          type: this.type,
        });
      } else {
        this.authStore.popup = true;
      }
    },
  },
};
</script>

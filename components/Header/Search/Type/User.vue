<template>
  <div
    class="h-40 flex-1 rounded border border-[#FFFEFE26] px-3 py-3 transition-all hover:border-transparent hover:bg-[#FFFEFE26]"
  >
    <div class="mb-5 flex items-center gap-3">
      <div class="relative flex size-20 items-center justify-center">
        <BaseAvatarNext
          :picture="user.picture"
          :story="user.story"
          :user-id="user.id"
          :show-online="false"
          :show-work="true"
          :work="user.status"
          size="lg"
        />
        <div
          v-if="user.stripeConnectOnboard === 'completed'"
          class="absolute -bottom-2 z-10 flex items-center gap-1 rounded-full border border-dashed border-[#35A823] bg-black/80 px-1 py-0.5 text-xs text-[#35A823] transition-all"
        >
          <i class="fa-light fa-shield-check" />
          {{ $t('nav.header.notification.user.verified') }}
        </div>
      </div>
      <div class="text-13">
        <div
          class="mb-1 max-w-32 cursor-pointer truncate text-sm font-medium hover:underline"
          data-cy="c6ba079b41debaa6"
          @click="onClick"
        >
          {{ user.fullName }}
        </div>
        <div class="mb-1 w-32 truncate font-light text-white/50">
          {{ user.mainExperience?.name || stripHtml(user.bio) || '---' }}
        </div>
        <div class="flex w-full shrink-0 items-center justify-between gap-3">
          <div>
            <div>{{ $t('base.member.followers') }}</div>
            <div>{{ formatNumber(followers || 0) }}</div>
          </div>
          <div>
            <div>{{ $t('base.member.following') }}</div>
            <div>{{ formatNumber(followings || 0) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex w-full items-center justify-between pl-1 text-xs">
      <div
        class="flex h-6 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#E0B92C] px-2 text-black transition-all active:scale-95"
        data-cy="21634009202885c6"
        @click="onFollowe"
      >
        <i v-if="followeing" class="fa-solid fa-spinner animate-spin text-xs" />
        <i v-else-if="isFollowing" class="fa-solid fa-circle-check" />
        <i v-else class="fa-light fa-user-plus" />
        <div class="text-xs">
          {{
            isFollowing ? $t('base.member.following') : $t('base.member.follow')
          }}
        </div>
      </div>
      <div
        class="flex h-6 cursor-pointer items-center gap-1 rounded-md border border-white/50 px-2 text-xs transition-all hover:border-white/0 hover:bg-white/5 active:scale-95"
        data-cy="e9199a84e2ddef5c"
        @click="onMessage"
      >
        <i class="fa-light fa-message" />
        {{ $t('nav.header.notification.banner.chat.message') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({
        numberOf: { followers: 0, followings: 0 },
      }),
    },
  },
  setup() {
    const profileStore = useProfileStore();
    const authStore = useAuthStore();
    return { profileStore, authStore };
  },
  data() {
    return {
      followeing: false,
      isFollowing: false,
      followers: 0,
      followings: 0,
    };
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
    async onFollowe() {
      if (this.authStore.logged) {
        if (this.followeing) {
          return;
        }
        try {
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
    onMessage() {
      if (this.authStore.logged) {
        this.$router.push(
          `${this.authStore.hub}/chat?${this.user.entityType === 'organization' ? 'orgId' : 'userId'}=${this.user.id}`,
        );
      } else {
        this.authStore.popup = true;
      }
    },
    onClick() {
      this.profileStore.gotoProfilePage(this.user);
    },
  },
};
</script>

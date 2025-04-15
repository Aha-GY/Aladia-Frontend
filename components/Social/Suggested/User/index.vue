<template>
  <div
    :class="
      type === 'carouselCard'
        ? 'h-[15.938rem] w-[12.875rem]'
        : 'mb-2 h-[15.938rem] w-[12.875rem] shrink-0'
    "
  >
    <div
      class="relative h-full rounded bg-black transition-all hover:bg-[#141414]"
    >
      <div class="absolute top-0 h-[4.25rem] w-full rounded-t bg-white/10">
        <img
          v-if="user.cover"
          :src="user.cover"
          class="h-full w-full rounded-t object-cover"
        />
        <img
          v-else
          src="~/assets/images/not-registered-bg.png"
          class="h-full w-full rounded-t object-cover"
        />
      </div>
      <div
        class="relative top-2 flex w-full flex-col items-center justify-center"
      >
        <div
          class="relative mb-2 flex size-24 flex-col items-center justify-center rounded-full bg-black p-1 transition-all group-hover/user:bg-[#141414]"
        >
          <BaseAvatarNext
            :picture="user.picture"
            size="lg"
            :story="user?.story"
            :user-id="user?.id"
            :show-online="false"
          />
          <div
            v-if="user.stripeConnectOnboard === 'completed'"
            class="absolute -bottom-1 z-10 flex items-center gap-1 rounded-full border border-dashed border-[#35A823] bg-black/80 px-1 py-0.5 text-xs text-[#35A823] transition-all"
          >
            <i class="fa-light fa-shield-check" />
            {{ $t('payment.verification.done') }}
          </div>
        </div>
        <div
          class="mb-0 mt-3 max-w-full cursor-pointer truncate px-3 text-center hover:underline"
        >
          {{ user.fullName }}
        </div>
        <div
          class="mb-3 max-w-full truncate px-3 text-center text-13 font-light text-white/50"
        >
          {{
            user.mainExperience?.name ||
            stripHtml(user.bio) ||
            'Mechanical Engineer'
          }}
        </div>
        <div class="max-w-96 px-3">
          <div
            class="mb-3 flex w-full items-center justify-between gap-6 text-13"
          >
            <div>
              {{
                $t('category.member.follower', {
                  count: followers || 0,
                })
              }}
            </div>
            <div>
              {{
                $t('category.member.following', {
                  count: followings || 0,
                })
              }}
            </div>
          </div>
          <div class="flex w-full items-center justify-between gap-6 text-xs">
            <div
              class="flex h-6 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#E0B92C] px-2 text-black transition-all active:scale-95"
              :data-cy="`follow-suggestion-${user.fullName.toLowerCase().replace(/ /g, '-')}-button`"
              @click="onFollowe"
            >
              <i
                v-if="followeing"
                class="fa-solid fa-spinner animate-spin text-xs"
              />
              <i v-else-if="isFollowing" class="fa-solid fa-circle-check" />
              <i v-else class="fa-light fa-user-plus" />
              <div class="text-xs">
                {{
                  isFollowing
                    ? $t('base.member.following')
                    : $t('base.member.follow')
                }}
              </div>
            </div>
            <div
              class="flex h-6 cursor-pointer items-center gap-1 rounded-md border border-white/50 px-2 text-xs transition-all hover:border-white/0 hover:bg-white/5 active:scale-95"
              data-cy="578b09d8ddd5b76c"
              @click="onMessage"
            >
              <i class="fa-light fa-message" />
              {{ $t('personal.profile.message') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({
        numberOf: { followers: 0, followings: 0 },
      }),
    },
    type: {
      type: String,
      default: 'card',
    },
  },
  setup() {
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    return { authStore, profileStore };
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
  },
};
</script>

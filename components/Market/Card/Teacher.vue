<template>
  <div class="shrink-0 p-2" :class="classNames">
    <div
      class="group/user relative h-56 rounded bg-black transition-all hover:bg-[#141414]"
    >
      <div class="absolute top-0 h-28 w-full rounded-t bg-white/10">
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
      <div class="absolute top-28 flex w-full gap-2 px-[6%] pt-1">
        <div
          class="relative -mt-10 flex size-20 shrink-0 flex-col items-center justify-center rounded-full transition-all"
        >
          <BaseAvatarNext
            :picture="user.picture"
            size="lg"
            :story="user?.story"
            :user-id="user.id"
            :show-online="false"
            class="rounded-full bg-black transition-all group-hover/user:bg-[#141414]"
          >
            <template v-if="type === 'organization'" #button>
              <div
                class="flex size-full items-center justify-center rounded-full bg-black"
              >
                <i
                  class="fa-solid fa-building-user scale-75 text-xs text-white"
                />
              </div>
            </template>
          </BaseAvatarNext>
          <div
            v-if="
              user.stripeConnectOnboard === 'completed' && type === 'profile'
            "
            class="absolute -bottom-2 z-10 flex items-center gap-1 rounded-full border border-dashed border-[#35A823] bg-black/80 px-1 py-0.5 text-xs text-[#35A823] transition-all"
          >
            <i class="fa-light fa-shield-check" />
            {{ $t('payment.verification.done') }}
          </div>
        </div>
        <div class="w-0 flex-1 pl-[6%]">
          <div
            class="cursor-pointer truncate text-sm hover:underline"
            @click="onNameClick"
          >
            {{ user.name || user.fullName }}
          </div>
          <div
            v-if="type === 'organization'"
            class="mb-2 truncate text-xs font-light text-white/50"
          >
            {{ stripHtml(user.description) || '---' }}
          </div>
          <div
            v-if="type === 'profile'"
            class="mb-2 truncate text-xs font-light text-white/50"
          >
            {{ user.mainExperience?.name || '---' }}
          </div>
          <div
            v-if="type === 'organization'"
            class="mb-2 flex max-w-48 items-center justify-between text-xs"
          >
            <div>
              {{
                $t('category.member.label', {
                  count: formatNumber(user?.numberOf?.members || 0),
                })
              }}
            </div>
            <div>
              {{
                $t('category.member.post', {
                  count: formatNumber(user?.numberOf?.posts || 0),
                })
              }}
            </div>
          </div>
          <div
            v-if="type === 'profile'"
            class="mb-2 flex max-w-48 items-center justify-between text-xs"
          >
            <div class="truncate">
              {{
                $t('category.member.follower', {
                  count: formatNumber(followers || 0),
                })
              }}
            </div>
            <div class="truncate">
              {{
                $t('category.member.following', {
                  count: formatNumber(followings || 0),
                })
              }}
            </div>
          </div>
          <div class="flex max-w-48 items-center justify-between gap-1 text-xs">
            <div
              class="flex h-6 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#E0B92C] px-2 text-black transition-all active:scale-95"
              :class="isOwner ? 'pointer-events-none opacity-50' : ''"
              data-cy="4dd8ac3bde194b44"
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
              :class="isOwner ? 'pointer-events-none opacity-50' : ''"
              data-cy="953384887f3281a7"
              @click="onMessage"
            >
              <i class="fa-light fa-message" />
              {{ $t('nav.header.notification.banner.chat.message') }}
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
        numberOf: { followers: 0, followings: 0, posts: 0, members: 0 },
      }),
      required: true,
    },
    type: {
      type: String,
      default: 'profile',
    },
    from: {
      type: String,
      default: '',
    },
  },
  setup() {
    const authStore = useAuthStore();
    const marketStore = useMarketStore();
    const profileStore = useProfileStore();
    return { authStore, profileStore, marketStore };
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
    isOwner() {
      return this.user.id === this.authStore.context;
    },
    classNames() {
      if (this.from === 'search') {
        return 'w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5';
      }

      if (this.from === 'feed') {
        return 'w-full sm:w-1/2 px-1';
      }

      if (this.type === 'organization') {
        return 'w-[90%] sm:w-[60%] md:w-[60%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%]';
      }

      if (this.type === 'profile') {
        return 'w-[80%] sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5';
      }

      return '';
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
    async onFollowe() {
      if (this.authStore.logged) {
        if (this.followeing) {
          return;
        }
        try {
          this.followeing = true;
          this.user.entityType = this.type;
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
    onNameClick() {
      this.profileStore.gotoProfilePage(this.user);
    },
  },
};
</script>

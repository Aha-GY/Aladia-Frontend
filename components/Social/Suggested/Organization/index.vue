<template>
  <div
    :class="
      type === 'carouselCard'
        ? 'h-[15.375rem] w-[20.063rem] shrink-0'
        : 'h-[15.375rem] w-[20.063rem] shrink-0'
    "
  >
    <div
      class="group/user relative h-full rounded bg-black transition-all hover:bg-[#141414]"
    >
      <div class="absolute top-0 h-28 w-full rounded-t bg-white/10">
        <img
          v-if="organization.picture"
          :src="organization.picture"
          class="h-full w-full rounded-t object-cover"
        />
        <img
          v-else
          src="~/assets/images/not-registered-bg.png"
          class="h-full w-full rounded-t object-cover"
        />
      </div>
      <div class="absolute top-28 flex w-full gap-2 px-3 pt-1">
        <div
          class="relative -mt-10 flex size-20 shrink-0 flex-col items-center justify-center rounded-full bg-black p-1 transition-all"
        >
          <BaseAvatarNext
            :picture="organization.picture"
            size="lg"
            :story="organization?.story"
            :user-id="organization?.id"
            :show-online="false"
          />
          <div
            class="absolute left-14 top-12 flex size-6 items-center justify-center rounded-full bg-black"
          >
            <i class="fa-solid fa-building-user scale-75 text-xs text-white" />
          </div>
        </div>
        <div class="w-0 flex-1">
          <div class="cursor-pointer truncate text-sm hover:underline">
            {{ organization.name || organization.fullName }}
          </div>
          <div
            v-if="organization.position"
            class="mb-2 text-center font-sans text-[14px] font-normal leading-[16.94px] text-[#D9D9D9B2]"
          >
            {{ organization.position }}
          </div>
          <div
            v-if="organization.bio"
            class="mb-2 text-center font-sans text-[14px] font-normal leading-[16.94px] text-[#D9D9D9B2]"
          >
            {{ organization.bio }}
          </div>
          <div v-else class="mb-2 text-xs font-light text-white/50">
            {{ stripHtml(organization.description) || '---' }}
          </div>
          <div class="mb-2 flex max-w-48 items-center justify-between text-xs">
            <div>
              {{ formatNumber(organization?.numberOf?.members || 0) }} Members
            </div>
            <div>
              {{ formatNumber(organization?.numberOf?.posts || 0) }} Posts
            </div>
          </div>

          <div class="flex max-w-48 items-center justify-between text-xs">
            <div
              class="flex h-6 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#E0B92C] px-2 text-black transition-all active:scale-95"
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
    organization: {
      type: Object,
      required: true,
      default: () => ({
        numberOf: { posts: 0, members: 0 },
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
    organization: {
      handler() {
        this.isFollowing = this.organization?.isFollowing || false;
        this.followers = this.organization?.numberOf?.followers || 0;
        this.followings = this.organization?.numberOf?.followings || 0;
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
          this.organization.entityType = this.type;
          const data = await this.profileStore.follow(this.organization);
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
          `${this.authStore.hub}/chat?${this.organization.entityType === 'organization' ? 'orgId' : 'userId'}=${this.organization.id}`,
        );
      } else {
        this.authStore.popup = true;
      }
    },
  },
};
</script>

<template>
  <div
    class="group/user relative flex h-[18.75rem] w-80 flex-col rounded-5 bg-black/60 transition-all"
  >
    <div v-if="!user" class="relative h-full w-full">
      <BaseSkeleton :length="1" height="100%" class="h-full w-full" />
    </div>
    <template v-else>
      <div class="absolute top-0 h-24 w-full rounded-t-5 bg-white/10">
        <img
          v-if="user.cover"
          :src="user.cover"
          class="h-full w-full rounded-t-5 object-cover"
        />
        <img
          v-else
          src="~/assets/images/not-registered-bg.png"
          class="h-full w-full rounded-t-5 object-cover"
        />
      </div>
      <div class="flex w-full flex-col items-center justify-center py-2 pt-10">
        <div
          class="mb-10 flex size-20 flex-col items-center rounded-full bg-black/60 p-1 transition-all"
        >
          <BaseAvatarNext
            :show-online="false"
            :picture="user.picture"
            size="lg"
          />
          <div
            v-if="user.stripeConnectOnboard === 'completed'"
            class="relative z-10 -mt-4 flex items-center gap-1 rounded-full border-[0.125rem] border-dotted border-[#35A823] bg-black/50 px-1.5 py-0.5 text-sm text-[#35A823] transition-all"
          >
            <i class="fa-regular fa-shield-check" />
            {{ $t('org.content.verified') }}
          </div>
        </div>
        <div
          class="mb-0 w-full cursor-pointer truncate px-10 text-center underline-offset-2 hover:underline"
          data-cy="4c0985bafebbebe4"
          @click.stop="visitProfile(user)"
        >
          <span class="truncate">{{ user.fullName }}</span>
        </div>
        <div class="mb-3 text-sm font-light text-white/50">
          {{ user.mainExperience?.name || '---' }}
        </div>
        <div class="flex w-full items-center justify-center gap-6 px-3 text-13">
          <div
            class="flex cursor-pointer items-center gap-2 rounded border border-white/30 p-2 px-4 pb-1.5 text-xs transition-all hover:border-white/20 hover:bg-white/5"
            data-cy="04ba9c72592a005f"
            @click="onBlock"
          >
            <i
              v-if="deleteLoading"
              class="fa-regular fa-spinner animate-spin"
            />
            <i v-else class="fa-regular fa-ban" />
            {{ $t('org.content.block') }}
          </div>
          <BaseButton
            :loading="following"
            :icon="
              user.isFollowing
                ? 'fa-regular fa-user-minus'
                : 'fa-regular fa-user-plus'
            "
            data-cy="ba71e8990089ff0a"
            @click="onFollow"
          >
            {{
              user.isFollowing
                ? $t('flux.friendship.unFollow')
                : $t('flux.friendship.follow')
            }}
          </BaseButton>
        </div>
        <div
          class="flex items-center justify-center gap-2 py-2 pt-4 text-sm text-[#FF4A4A]/80"
        >
          <i class="fa-regular fa-triangle-exclamation" />
          {{ $t('org.account.notFollower') }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    room: {
      type: Object,
      required: true,
    },
  },
  emits: ['locate-last-message'],
  setup() {
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const hubChatStore = useHubChatStore();
    return { authStore, profileStore, hubChatStore };
  },
  data() {
    return {
      following: false,
      deleteLoading: false,
    };
  },
  async mounted() {
    await sleep(0);
    this.$emit('scroll-to-distance', 320);
  },
  methods: {
    async onFollow() {
      if (this.user.isFollowing) {
        return;
      }
      try {
        this.following = true;
        const data = await this.profileStore.follow(this.user);
        this.user.isFollowing = !!data.followed;
        this.following = false;
        this.room.oneToOnePeer.isFollowing = true;
      } catch (error) {
        this.following = false;
        throw error;
      }
    },
    async onBlock() {
      this.deleteLoading = true;
      const params = {
        roomId: this.room.id,
        deleteForAll: true,
      };
      await this.hubChatStore.deleteRoom(params);
      this.deleteLoading = false;
    },
    visitProfile(item) {
      this.profileStore.gotoProfilePage(item);
    },
  },
};
</script>

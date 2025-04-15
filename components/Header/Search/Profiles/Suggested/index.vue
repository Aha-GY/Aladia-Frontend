<template>
  <div class="h-full px-4">
    <div class="mb-3">
      <div class="mb-3 flex h-8 items-center justify-between">
        <div>{{ $t('nav.header.profile.label') }}</div>
        <div
          v-if="profiles.length"
          class="flex cursor-pointer items-center gap-1 rounded-md border border-white/50 px-2 py-1 text-xs transition-all hover:border-white/0 hover:bg-white/5 active:scale-95"
          data-cy="1ac936034782a002"
          @click="onClear"
        >
          {{ $t('nav.header.profile.clear') }}
        </div>
      </div>
      <HeaderSearchProfilesEmpty v-if="!profiles.length && !loading" />
      <div v-if="loading" class="flex flex-col gap-1">
        <HeaderSearchSkeletonProfile v-for="n in 6" :key="n" />
      </div>
      <div v-else class="flex flex-col gap-1">
        <HeaderSearchTypeProfile
          v-for="user in profiles"
          :key="user.id"
          :user="user"
          :users="profiles"
          :type="user.searchedType"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();
    return { authStore, socialStore, fluxesStore };
  },
  data() {
    return {
      profiles: [],
      loading: true,
    };
  },
  mounted() {
    this.getHistory();
  },
  methods: {
    async getHistory() {
      this.loading = true;
      const { data } = await this.socialStore.getProfileSearchHistory({
        limit: 6,
      });
      this.profiles = data.map((profile) => {
        profile.searched.isFollowing = profile.isFollowing;
        profile.searched.searchedType = profile.searchedType;
        return profile.searched;
      });
      this.loading = false;
    },
    onClear() {
      this.dialog = false;
      if (this.authStore.logged) {
        this.profiles = [];
        this.socialStore.deleteProfileSearchHistory();
      } else {
        this.authStore.popup = true;
      }
    },
  },
};
</script>

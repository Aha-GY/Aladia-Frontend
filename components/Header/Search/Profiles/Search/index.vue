<template>
  <div class="flex h-full w-full flex-col gap-4">
    <HeaderSearchProfilesEmpty v-if="!length && !loading" />
    <div
      v-if="loading"
      class="hide-scrollbar flex h-0 w-full flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-4"
    >
      <HeaderSearchSkeletonProfile v-for="n in 6" :key="n" />
    </div>
    <div
      v-else
      class="hide-scrollbar relative flex h-0 w-full flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-4"
    >
      <div v-if="profiles.length" class="mb-3">
        <div class="mb-2 flex items-center justify-between">
          <div>{{ $t('nav.header.notification.user.name') }}</div>
          <div
            class="flex cursor-pointer items-center gap-1 rounded-md border border-white/50 px-2 py-1 text-xs transition-all hover:border-white/0 hover:bg-white/5 active:scale-95"
            data-cy="search-profile-view-all-button"
            @click="onMore('profile')"
          >
            {{ $t('nav.header.notification.user.viewAll') }}
          </div>
        </div>
        <HeaderSearchTypeProfile
          v-for="user in profiles"
          :key="user.id"
          :user="user"
          type="profile"
        />
      </div>
      <div v-if="organizations.length">
        <div class="mb-2 flex items-center justify-between">
          <div>
            {{ $t('nav.header.notification.organization.name.plural') }}
          </div>
          <div
            class="flex cursor-pointer items-center gap-1 rounded-md border border-white/50 px-2 py-1 text-xs transition-all hover:border-white/0 hover:bg-white/5 active:scale-95"
            data-cy="ff10b7b8dd58ad30"
            @click="onMore('organization')"
          >
            {{ $t('nav.header.notification.user.viewAll') }}
          </div>
        </div>
        <HeaderSearchTypeProfile
          v-for="user in organizations"
          :key="user.id"
          :user="user"
          type="organization"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const searchStore = useSearchStore();
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();
    return { authStore, searchStore, socialStore, fluxesStore };
  },
  data() {
    return {
      profiles: [],
      organizations: [],
      timer: null,
      loading: false,
    };
  },
  computed: {
    title() {
      return this.searchStore.query.title;
    },
    length() {
      return this.profiles.length + this.organizations.length;
    },
  },
  watch: {
    title() {
      this.profiles = [];
      this.organizations = [];
      this.loading = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.search();
      }, 1000);
    },
  },
  mounted() {
    this.search();
  },
  methods: {
    async search() {
      try {
        this.loading = true;
        const { organizations, profiles } =
          await this.socialStore.searchProfilesAndOrganizations({
            limit: 3,
            text: this.title,
          });
        this.profiles = profiles || [];
        this.organizations = organizations || [];
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    onMore(type) {
      this.searchStore.isFocus = false;
      this.$router.push({
        path: `/${type}`,
        query: {
          title: this.title,
        },
      });
    },
  },
};
</script>

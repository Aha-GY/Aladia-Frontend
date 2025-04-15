<template>
  <NuxtLayout>
    <Head>
      <Title>{{ title }} - Aladia</Title>
    </Head>
    <client-only>
      <OrganizationHubHeader v-if="!authStore.switching" />
    </client-only>
    <div class="relative px-2 pt-14 md:px-4">
      <NuxtPage v-if="!authStore.switching" />
      <PaymentServiceSubDialog />
      <!-- AI steam storage 等服务403失败弹窗 -->
      <PaymentServiceFailedDialog />
      <FluxesCreation v-if="fluxesStore.creationVisible" />
      <FluxesPreviewMainWrapper />
      <FluxesReelPreviewWrapper />
    </div>
    <OrganizationHubSidebar v-if="hubSidebar.state" />
    <OrganizationHubShareLoading v-show="authStore.switching" :logo="logo" />
  </NuxtLayout>
</template>

<script>
export default {
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    const hubSidebar = useHubSidebarStore();
    const profileStore = useProfileStore();
    const fluxesStore = useFluxesStore();

    if (route.params.name?.length !== 24) {
      showError({
        statusCode: 404,
        statusMessage: `${this.$t('event.user.notFound')} ${route.params.name}`,
      });
    }

    return { hubSidebar, authStore, profileStore, fluxesStore };
  },
  computed: {
    title() {
      const name = this.$route.name?.split('-')?.pop();
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    logo() {
      return this.authStore.isUser
        ? this.authStore.user.picture
        : this.profileStore.myOrgProfileDetail?.picture;
    },
  },
  beforeMount() {
    this.init();
  },
  methods: {
    getId() {
      return useRoute().params.name;
    },
    async init() {
      this.authStore.switching = true;
      const id = this.getId();
      await this.authStore.switchContext({ id });
      await sleep(100);
      if (id !== this.getId() && this.getId()) {
        return;
      }
      try {
        if (id === this.authStore.user.id) {
          await this.profileStore.getUserProfile({
            profileId: id,
          });
          this.profileStore.setMyOrganizationDetail({});
          this.profileStore.getMyOrganizations();
        } else {
          await this.profileStore.getOrganizationDetail({ organizationId: id });
        }
      } catch (error) {
        if (error.status === 404) {
          showError({
            statusCode: 404,
            statusMessage: error.response?.data?.message || error.message,
          });
        }
      }

      this.authStore.switching = false;
    },
  },
};
</script>

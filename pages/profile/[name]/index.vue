<template>
  <NuxtLayout>
    <Head>
      <Title>{{ $t('calendar.profile') }}</Title>
    </Head>
    <OrganizationHubHeader v-if="!authStore.switching" />
    <div
      v-if="isProfileLoading"
      class="flex h-[70vh] w-full items-center justify-center"
    >
      <div class="relative flex h-64 w-64 items-center justify-center">
        <img
          class="absolute h-full w-full object-cover"
          src="~/assets/images/splash/bg.gif"
        />
      </div>
    </div>
    <PersonalDetail
      v-else
      class="relative text-[#D9D9D9] transition-all duration-500"
    />
    <PostsDetail />
    <FluxesPreviewMainWrapper />
  </NuxtLayout>
</template>

<script>
import WebSocketService from '~/utils/websocket';

export default {
  setup() {
    const route = useRoute();
    const profileStore = useProfileStore();
    const authStore = useAuthStore();
    const websocket = WebSocketService.getInstance();

    if (route.params.name?.length !== 24) {
      showError({
        statusCode: 404,
        statusMessage: `Profile Not Found: ${route.params.name}`,
      });
    }

    return { profileStore, websocket, authStore };
  },
  data() {
    return {
      isProfileLoading: true,
    };
  },
  mounted() {
    const name = this.$route.params.name;
    this.load(name);
    this.websocket.send('user-view-profile', {
      viewedProfileId: name,
      viewedProfileType: 'profile',
    });
  },
  beforeUnmount() {
    this.profileStore.otherUserProfileDetail = {};
  },
  methods: {
    async load(id) {
      this.isProfileLoading = true;
      try {
        await this.profileStore.getUserProfile({
          profileId: id,
        });
      } catch (error) {
        if (error.status === 404) {
          showError({
            statusCode: 404,
            statusMessage: error.response?.data?.message || error.message,
          });
        }
      } finally {
        this.isProfileLoading = false;
      }
    },
  },
};
</script>

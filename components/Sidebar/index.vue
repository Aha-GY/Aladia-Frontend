<template>
  <div
    class="fixed bottom-0 left-0 top-0 z-[70] flex w-[4.5rem] flex-col gap-2 overflow-hidden bg-[#060606] px-2 pb-4 pt-2 text-[#D9D9D9] transition-all duration-300"
  >
    <div class="mb-6 flex w-full items-center justify-center">
      <NuxtLink to="/">
        <img src="~/assets/logo/image5.png" class="w-14" />
      </NuxtLink>
    </div>
    <SidebarItem
      :tooltip="$t('index.sidebar.item.marketplace')"
      :active="active === 'courses'"
      data-cy="c84a4fe224b9896e"
      @click="onMenuClick('/marketplace')"
    >
      <i class="fa-solid fa-shop" />
    </SidebarItem>
    <div class="my-2 h-[1px] w-full bg-[#303030]" />
    <SidebarItem
      :tooltip="$t('index.sidebar.item.feed')"
      :active="active === 'feed'"
      data-cy="a0ee56e023f104fd"
      @click="onMenuClick('/feed')"
    >
      <i class="fa-solid fa-share-nodes" />
    </SidebarItem>
    <SidebarItem
      :tooltip="userFullNameTruncated"
      :active="active === 'profile'"
      data-cy="profile-side-bar-item"
      @click="onMenuClick('/profile')"
    >
      <BaseAvatarNext :picture="user.picture" size="md" :show-online="false" />
    </SidebarItem>
    <SidebarItem
      :tooltip="$t('index.sidebar.item.spaces')"
      :active="active === 'spaces'"
      data-cy="sidebar-space-icon"
      @click="onMenuClick('/spaces?view=grid')"
    >
      <i class="fa-solid fa-book-open-reader" />
    </SidebarItem>
    <div class="my-2 h-[1px] w-full bg-[#303030]" />
    <SidebarItem
      :tooltip="$t('index.sidebar.item.createOrg')"
      :active="active === creatingOrg"
      data-cy="edc11915b209ba2f"
      @click="onMenuClick('create-org')"
    >
      <i
        class="fa-light text-[#EAB308]"
        :class="[creatingOrg ? 'fa-spinner animate-spin' : 'fa-plus-circle']"
      />
    </SidebarItem>
    <div class="hide-scrollbar flex flex-1 flex-col overflow-y-auto">
      <SidebarItem
        v-for="item in orgList"
        :key="item.id"
        :tooltip="item.name"
        class="mb-2"
        :active="active === `org-profile-${item.id}`"
        :data-cy="`organization-list-${item.id}`"
        @click="onOrgClick(item)"
      >
        <BaseAvatarNext
          :show-online="false"
          size="md"
          :picture="item.picture"
          default-icon="fa-solid fa-building-ngo text-base"
        />
      </SidebarItem>
    </div>
  </div>
</template>

<script>
import WebSocketService from '~/utils/websocket';

export default {
  setup() {
    const websocket = WebSocketService.getInstance();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const paymentStore = usePaymentStore();

    return { websocket, authStore, profileStore, paymentStore };
  },
  data() {
    return {
      creatingOrg: false,
    };
  },
  computed: {
    user() {
      return this.authStore.user;
    },
    orgList() {
      return this.profileStore.myOrganizationList;
    },
    active() {
      const name = this.$route.name || '';
      const id = this.$route.params.name || '';

      if (name.includes('user-hub-name')) {
        return name.split('-').pop();
      }
      if (name.includes('organization-hub-name-profile')) {
        return `org-profile-${id}`;
      }

      const regex = /^(organization-hub|user-hub)/;
      if (regex.test(name)) {
        return id;
      }

      return name;
    },
    switching() {
      return this.authStore.switching;
    },
    userFullNameTruncated() {
      return this.user.fullName.length > 32
        ? `${this.user.fullName.slice(0, 32)}...`
        : this.user.fullName;
    },
  },
  mounted() {
    this.websocket.on(
      'organization-member-removed',
      this.organizationMemberRemoved,
    );
  },
  beforeUnmount() {
    this.websocket.off(
      'organization-member-removed',
      this.organizationMemberRemoved,
    );
  },
  methods: {
    async organizationMemberRemoved(data) {
      const { organizationId, profileId } = data || {};
      if (profileId === this.user.id) {
        const orgList = this.orgList.filter((org) => org.id !== organizationId);
        this.profileStore.setMyOrganizationList(orgList);
        if (this.profileStore.myProfileDetail.id === organizationId) {
          this.$toast.success('You have been removed from the organization');
          this.$router.replace(`/user/hub/${this.user.id}/profile`);
        }
      }
    },
    async onMenuClick(path) {
      if (this.switching) {
        return;
      }

      if (path === '/marketplace') {
        this.$router.push(`/marketplace`);
        return;
      }

      if (
        path.includes('feed') ||
        path.includes('profile') ||
        path.includes('spaces')
      ) {
        this.$router.push(`/user/hub/${this.user.id}${path}`);
        return;
      }

      if (path === 'create-org') {
        this.authStore.switching = true;
        this.creatingOrg = true;
        const createRes = await this.profileStore.createOrganization({
          autoGenerated: true,
        });
        const switchRes = await this.profileStore.switchMyProfile({
          profile: createRes,
          redirect: false,
        });
        if (switchRes) {
          this.$router.push(
            `/organization/hub/${createRes.id}/profile?new=true`,
          );
          await sleep(500);
          this.paymentStore.setServiceDialog(true);
        }
        this.authStore.switching = false;
        this.creatingOrg = false;
        return;
      }

      const isOrg = this.authStore.isOrg;
      const id = this.profileStore.myProfileDetail.id;
      const url = `/${isOrg ? 'organization' : 'user'}/hub/${id}${path}`;
      this.$router.push(url);
    },
    onOrgClick(item) {
      const id = this.$route.params.name || '';
      const url = `/organization/hub/${item.id}/profile`;
      if (this.switching || url === this.$route.path) {
        return false;
      }
      if (item.id !== id && this.$route.path.includes('/organization/hub')) {
        this.profileStore.setMyOrganizationDetail(item);
      }
      this.$router.push(url);
    },
  },
};
</script>

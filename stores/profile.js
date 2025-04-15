import menuConst from '@/components/Profile/Setting/Dialog/menuConst';
import { follow, deleteFollower } from '~/api/v2/followers';
import {
  createOrganizations,
  updateOrganizations,
  patchVerificationOrganization,
  retrieveOrganizationsProfile,
} from '~/api/v2/org';
import { patchProfile, retrieveProfile, becomeTeacher } from '~/api/v2/profile';
import orgMenuConst from '~/components/Profile/Setting/Dialog/orgMenuConst';
import { replacePath } from '~/utils/index';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    // personal
    profileTab: 0,
    settingTitle: '',
    myUserProfileDetail: {},
    otherUserProfileDetail: {},
    menuConst,
    settingDialogMenuId: menuConst.AccountMenu[0].id,
    openSettingDialog: false,

    // organization
    orgMenuConst,
    myOrganizationList: [],
    myOrgProfileDetail: {},
    otherOrgProfileDetail: {},
  }),
  persist: {
    key: 'profile-store',
    storage: piniaPluginPersistedstate.localStorage(),
    pick: ['myOrgProfileDetail'],
  },
  getters: {
    myProfileDetail() {
      const authStore = useAuthStore();
      return authStore.isOrg
        ? this.myOrgProfileDetail
        : this.myUserProfileDetail;
    },
  },
  actions: {
    async setLanguage(lang) {
      const { $setDayjsLanguage, $i18n } = useNuxtApp();
      const paymentStore = usePaymentStore();
      const userStore = useAuthStore();
      $i18n.setLocale(lang);
      $setDayjsLanguage(lang);
      paymentStore.initStripe(lang);

      const settings = { ...userStore.user.settings, language: lang };
      await patchProfile({ settings });
    },
    openDialog() {
      this.openSettingDialog = true;
    },
    updateActiveMenu(menuId) {
      this.settingDialogMenuId = menuId;
    },
    async getUserProfile(params) {
      const route = useRoute();
      const data = await retrieveProfile(params);
      if (route.params.name === this.myProfileDetail.id) {
        this.myUserProfileDetail = { ...data };
      } else {
        this.otherUserProfileDetail = { ...data };
      }
      return { ...data, isMe: route.params.name === this.myProfileDetail.id };
    },
    resetMyProfile() {
      const userStore = useAuthStore();
      this.myUserProfileDetail = { ...userStore.user };
    },
    async updateMyProfile(obj = null, update = true) {
      const authStore = useAuthStore();
      const data = await patchProfile(obj);
      if (update) {
        await authStore.getInfo();
      }
      return data;
    },
    async becomeTeacher(params) {
      const data = await becomeTeacher(params);
      return data;
    },
    async patchProfile(params) {
      const data = await patchProfile(params);
      return data;
    },

    // organization
    resetMyOrgProfile() {
      this.setMyOrganizationDetail({ ...this.myOrgProfileDetail });
    },
    async getMyOrganizations() {
      const authStore = useAuthStore();
      const { organizations } = await authStore.getInfo();
      return organizations;
    },
    setMyOrganizationList(data) {
      this.myOrganizationList = data.map((item) => ({
        ...item,
        fullName: item.name,
        entityType: 'organization',
      }));
      const myOrganizationList = useCookie('myOrganizationList', {
        maxAge: 60 * 60 * 24 * 365 * 10,
      });
      myOrganizationList.value = data.map((item) => item.id) || [];
    },
    async createOrganization(params) {
      const data = await createOrganizations(params);
      await this.getMyOrganizations();
      return data;
    },
    async updateOrganizations(params, update = true) {
      const data = await updateOrganizations({
        organizationId: this.myOrgProfileDetail.id,
        ...params,
      });
      if (update) {
        await this.getMyOrganizations();
        this.setMyOrganizationDetail(data);
      }
      return data;
    },
    async verificationOrganization(params) {
      const data = await patchVerificationOrganization({
        organizationId: this.myOrgProfileDetail.id,
        ...params,
      });
      return data;
    },
    setMyOrganizationDetail(organization, isMe = true) {
      const detail = {
        ...organization,
        fullName: organization.name,
        entityType: organization.id ? 'organization' : undefined,
      };
      if (isMe) {
        const org = useCookie('org');
        this.myOrgProfileDetail = detail;
        org.value = {
          id: detail.id,
          email: detail.email,
          username: detail.username,
          fullName: detail.fullName,
          picture: detail.picture,
          entityType: detail.entityType,
          stripeConnectOnboard: detail.stripeConnectOnboard,
          // 用于判断订阅状态
          hasServiceSubscription: detail.hasServiceSubscription,
        };
      } else {
        this.otherOrgProfileDetail = detail;
      }
    },
    async getOrganizationDetail(params, exitParams = {}) {
      const data = await retrieveOrganizationsProfile(params);
      const isMe = exitParams.isOther
        ? false
        : this.myOrganizationList.some((item) => item.id === data.id);
      this.setMyOrganizationDetail(data, isMe);
      return { ...data, isMe };
    },

    // common
    async follow(params) {
      const _params = {
        followerId: params.id,
        followeeType:
          params.entityType === 'organization' ? 'organization' : 'profile',
      };
      try {
        const data = await follow(_params);
        this.updateFollowInProfilePage(params, data.followed);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteFollower(followerId) {
      const data = await deleteFollower(followerId);
      return data;
    },
    async updateFollowInProfilePage(followUser, followed) {
      const myProfile = this.myProfileDetail;
      const route = useRoute();
      const isMyProfile = route.params.name === myProfile.id;
      const isfollowUserProfilePage = route.params.name === followUser.id;
      if (isfollowUserProfilePage) {
        const profileDetail =
          followUser.entityType === 'organization'
            ? this.otherOrgProfileDetail
            : this.otherUserProfileDetail;
        const numberOf = {
          ...profileDetail.numberOf,
          followers: followed
            ? profileDetail.numberOf?.followers + 1
            : profileDetail.numberOf?.followers - 1 <= 0
              ? 0
              : profileDetail.numberOf?.followers - 1,
        };
        const followers = !followed
          ? profileDetail.followers?.filter((item) => item.id !== myProfile.id)
          : profileDetail.followers?.length < 4
            ? [myProfile, ...profileDetail.followers]
            : profileDetail.followers;
        this[
          followUser.entityType === 'organization'
            ? 'otherOrgProfileDetail'
            : 'otherUserProfileDetail'
        ] = {
          ...profileDetail,
          isFollowing: followed,
          numberOf,
          followers,
        };
      }
      if (isMyProfile) {
        const numberOf = {
          ...myProfile.numberOf,
          followings: followed
            ? myProfile.numberOf.followings + 1
            : myProfile.numberOf.followings - 1 <= 0
              ? 0
              : myProfile.numberOf.followings - 1,
        };
        const following = !followed
          ? myProfile.following.filter((item) => item.id !== followUser.id)
          : myProfile.following.length < 4
            ? [followUser, ...myProfile.following]
            : myProfile.following;
        this[
          myProfile.entityType === 'organization'
            ? 'myOrgProfileDetail'
            : 'myUserProfileDetail'
        ] = {
          ...myProfile,
          numberOf,
          following,
        };
      }
    },
    async fetchProfile(params) {
      const { id, entityType } = params;
      const res =
        entityType === 'organization'
          ? await this.getOrganizationDetail({ organizationId: id })
          : await this.getUserProfile({ profileId: id });
      return res;
    },
    async updateProfile(params, update = true) {
      const authStore = useAuthStore();
      return authStore.isOrg
        ? await this.updateOrganizations(params, update)
        : await this.updateMyProfile(params, update);
    },
    async resetProfile() {
      const authStore = useAuthStore();
      return authStore.isOrg ? this.resetMyOrgProfile() : this.resetMyProfile();
    },
    parseMyPhoneNumberStr(value) {
      const phoneNumberStr = value || this.myProfileDetail.phoneNumber;
      const [phoneNumber, phoneNumberFlag, phoneNumberPrefix] = (
        typeof phoneNumberStr === 'string' ? phoneNumberStr : ''
      ).split(',');
      return {
        value: phoneNumber,
        flag: phoneNumberFlag ?? 'it',
        prefix: +phoneNumberPrefix || 39,
      };
    },
    getPersonalProfileDetail() {
      const route = useRoute();
      const personalProfileDetail =
        route.params.name === this.myUserProfileDetail.id
          ? this.myUserProfileDetail
          : this.otherUserProfileDetail;
      return personalProfileDetail;
    },
    getOrganizationProfileDetail() {
      const route = useRoute();
      return route.params.name === this.myOrgProfileDetail.id
        ? this.myOrgProfileDetail
        : this.otherOrgProfileDetail;
    },
    gotoProfilePage(profile) {
      const router = useRouter();
      if (
        profile?.entityType === 'organization' ||
        profile?.type === 'organization'
      ) {
        router.push(`/organization/${profile.id}`);
        // if (this.myOrganizationList.some((item) => item.id === profile.id)) {
        //   router.push(`/organization/hub/${profile.id}/profile`);
        // } else {
        //   router.push(`/organization/${profile.id}`);
        // }
      } else {
        if (profile.id === this.myUserProfileDetail.id) {
          router.push(`/user/hub/${profile.id}/profile`);
        } else {
          router.push(`/profile/${profile.id}`);
        }
      }
    },
    async switchMyProfile(params) {
      const { profile = {}, redirect = true } = params;
      const { entityType, id } = profile;
      try {
        const router = useRouter();
        const route = useRoute();
        const authStore = useAuthStore();
        const newPath = replacePath(entityType, id, route.path);
        await authStore.switchContext({ id });
        await sleep(100);
        if (entityType === 'organization') {
          await this.getOrganizationDetail({ organizationId: id });
        } else {
          const data = await retrieveProfile({ profileId: id });
          this.myUserProfileDetail = { ...data };
          authStore.user = { ...data };
          this.setMyOrganizationList(data.organizations || []);
          this.setMyOrganizationDetail({});
        }
        if (redirect) {
          router.replace({ path: newPath });
        } else {
          window.history.replaceState(null, '', newPath);
        }
        return true;
      } catch {
        return false;
      }
    },
  },
});

import { ElMessageBox } from 'element-plus';

import {
  login,
  logout,
  getUser,
  checkEmail,
  signUpUser,
  resendCode,
  usersConfirm,
  resetPassword,
  switchContext,
  forgotPassword,
  loginWithGoogle,
  loginWithApple,
  switchContextToUser,
  createAPIKey as postCreateAPIKey,
  retrieveAPIKey as getRetrieveAPIKey,
  listAllToken as getListAllToken,
  deleteAPIKey as deleteAPIKeyRequest,
  updateAPIKey as patchUpdateAPIKey,
} from '~/api/v2/auth';
import { DOMAIN_URL } from '~/constant';
import { ORGANIZATION_ROLE_TYPE } from '~/constant/roles';
import { currentTimeZone } from '~/utils/day';
import WebSocketService from '~/utils/websocket';

export const useAuthStore = defineStore('auth', {
  state: () => {
    const user = useCookie('user');
    const context = useCookie('context');

    return {
      user: user.value || {},
      context: context.value || '',
      switching: false,

      loading: false,
      popup: false,
      type: 'login',

      signinStep: 0,
      loginInfo: {
        email: '',
        password: '',
      },

      passwordRecoveryStep: 0,
      passwordRecoveryInfo: {
        password: '',
        confirmPassword: '',
      },

      forgotPasswordStep: 0,
      forgotPasswordInfo: {
        email: '',
      },

      signUpStep: 0,
      signUpInfo: {
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        role: '',
        profilePicture: null,
        pictureUrl: '',
      },

      emailInfo: {
        provider: '',
        verified: true,
        exists: true,
        password: true,
      },

      apiKeysData: [],
      apiKeysPagination: {},
      isShowCheckTimeZone: false,
    };
  },
  getters: {
    logged() {
      return !!this.user.id;
    },
    isUser() {
      return this.context === this.user.id;
    },
    isOrg() {
      const profileStore = useProfileStore();
      const isOrgId =
        this.context === profileStore.myOrgProfileDetail.id ||
        profileStore.myOrganizationList.some(
          (item) => item.id === this.context,
        );
      return isOrgId;
    },
    isOrgAdmin() {
      const profileStore = useProfileStore();
      const activeUserRole = profileStore.myOrgProfileDetail.activeUserRole;
      return (
        activeUserRole === ORGANIZATION_ROLE_TYPE.OWNER ||
        activeUserRole === ORGANIZATION_ROLE_TYPE.ADMIN
      );
    },
    isTeacher() {
      return this.user.type === 'teacher';
    },
    isAdmin() {
      return this.user.type === 'admin';
    },
    finishedTeacherSignup() {
      return this.isTeacher && this.user.stripeConnectOnboard === 'completed';
    },
    finishedOrgSignup() {
      const profileStore = useProfileStore();

      return (
        profileStore.myOrgProfileDetail.stripeConnectOnboard === 'completed'
      );
    },
    finishedSignup() {
      if (this.isOrg) {
        return this.finishedOrgSignup;
      }
      return this.finishedTeacherSignup;
    },
    isStudent() {
      return this.user.type === 'user';
    },
    hub() {
      return this.isUser
        ? `/user/hub/${this.context}`
        : `/organization/hub/${this.context}`;
    },
    shoppingSpace() {
      const { id, shoppingSpace } = this.user;
      if (shoppingSpace) {
        return `/user/hub/${id}/spaces?view=grid&space=${shoppingSpace}`;
      } else {
        return `/user/hub/${id}/spaces?view=grid`;
      }
    },
    hasServiceSubscription() {
      if (this.isOrg) {
        const profileStore = useProfileStore();
        return profileStore.myOrgProfileDetail.hasServiceSubscription;
      }
      return this.user.hasServiceSubscription;
    },
  },
  actions: {
    async checkEmail(params) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const data = await checkEmail(params);
        this.emailInfo = data;
        return data;
      } catch (error) {
        sleep(1000);
        this.clearLoginData();
        throw new Error(error);
      } finally {
        this.loading = false;
      }
    },
    async login(params) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const data = await login(params);
        await this.getInfo();
        this.popup = false;
        const route = useRoute();
        const router = useRouter();
        if (route.query.redirect) {
          const redirect = decodeURIComponent(route.query.redirect);
          router.replace({ path: redirect });
        }
        return data;
      } catch (error) {
        throw new Error(error);
      } finally {
        this.loading = false;
      }
    },
    async register(params) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const data = await signUpUser(params);
        return data;
      } catch (error) {
        throw new Error(error);
      } finally {
        this.loading = false;
      }
    },
    async getInfo() {
      const user = useCookie('user', {
        maxAge: 60 * 60 * 24 * 365 * 10,
      });

      const context = useCookie('context', {
        maxAge: 60 * 60 * 24 * 365 * 10,
      });

      const data = await getUser();

      // 因为原始数据太大，所以只保留一部分常用的数据
      user.value = {
        id: data.id,
        email: data.email,
        username: data.username,
        fullName: data.fullName,
        picture: data.picture,
        entityType: data.entityType,
        timezone: data.timezone,
        // 以下两个用于判断是否完成老师注册
        type: data.type,
        stripeConnectOnboard: data.stripeConnectOnboard,
        // 用于判断订阅状态
        hasServiceSubscription: data.hasServiceSubscription,
      };

      this.user = data;

      if (!context.value) {
        context.value = data.id;
        this.context = data.id;
      }

      const { $setDayjsTimeZone } = useNuxtApp();
      const profileStore = useProfileStore();
      profileStore.myUserProfileDetail = { ...data };
      profileStore.setMyOrganizationList(data.organizations || []);
      $setDayjsTimeZone(data.timezone);
      // this.updateTimeZone(data);
      return data;
    },
    async confirm(params) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const data = await usersConfirm(params);
        await this.getInfo();
        return data;
      } catch (error) {
        throw new Error(error);
      } finally {
        this.loading = false;
      }
    },
    async forgot(params) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const data = await forgotPassword(params);
        return data;
      } catch (error) {
        throw new Error(error);
      } finally {
        this.loading = false;
      }
    },
    async reset(params) {
      const data = await resetPassword(params);
      await this.getInfo();
      return data;
    },
    async resendCode(params) {
      const data = await resendCode(params);
      return data;
    },
    async loginWithGoogle(params) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const data = await loginWithGoogle(params);
        await this.getInfo();
        this.popup = false;
        return data;
      } catch (error) {
        throw new Error(error);
      } finally {
        this.loading = false;
      }
    },
    clearLoginData() {
      const profileStore = useProfileStore();
      profileStore.$reset();
      const user = useCookie('user');
      const org = useCookie('org');
      const context = useCookie('context');
      const accessToken = useCookie('accessToken');
      const myOrganizationList = useCookie('myOrganizationList');
      user.value = null;
      org.value = null;
      context.value = null;
      accessToken.value = null;
      myOrganizationList.value = null;
      this.loading = false;
    },
    async logout(params = {}) {
      const { noLogoutApi = false } = params;
      if (noLogoutApi) {
        this.clearLoginData();
        window.location.href = '/';
      } else {
        if (this.loading) {
          return;
        }
        this.loading = true;
        try {
          const data = await logout({ devices: 'current' });
          if (data.logout) {
            this.clearLoginData();
            window.location.href = '/';
          }
          return data;
        } catch (error) {
          throw new Error(error);
        } finally {
          this.loading = false;
        }
      }
    },
    async switchContext(params) {
      const websocket = WebSocketService.getInstance();
      const context = useCookie('context');
      if (params.id === this.context) {
        return;
      }
      if (params.id === this.user.id) {
        const data = await switchContextToUser();
        context.value = this.user.id;
        this.context = this.user.id;
        websocket.reconnect();
        return data;
      } else {
        const data = await switchContext(params);
        context.value = params.id;
        this.context = params.id;
        websocket.reconnect();
        return data;
      }
    },
    async createAPIKey(params) {
      const data = await postCreateAPIKey(params);
      return data;
    },
    async getAPIKey() {
      const data = await getRetrieveAPIKey();
      return data;
    },
    async listAllToken(params) {
      const data = await getListAllToken({
        ...params,
        limit: 10,
        sortDirection: 'desc',
      });
      if (data) {
        this.apiKeysData = data.data;
        this.apiKeysPagination = data.cursor;
      }
      return data;
    },
    async deleteAPIKey(id) {
      const data = await deleteAPIKeyRequest(id);
      return data;
    },
    async updateAPIKey(params) {
      const data = await patchUpdateAPIKey(params);
      return data;
    },
    // check timezone and update
    async updateTimeZone(userInfo) {
      const profileStore = useProfileStore();
      if (!userInfo.timezone) {
        profileStore.updateMyProfile({ timezone: currentTimeZone() });
        return false;
      }
      if (!this.isShowCheckTimeZone) {
        this.isShowCheckTimeZone = true;
        const isCheckTimeZone = localStorage.getItem('isCheckTimeZone') !== '1';
        if (isCheckTimeZone) {
          if (currentTimeZone() !== userInfo.timezone) {
            ElMessageBox.confirm(
              `Your current time zone is "${currentTimeZone()}", do you want to update your time zone?`,
              'Tips',
              {
                distinguishCancelAndClose: true,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                cancelButtonText: 'No',
              },
            )
              .then(async () => {
                await profileStore.updateMyProfile({
                  timezone: currentTimeZone(),
                });
                localStorage.removeItem('isCheckTimeZone');
              })
              .catch(() => {
                localStorage.setItem('isCheckTimeZone', '1');
              });
          }
        }
      }
    },
    async loginWithAppleInit() {
      AppleID.auth.init({
        clientId: 'com.aladia.io.web',
        scope: 'name email',
        redirectURI: `${DOMAIN_URL}/auth/callback`,
        state: '[ANYTHING]',
        nonce: '123456',
        usePopup: true,
      });
    },
    async loginWithApple(params) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const data = await loginWithApple(params);
        await this.getInfo();
        this.popup = false;
        return data;
      } catch (error) {
        throw new Error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});

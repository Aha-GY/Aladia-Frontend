import menuConst from './menuConst';
import orgMenuConst from './orgMenuConst';

export const useMenuInfo = () => {
  const profileStore = useProfileStore();
  const authStore = useAuthStore();

  const isTeacher = computed(() => authStore.isTeacher);
  const hasServiceSubscription = computed(
    () => authStore.hasServiceSubscription,
  );

  const AccountMenu = computed(() =>
    authStore.isOrg ? orgMenuConst.AccountMenu : menuConst.AccountMenu,
  );
  const ProfileMenu = computed(() =>
    authStore.isOrg ? orgMenuConst.ProfileMenu : menuConst.ProfileMenu,
  );
  const IAMMenu = computed(() => (authStore.isOrg ? orgMenuConst.IAMMenu : []));
  const BusinessMenu = computed(() => {
    if (authStore.isOrg) {
      const menu = [...orgMenuConst.BusinessMenu];
      if (profileStore.myProfileDetail?.stripeConnectOnboard === 'completed') {
        menu[1] = orgMenuConst.BusinessDeatailMenuItem;
      }
      return menu;
    } else {
      const menu = [...menuConst.BusinessMenu];
      if (!isTeacher.value) {
        menu[1].alertIcon = true;
      } else {
        menu[1].alertIcon = false;
      }
      if (hasServiceSubscription.value) {
        menu[1] = menuConst.BusinessDeatailMenuItem;
      }
      return menu;
    }
  });
  const MoreMenu = computed(() =>
    authStore.isOrg ? orgMenuConst.MoreMenu : menuConst.MoreMenu,
  );

  const menuList = computed(() => {
    const list = [
      { title: 'calendar.account', data: AccountMenu.value },
      { title: 'calendar.profile', data: ProfileMenu.value },
      { title: 'calendar.business', data: BusinessMenu.value },
      { title: 'calendar.more', data: MoreMenu.value },
    ];
    if (authStore.isOrg) {
      list.splice(2, 0, { title: 'calendar.iam', data: IAMMenu.value });
    }
    return list;
  });
  const renderLabel = (menuId) =>
    [
      ...AccountMenu.value,
      ...IAMMenu.value,
      ...ProfileMenu.value,
      ...BusinessMenu.value,
      ...MoreMenu.value,
    ].find((row) => row.id === menuId)?.label;

  return {
    menuList,
    renderLabel,
  };
};

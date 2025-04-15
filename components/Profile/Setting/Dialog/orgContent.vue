<template>
  <ProfileSettingDialogOrgMenuProfileInfo v-if="menuId === AccountMenu[0].id" />
  <ProfileSettingDialogMenuGeneral v-if="menuId === AccountMenu[1].id" />
  <ProfileSettingDialogMenuNotifications v-if="menuId === AccountMenu[2].id" />
  <ProfileSettingDialogMenuAPIKey v-if="menuId === AccountMenu[3].id" />
  <ProfileSettingDialogMenuWebhook
    v-if="menuId === AccountMenu[4].id"
    :is-left-drawer="isLeftDrawer"
  />
  <ProfileSettingDialogMenuAbout
    v-if="menuId === ProfileMenu[0].id"
    :is-left-drawer="isLeftDrawer"
  />
  <ProfileSettingDialogMenuSocialLinks v-if="menuId === ProfileMenu[1].id" />
  <ProfileSettingDialogMenuPayments v-if="menuId === BusinessMenu[0].id" />
  <ProfileSettingDialogMenuBusinessDetail
    v-if="menuId === BusinessDeatailMenuItem.id"
  />
  <ProfileSettingDialogOrgMenuDeleteOrg v-if="menuId === MoreMenu[0].id" />
  <ProfileSettingDialogOrgMenuIAMUsers
    v-if="menuId === IAMMenu[0].id"
    :is-left-drawer="isLeftDrawer"
    show-map
  />
  <ProfileSettingDialogOrgMenuIAMGroups
    v-if="menuId === IAMMenu[1].id"
    :is-left-drawer="isLeftDrawer"
    show-map
  />
  <ProfileSettingDialogOrgMenuIAMBranches
    v-if="menuId === IAMMenu[2].id"
    :is-left-drawer="isLeftDrawer"
    show-map
  />
  <ProfileSettingDialogOrgMenuIAMUsers
    v-if="menuId === IAMMenu[3].id"
    member-type="external"
    :is-left-drawer="isLeftDrawer"
    show-map
  />
</template>
<script setup>
import orgMenuConst from './orgMenuConst';

defineProps({
  menuId: [String, Number],
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
});
const {
  AccountMenu,
  BusinessMenu,
  BusinessDeatailMenuItem,
  MoreMenu,
  ProfileMenu,
  IAMMenu,
} = orgMenuConst;
</script>

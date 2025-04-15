<template>
  <ProfileSettingDialogMenuProfileInfo v-if="menuId === AccountMenu[0].id" />
  <ProfileSettingDialogMenuSignIn
    v-if="menuId === AccountMenu[1].id"
    :is-left-drawer="isLeftDrawer"
  />
  <ProfileSettingDialogMenuGeneral v-if="menuId === AccountMenu[2].id" />
  <ProfileSettingDialogMenuNotifications v-if="menuId === AccountMenu[3].id" />
  <ProfileSettingDialogMenuAPIKey v-if="menuId === AccountMenu[4].id" />
  <ProfileSettingDialogMenuWebhook
    v-if="menuId === AccountMenu[5].id"
    :is-left-drawer="isLeftDrawer"
  />
  <ProfileSettingDialogMenuAbout
    v-if="menuId === ProfileMenu[0].id"
    :is-left-drawer="isLeftDrawer"
  />
  <ProfileSettingDialogMenuWork v-if="menuId === ProfileMenu[1].id" />
  <ProfileSettingDialogMenuEducation v-if="menuId === ProfileMenu[2].id" />
  <ProfileSettingDialogMenuCertificates v-if="menuId === ProfileMenu[3].id" />
  <ProfileSettingDialogMenuSocialLinks v-if="menuId === ProfileMenu[4].id" />
  <ProfileSettingDialogMenuBecomeTeacher
    v-if="menuId === BusinessMenu[1].id"
    :is-left-drawer="isLeftDrawer"
  />
  <ProfileSettingDialogMenuPayments v-if="menuId === BusinessMenu[0].id" />
  <ProfileSettingDialogMenuBusinessDetail
    v-if="menuId === BusinessDeatailMenuItem.id"
  />
  <ProfileSettingDialogMenuDeleteAccount v-if="menuId === MoreMenu[0].id" />
</template>

<script setup>
import menuConst from './menuConst';

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
} = menuConst;
</script>

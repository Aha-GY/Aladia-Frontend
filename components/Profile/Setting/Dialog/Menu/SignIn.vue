<template>
  <ProfileSettingDialogCompsBox title="Primary Email">
    <div class="flex flex-row">
      <div
        class="mr-1.5 flex h-auto w-full items-center border-b border-[#fff]/5"
      >
        <i class="fa-regular fa-envelope" />
        <span class="ml-3 cursor-default">
          {{ email.current }}
        </span>
      </div>
      <ProfileSettingDialogCompsEditEmailConfirm>
        <BaseButton type="tertiary" icon="fa-solid fa-pen-to-square">
          {{ $t('base.editor.edit') }}
        </BaseButton>
      </ProfileSettingDialogCompsEditEmailConfirm>
    </div>
  </ProfileSettingDialogCompsBox>

  <ProfileSettingDialogCompsSecondaryEmails />

  <ProfileSettingDialogCompsPassword />

  <ProfileSettingDialogCompsConnectedAccounts />

  <ProfileSettingDialogCompsLoggedDevices :is-left-drawer="isLeftDrawer" />
</template>
<script setup>
defineProps({
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
});
const profileStore = useProfileStore();
const email = reactive({
  current: profileStore.myProfileDetail.email,
  showDialog: true,
});
</script>

<template>
  <ProfileSettingDialogCompsBox :title="t('personal.profile.accounts')">
    <div class="grid grid-cols-1 gap-2">
      <div
        v-for="item in accounts"
        :key="item.label"
        class="flex flex-row items-center justify-between rounded-md bg-white/5 px-2 py-1.5"
      >
        <div class="flex">
          <div class="flex w-[6.875rem] flex-row items-center capitalize">
            <img :src="`/icons/${item.label}.svg`" class="mr-1.5 h-6" />
            {{ item.label }}
          </div>
          <div
            class="rounded border-[1px] p-[2px_4px]"
            :class="{
              'border-[#35A8234D] text-[#35A823]': item.connected,
              'border-[#742828] text-[#ED3C28]': !item.connected,
            }"
          >
            {{
              item.connected
                ? t('personal.status.connected')
                : t('personal.status.disconnected')
            }}
          </div>
        </div>

        <BaseButton
          v-if="item.connected"
          :loading="item.btnLoading"
          label="$t:personal.internet.disconnect"
          type="tertiary"
          :data-cy="`${item.label}-account-disconnect-button`"
          @click="handleAuthleUnLink(item)"
        />
        <BaseButton
          v-else
          label="$t:personal.internet.connect"
          :loading="item.btnLoading"
          :data-cy="`${item.label}-account-connect-button`"
          @click="handleConnect(item)"
        />
      </div>
    </div>
  </ProfileSettingDialogCompsBox>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import {
  connectedAccounts,
  authConnectGoogle,
  authGoogleUnLink,
  authConnectApple,
  authAppleUnLink,
} from '@/api/v2/auth.js';
import { GOOGLE_CLIENT_ID } from '~/constant';

const authStore = useAuthStore();

const { t } = useI18n();

const $toast = useToast();

const accounts = ref([
  { label: 'google', connected: false, btnLoading: false },
  { label: 'facebook', connected: false, comingSoon: true, btnLoading: false },
  { label: 'apple', connected: false, btnLoading: false },
]);
const getConnectedAccounts = async () => {
  const data = await connectedAccounts();
  accounts.value = accounts.value.map((item) => {
    item.connected = data[item.label] || false;
    return { ...item };
  });
};
getConnectedAccounts();

const handleConnect = async (item) => {
  if (item.comingSoon) {
    $toast.info(t('personal.coming.soon'));
    return;
  }
  if (item.label === 'google') {
    if (!window.FederatedCredential) {
      $toast.error(t('personal.error.access.fedCM'));
      return;
    }
    if (checkPopupBlocked()) {
      $toast.error(t('personal.error.access.popup'));
      return;
    }
    try {
      if (item.btnLoading) {
        return false;
      }
      item.btnLoading = true;
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        cancel_on_tap_outside: false,
        use_fedcm_for_prompt: true,
        context: 'use',
        callback: handleGoogleCredentialResponse,
      });
      google.accounts.id.prompt();
    } catch (error) {
      console.log('--------------↓↓↓↓↓----------2222-----------');
      console.log(error);
      console.log('--------------↑↑↑↑↑---------------------');
      item.btnLoading = false;
      // if (error?.includes('FedCM')) {
      //   $toast.error(t('personal.error.access.fedCM'));
      // }
    } finally {
      item.btnLoading = false;
    }
  }
  if (item.label === 'apple') {
    authStore.loginWithAppleInit();
    handleAppleConnect();
  }
};

const handleAppleConnect = async () => {
  try {
    accounts.value[2].btnLoading = true;
    const data = await AppleID.auth.signIn();
    await authConnectApple(data);
    getConnectedAccounts();
  } catch (error) {
    console.log('--------------↓↓↓↓↓---------------------');
    console.log(error);
    console.log('--------------↑↑↑↑↑---------------------');
  } finally {
    accounts.value[2].btnLoading = false;
  }
};

const handleGoogleCredentialResponse = async (res) => {
  try {
    accounts.value[0].btnLoading = true;
    await authConnectGoogle({ token: res.credential });
    getConnectedAccounts();
  } finally {
    accounts.value[0].btnLoading = false;
  }
};

const handleAuthleUnLink = async (item) => {
  if (item.label === 'google') {
    handleAuthGoogleUnLink();
  }
  if (item.label === 'apple') {
    handleAuthAppleUnLink();
  }
};

const handleAuthGoogleUnLink = async () => {
  accounts.value[0].btnLoading = true;
  try {
    await authGoogleUnLink();
    getConnectedAccounts();
  } finally {
    accounts.value[0].btnLoading = false;
  }
};

const handleAuthAppleUnLink = async () => {
  accounts.value[2].btnLoading = true;
  try {
    await authAppleUnLink();
    getConnectedAccounts();
  } finally {
    accounts.value[2].btnLoading = false;
  }
};
</script>

<template>
  <div />
</template>

<script setup>
import { GOOGLE_CLIENT_ID, IS_DEV } from '~/constant';

const authStore = useAuthStore();

const handleGoogleCredentialResponse = async (res) => {
  try {
    await authStore.loginWithGoogle({
      token: res.credential,
    });
  } catch (error) {
    console.log('--------------↓↓↓↓↓---------------------');
    console.log(error);
    console.log('--------------↑↑↑↑↑---------------------');
  }
};

if (!IS_DEV) {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    cancel_on_tap_outside: false,
    use_fedcm_for_prompt: true,
    context: 'signin',
    callback: handleGoogleCredentialResponse,
  });
  try {
    google.accounts.id.prompt();
  } catch (error) {
    if (error.includes('FedCM')) {
      $toast.error(t('personal.error.access.fedCM'));
    }
  }
}
</script>

<style>
#credential_picker_container {
  color-scheme: light;
}
</style>

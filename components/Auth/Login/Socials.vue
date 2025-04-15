<template>
  <div class="w-full transition-all duration-300">
    <div class="mb-6 flex items-center justify-between gap-4">
      <div class="h-[1px] w-40 bg-gradient-to-r from-white/0 to-white" />
      <div>{{ $t('auth.or') }}</div>
      <div class="h-[1px] w-40 bg-gradient-to-r from-white to-white/0" />
    </div>
    <div class="mb-8 flex w-full flex-col gap-4">
      <AuthLoginSocial type="google" :url="AUTH_GOOGLE_LOGIN">
        <img src="~/assets/icons/google.svg" class="h-6" />
        <div class="w-40">{{ $t('auth.login.socials.google') }}</div>
      </AuthLoginSocial>
      <AuthLoginSocial href="/">
        <img src="~/assets/icons/facebook.svg" class="h-6" />
        <div class="w-40">{{ $t('auth.login.socials.facebook') }}</div>
      </AuthLoginSocial>
      <div
        class="flex cursor-pointer items-center justify-center gap-4 rounded border border-white/20 py-1.5 shadow-[0px_3px_6px_#00000000] transition-all hover:bg-white/20 hover:shadow-[0px_3px_6px_#000000] active:scale-95"
        data-cy="4da94b73b9eb2789"
        :class="{
          '!cursor-not-allowed': authStore.loading,
        }"
        @click="handleAppleLogin"
      >
        <img src="~/assets/icons/apple.svg" class="h-6" />
        <div class="w-40">{{ $t('auth.login.socials.apple') }}</div>
      </div>
    </div>
    <!-- <div class="cursor-pointer text-center text-white/40">
      {{ $t('auth.terms_conditions') }}
    </div> -->
  </div>
</template>

<script setup>
import * as constant from '~/constant';

const authStore = useAuthStore();
const AUTH_GOOGLE_LOGIN = constant.AUTH_GOOGLE_LOGIN;

authStore.loginWithAppleInit();
const handleAppleLogin = async () => {
  if (authStore.loading) {
    return;
  }
  try {
    const data = await AppleID.auth.signIn();
    await authStore.loginWithApple(data);
  } catch (error) {
    console.log(error, 'apple error');
  }
};
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="next-icon flex h-8 scale-100 cursor-pointer items-center justify-center gap-2 pb-4 transition-all active:scale-95"
      data-cy="cd6ebb1a390addfb"
      @click="authStore.type = 'login'"
    >
      <BaseNext class="rotate-180" />
      {{ $t('auth.button.back') }}
    </div>
    <AuthForgotRecovery class="mb-6" />
    <div class="mb-6 text-center">{{ $t('auth.forgot.header.title') }}</div>
    <div class="mb-6 flex flex-1 flex-col items-center px-4">
      <div class="mb-8 text-center text-sm text-white/50">
        {{ $t('auth.forgot.header.description') }}
      </div>
      <div class="flex items-center justify-between gap-6">
        <img src="~/assets/logo/image.png" class="h-20 w-20 object-cover" />
        <div class="flex flex-col items-center gap-3">
          <i class="fa-regular fa-arrow-right text-xl" />
          <img src="~/assets/icons/mail.svg" class="h-10 object-contain" />
        </div>
        <img src="~/assets/icons/locker.svg" class="h-20 object-cover" />
      </div>
    </div>
    <AuthButton
      class="mb-6"
      data-cy="confirm-forgot-auth-button"
      :loading="authStore.loading"
      @click="onEnter"
    >
      {{ $t('auth.forgot.confirm') }}
    </AuthButton>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {};
  },
  methods: {
    async onEnter() {
      await this.authStore.forgot({
        email: this.authStore.loginInfo.email,
      });
      this.authStore.forgotPasswordStep = 1;
    },
  },
};
</script>

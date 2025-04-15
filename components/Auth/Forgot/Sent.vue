<template>
  <div class="flex h-full flex-col pt-8">
    <AuthForgotRecovery class="mb-12" />
    <div class="mb-6 flex flex-col items-center px-6">
      <div
        class="mb-24 flex w-full items-center justify-between leading-none text-white/70"
      >
        <div class="font-semibold">
          {{ $t('auth.forgot.recovery.sent.title') }}
        </div>
        <div
          class="group flex cursor-pointer items-center gap-1 text-xs"
          data-cy="2a1bbbaeb6547f2a"
          @click="authStore.forgotPasswordStep = 0"
        >
          <div class="group-hover:underline">
            {{ authStore.forgotPasswordInfo.email }}
          </div>
          <i
            class="fa-solid fa-pen-to-square text-base opacity-0 group-hover:opacity-100"
          />
        </div>
      </div>
      <div class="mb-32 text-center text-base text-white/70">
        <div>{{ $t('auth.forgot.recovery.sent.description1') }}</div>
        <div>{{ $t('auth.forgot.recovery.sent.description2') }}</div>
      </div>
    </div>
    <AuthButton class="mb-6" :loading="authStore.loading" @click="onEnter">
      {{ $t('auth.button.sendEmail') }}
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
      this.$toast.success(this.$t('auth.signup.otp.sent'));
    },
  },
};
</script>

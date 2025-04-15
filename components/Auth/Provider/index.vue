<template>
  <div class="flex h-full flex-col pb-6">
    <AuthProviderBack
      data-cy="8f469440570b8156"
      @click="authStore.type = 'login'"
    />
    <AuthProviderHeader :provider="emailInfo.provider" />
    <div class="flex flex-1 flex-col px-6">
      <div class="leading-none text-white/70">
        <div class="text-sm font-semibold text-white/70">
          {{ $t('auth.forgot.recovery.sent.title') }}
        </div>
        <div class="text-xs font-light italic">
          {{ info.email }}
        </div>
      </div>
      <div class="flex flex-1 items-center justify-between gap-6">
        <img src="~/assets/logo/image.png" class="h-20 w-20 object-cover" />
        <div class="flex flex-col items-center gap-3">
          <i class="fa-regular fa-arrow-right text-xl" />
          <img src="~/assets/icons/mail.svg" class="h-10 object-contain" />
        </div>
        <img src="~/assets/icons/locker.svg" class="h-20 object-cover" />
      </div>
      <AuthButton
        :loading="authStore.loading"
        data-cy="bb6d6210f4a3756a"
        @click="onEnter"
      >
        {{ $t('auth.provider.sent.email') }}
      </AuthButton>
    </div>
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
  computed: {
    info() {
      return this.authStore.loginInfo;
    },
    emailInfo() {
      return this.authStore.emailInfo;
    },
  },
  methods: {
    async onEnter() {
      await this.authStore.forgot({
        email: this.info.email,
      });
      this.$toast.success(this.$t('auth.signup.otp.sent'));
    },
  },
};
</script>

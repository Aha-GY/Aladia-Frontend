<template>
  <div class="flex h-full flex-col">
    <AuthProviderHeader v-if="provider" :provider="provider" class="mb-6" />
    <AuthForgotRecovery v-else class="mb-6" />
    <div class="flex flex-1 flex-col items-center px-6">
      <div class="flex flex-1 pt-24 text-center text-base text-white/70">
        {{
          provider
            ? $t('auth.forgot.recovery.password.changed')
            : $t('auth.forgot.recovery.password.added')
        }}
      </div>
      <AuthButton data-cy="success-recovery-password-button" @click="onEnter">
        {{ $t('auth.forgot.recovery.password.success') }}
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
    return {
      provider: '',
    };
  },
  mounted() {
    const { provider } = this.$route.query;
    if (provider && provider !== 'email') {
      this.provider = this.$route.query.provider;
    }
  },
  methods: {
    onEnter() {
      this.$router.push('/');
    },
  },
};
</script>

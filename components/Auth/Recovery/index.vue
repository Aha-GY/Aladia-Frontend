<template>
  <AuthRecoveryPassword v-if="authStore.passwordRecoveryStep === 0" />
  <AuthRecoveryChanged v-if="authStore.passwordRecoveryStep === 1" />
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  mounted() {
    this.authStore.passwordRecoveryStep = 0;
  },
};
</script>

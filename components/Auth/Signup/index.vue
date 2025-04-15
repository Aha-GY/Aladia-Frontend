<template>
  <AuthSignupDetail v-if="authStore.signUpStep === 0" />
  <AuthSignupCode v-if="authStore.signUpStep === 1" />
  <AuthSignupWelcome v-if="authStore.signUpStep === 2" />
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  mounted() {
    this.authStore.signUpStep = 0;
  },
};
</script>

<template>
  <AuthForgotEmail v-if="authStore.forgotPasswordStep === 0" />
  <AuthForgotSent v-if="authStore.forgotPasswordStep === 1" />
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  mounted() {
    this.authStore.forgotPasswordStep = 0;
  },
};
</script>

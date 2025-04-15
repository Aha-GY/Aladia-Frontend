<template>
  <AuthLoginEmail v-if="authStore.signinStep === 0" />
  <AuthLoginPassword v-if="authStore.signinStep === 1" />
  <AuthLoginWelcome v-if="authStore.signinStep === 2" />
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  mounted() {
    this.authStore.signinStep = 0;
  },
};
</script>

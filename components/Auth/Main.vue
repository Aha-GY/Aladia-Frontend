<template>
  <div class="relative z-10 h-full p-5 text-13">
    <AuthLogin v-if="authStore.type === 'login'" />
    <AuthSignup v-if="authStore.type === 'signup'" />
    <AuthForgot v-if="authStore.type === 'forgot'" />
    <AuthProvider v-if="authStore.type === 'provider'" />
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
};
</script>

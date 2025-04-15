<template>
  <div class="pt-8">
    <AuthLoginHeader class="mb-6" :welcome="true" />
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

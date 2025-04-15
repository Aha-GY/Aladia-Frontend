<template>
  <div
    class="min-h-screen pt-14 transition-all duration-200"
    :class="{ 'md:pl-[4.5rem]': authStore.logged }"
  >
    <slot />
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

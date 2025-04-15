<template>
  <div data-layout="default">
    <Header />
    <Resize>
      <slot />
    </Resize>
    <Footer v-if="footer" />
    <LazySidebar v-if="sidebar" id="sidebar" class="hidden md:flex" />
  </div>
</template>

<script>
export default {
  props: {
    footer: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  computed: {
    sidebar() {
      return this.authStore.logged;
    },
  },
};
</script>

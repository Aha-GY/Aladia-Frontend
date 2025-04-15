<template>
  <div
    class="group relative shrink-0 scale-100 cursor-pointer items-center justify-center overflow-hidden rounded border px-3 py-2 text-sm leading-none transition-all hover:border-transparent active:scale-95"
    data-cy="join-now-button"
    @click="handleLogin()"
  >
    <div
      class="absolute inset-0 z-0 flex h-full w-full items-center justify-center"
    >
      <div
        class="gradient h-0 w-0 rounded-full transition-all duration-200 group-hover:h-full group-hover:w-full group-hover:rounded"
      />
    </div>
    <div
      class="relative z-10 flex items-center justify-center gap-2 group-hover:text-black"
    >
      <i class="fa-solid fa-user-plus" />
      {{ $t('index.header.join') }}
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  mounted() {
    if (this.$route.query.login === 'true') {
      setTimeout(() => {
        this.authStore.popup = true;
      }, 1000);
    }
  },
  methods: {
    handleLogin() {
      if (this.$route.path.includes('password-recovery')) {
        this.$router.replace({ path: '/' });
      }
      this.authStore.popup = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.gradient {
  background: transparent
    linear-gradient(
      134deg,
      #bf953f 0%,
      #fcf6ba 22%,
      #b38738 52%,
      #fbf6b7 79%,
      #aa771c 100%
    )
    0% 0% no-repeat padding-box;
}
</style>

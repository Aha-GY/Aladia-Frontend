<template>
  <div
    class="relative flex overflow-hidden rounded border border-white/20 bg-black px-4 py-4 opacity-80 transition-all duration-300"
    :class="loading ? 'mt-44' : 'mt-0'"
  >
    <div class="gradient absolute inset-0 opacity-[0.15]" />
    <div
      class="relative flex w-full transition-all duration-300"
      :class="loading ? 'opacity-0' : 'opacity-100'"
    >
      <img src="~/assets/logo/image.png" class="mr-3 h-20 w-20 object-cover" />
      <div class="flex-1">
        <div class="mb-2 text-base font-semibold">
          {{ $t('auth.login.header.welcome') }}
        </div>
        <div class="text-white/70">
          <div>{{ $t('auth.login.header.description1') }}</div>
          <div>{{ $t('auth.login.header.description2') }}</div>
        </div>
      </div>
    </div>
    <div
      class="absolute inset-0 flex items-center justify-center transition-all duration-300"
      :class="loading ? 'opacity-100' : 'opacity-0'"
    >
      <div v-if="showName">
        {{ $t('auth.signup.otp.welcome') }}, {{ authStore.user.fullName }}
      </div>
      <i v-else class="fa-solid fa-spinner animate-spin text-xs" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    welcome: Boolean,
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      loading: false,
      showName: false,
    };
  },
  mounted() {
    if (this.welcome) {
      this.animation();
    }
  },
  methods: {
    async animation() {
      await sleep(500);
      this.loading = true;
      await sleep(2000);
      this.showName = true;
      await sleep(2000);
      this.authStore.popup = false;
      // this.$router.push('/marketplace');
    },
  },
};
</script>

<style lang="scss" scoped>
.gradient {
  background-image: linear-gradient(
    15deg,
    rgba(255, 255, 255, 0) 8.33%,
    rgba(255, 255, 255, 0) 27.43%,
    rgba(255, 255, 255, 0.4) 32.64%,
    rgba(255, 255, 255, 0) 37.85%,
    rgba(255, 255, 255, 0) 53.91%,
    #fff 62.15%,
    rgba(255, 255, 255, 0) 68.23%,
    #fff 91.67%
  );
}
</style>

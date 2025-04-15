<template>
  <div
    class="flex cursor-pointer items-center justify-center gap-4 rounded border border-white/20 py-1.5 shadow-[0px_3px_6px_#00000000] transition-all hover:bg-white/20 hover:shadow-[0px_3px_6px_#000000] active:scale-95"
    data-cy="a0eccc61543a4f8e"
    :class="{
      '!cursor-not-allowed': authStore.loading,
    }"
    @click="onClick"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    url: String,
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      timer: null,
      popup: null,
    };
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  methods: {
    onClick() {
      if (this.authStore.loading) {
        return;
      }
      const width = 500;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      this.popup = window.open(
        this.url,
        '_blank',
        `width=${width},height=${height},left=${left},top=${top}`,
      );

      const provider = useCookie('provider-auth');
      provider.value = false;

      this.checkToken();
    },
    async checkToken() {
      const provider = useCookie('provider-auth');
      if (provider.value) {
        provider.value = false;
        this.authStore.loading = true;
        // this.$router.push('/');
        this.authStore.popup = false;
        await this.authStore.getInfo();
        this.authStore.loading = false;
      } else {
        this.timer = setTimeout(() => this.checkToken(), 1000);
      }
    },
  },
};
</script>

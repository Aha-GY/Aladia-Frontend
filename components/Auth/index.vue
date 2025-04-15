<template>
  <div
    v-if="authStore.popup"
    class="fixed bottom-0 left-0 right-0 top-0 z-[90] flex h-full w-full items-center justify-center bg-black/40 text-white backdrop-blur"
    @mousedown.self="onCloseClick"
  >
    <div
      class="relative -mt-20 flex h-[40rem] w-[26rem] flex-col rounded-md border border-white/10 bg-black/50 opacity-0 backdrop-blur transition-all duration-300"
      :style="animation ? { marginTop: 0, opacity: 1 } : null"
    >
      <AuthBorder />
      <AuthMain />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      animation: false,
    };
  },
  watch: {
    async 'authStore.popup'(state) {
      if (state) {
        this.authStore.type = 'login';
        await sleep(100);
        this.animation = true;
      } else {
        this.animation = false;
        this.clearSignUpInfo();
      }
    },
    'authStore.type'() {
      if (this.authStore.type === 'login') {
        this.clearSignUpInfo();
      }
    },
  },
  methods: {
    onCloseClick(event) {
      if (event.button !== 0 || this.authStore.loading) {
        return;
      }
      this.authStore.popup = false;
    },
    clearSignUpInfo() {
      this.authStore.signUpInfo = {
        ...this.authStore.signUpInfo,
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        profilePicture: '',
        pictureUrl: '',
        role: '',
      };
    },
  },
};
</script>

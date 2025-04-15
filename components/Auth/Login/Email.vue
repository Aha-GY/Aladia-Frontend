<template>
  <div class="pt-8">
    <AuthLoginHeader class="mb-6" />
    <div class="mb-6 text-center">{{ $t('auth.login.body.title.email') }}</div>
    <div class="mb-6 flex flex-col items-center px-4">
      <div
        class="group relative mb-8 flex h-10 w-full items-center rounded transition-all"
        :class="{
          'bg-[#F5DFDF]': emailError && !emailFocus,
          'bg-white': !emailError && !emailFocus,
          'bg-white opacity-80': emailFocus,
        }"
      >
        <div
          v-if="emailError"
          class="pointer-events-none absolute inset-0 rounded border border-[#E54E4E]"
        />
        <div
          class="absolute left-0 flex w-10 items-center justify-center text-xl"
        >
          <i class="fa-solid fa-envelope text-base text-black/70" />
        </div>
        <input
          ref="email"
          v-model.trim="info.email"
          class="h-full flex-1 rounded bg-transparent pl-10 pr-5 text-sm text-black outline-none transition-all"
          type="text"
          autocomplete="username"
          data-cy="login-email-text-field"
          :placeholder="$t('auth.login.body.title.email')"
          @focus="emailFocus = true"
          @blur="emailFocus = false"
          @input="onEmailChange"
          @change="onEmailChange"
          @keydown.enter="onEnter"
        />
        <div
          v-if="emailError"
          class="absolute -bottom-5 left-0 text-xs text-[#E54E4E]"
        >
          {{ emailError }}
        </div>
      </div>
      <AuthButton
        class="mb-6"
        :loading="authStore.loading"
        data-cy="login-submit-button"
        @click="onEnter"
        @keyup.enter="onEnter"
      >
        {{ $t('auth.button.enter') }}
      </AuthButton>
      <AuthLoginSocials />
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
      emailFocus: false,
      emailError: '',
    };
  },
  computed: {
    info() {
      return this.authStore.loginInfo;
    },
  },
  methods: {
    onEmailChange() {
      if (checkMail(this.info.email)) {
        this.emailError = '';
      } else if (!this.info.email) {
        this.emailError = this.$t('auth.error.required');
      } else {
        this.emailError = this.$t('auth.error.email.invalid');
      }
    },
    async onEnter() {
      this.onEmailChange();
      if (!this.emailError) {
        try {
          const data = await this.authStore.checkEmail({
            email: this.info.email,
          });
          if (data?.exists) {
            if (data.verified === false) {
              await this.authStore.resendCode({
                email: this.info.email,
              });
              this.authStore.type = 'signup';
              this.authStore.signUpInfo.email = this.info.email;
              await sleep(100);
              this.authStore.signUpStep = 1;
            } else {
              if (data.provider?.length && data.password === false) {
                this.authStore.type = 'provider';
              } else {
                this.authStore.signinStep = 1;
              }
            }
          } else {
            this.authStore.type = 'signup';
            this.authStore.signUpInfo.email = this.info.email;
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-text-fill-color: black !important;
  -webkit-box-shadow: 0 0 0 30px white inset !important;
}
</style>

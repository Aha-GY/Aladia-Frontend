<template>
  <div>
    <div
      class="next-icon flex h-8 scale-100 cursor-pointer items-center justify-center gap-2 pb-4 transition-all active:scale-95"
      data-cy="93683ec0b696978b"
      @click="authStore.signinStep = 0"
    >
      <BaseNext class="rotate-180" />
      {{ $t('auth.button.back') }}
    </div>
    <AuthLoginHeader class="mb-6" />
    <div class="mb-6 text-center">
      {{ $t('auth.login.body.title.password') }}
    </div>
    <div class="mb-6 flex flex-col items-center px-4">
      <div
        class="group relative mb-2 flex h-10 w-full items-center rounded"
        :class="{
          'bg-[#F5DFDF]': passwordError && !passwordFocus,
          'bg-white': !passwordError && !passwordFocus,
          'bg-white opacity-80': passwordFocus,
        }"
      >
        <div
          v-if="passwordError"
          class="pointer-events-none absolute inset-0 rounded border border-[#E54E4E]"
        />
        <div
          class="absolute left-0 flex w-10 items-center justify-center text-xl"
        >
          <i class="fa-solid fa-key text-base text-black/70" />
        </div>
        <input
          ref="email"
          v-model.trim="info.email"
          type="email"
          name="email"
          class="hidden"
        />
        <input
          ref="password"
          v-model="info.password"
          maxlength="32"
          class="autofill-input h-full flex-1 rounded bg-transparent pl-10 pr-5 text-sm text-black outline-none"
          autocomplete="new-password"
          :type="passwordView ? 'text' : 'password'"
          :style="{
            '--bg-body': passwordError ? '#F5DFDF' : 'white',
          }"
          data-cy="login-password-text-field"
          :placeholder="$t('auth.hint.password')"
          @focus="passwordFocus = true"
          @blur="passwordFocus = false"
          @change="onPasswordChange"
          @input="onPasswordChange"
          @keydown.enter="onEnter"
        />
        <i
          class="fa-solid absolute right-3 top-[0.7rem] scale-100 cursor-pointer text-base text-black/50 transition-all active:scale-90"
          :class="passwordView ? 'fa-eye' : 'fa-eye-slash'"
          data-cy="c4ee0494c22d78cb"
          @click="passwordView = !passwordView"
        />

        <div
          v-if="passwordError"
          class="absolute -bottom-5 left-0 text-xs text-[#E54E4E]"
        >
          {{ passwordError }}
        </div>
      </div>
      <div class="mb-4 flex h-2 w-full justify-end text-center text-xs">
        <div
          class="cursor-pointer text-white/50 underline hover:text-white"
          data-cy="login-forgot-password-button"
          @click="authStore.type = 'forgot'"
        >
          {{ $t('auth.button.forgot') }}
        </div>
      </div>
      <AuthButton
        class="mb-6"
        :loading="authStore.loading"
        data-cy="login-submit-button"
        @keyup.enter="onEnter"
        @click="onEnter"
      >
        {{ $t('auth.button.enter') }}
      </AuthButton>
      <AuthLoginSocials
        :class="fadeout ? 'pointer-events-none opacity-0' : ''"
      />
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
      passwordFocus: false,
      passwordView: false,
      passwordError: '',
      fadeout: false,
    };
  },
  computed: {
    info() {
      return this.authStore.loginInfo;
    },
  },
  mounted() {
    setTimeout(() => (this.fadeout = true), 100);
  },
  methods: {
    onPasswordChange() {
      if (this.info.password) {
        if (checkPassword(this.info.password)) {
          this.passwordError = '';
        } else {
          this.passwordError = this.$t('auth.error.password.invalid');
        }
      } else {
        this.passwordError = this.$t('auth.error.required');
      }
    },
    async onEnter() {
      this.onPasswordChange();
      if (!this.passwordError) {
        await this.authStore.login({
          email: this.info.email,
          password: this.info.password,
        });
        this.authStore.signinStep = 2;
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

<template>
  <div class="flex h-full flex-col">
    <div class="relative mb-6 flex justify-center font-semibold">
      {{ $t('auth.forgot.recovery.title') }}
    </div>
    <AuthProviderHeader v-if="provider" :provider="provider" />
    <AuthForgotRecovery v-else class="mb-6" />
    <input type="text" class="h-0" data-cy="3b9f05f47fdf3150" />
    <div class="mb-6 flex flex-1 flex-col items-center px-6">
      <div class="flex w-full flex-1 flex-col justify-center">
        <div v-if="!provider" class="mb-6">
          {{ $t('auth.forgot.recovery.password.new') }}
        </div>
        <div
          class="group relative mb-1 flex h-10 w-full rounded"
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
          <div class="flex w-10 items-center justify-center text-xl">
            <i class="fa-solid fa-key text-base text-black/70" />
          </div>
          <input
            v-model.trim="info.email"
            type="email"
            name="email"
            class="hidden"
          />
          <input
            v-model.trim="info.password"
            maxlength="32"
            class="autofill-input h-full flex-1 rounded bg-transparent text-sm text-black outline-none"
            :style="{
              '--bg-body': passwordError ? '#F5DFDF' : 'white',
            }"
            autocomplete="new-password"
            :type="passwordView ? 'text' : 'password'"
            data-cy="new-password-create-password-field"
            :placeholder="$t('auth.hint.password')"
            @focus="passwordFocus = true"
            @blur="passwordFocus = false"
            @keydown.enter="onEnter"
          />
          <i
            class="fa-solid absolute right-3 top-[0.7rem] scale-100 cursor-pointer text-base text-black/50 transition-all active:scale-90"
            :class="passwordView ? 'fa-eye' : 'fa-eye-slash'"
            data-cy="762feb14a9132337"
            @click="passwordView = !passwordView"
          />
        </div>
        <AuthPassword
          :error="passwordError"
          :password="info.password"
          class="mb-3"
        />
        <div
          class="group relative mb-20 flex h-10 w-full items-center rounded"
          :class="{
            'bg-[#F5DFDF]': confirmPasswordError && !confirmPasswordFocus,
            'bg-white': !confirmPasswordError && !confirmPasswordFocus,
            'bg-white opacity-80': confirmPasswordFocus,
          }"
        >
          <div
            v-if="confirmPasswordError"
            class="pointer-events-none absolute inset-0 rounded border border-[#E54E4E]"
          />
          <div
            class="absolute left-0 flex w-10 items-center justify-center text-xl"
          >
            <i class="fa-solid fa-key text-base text-black/70" />
          </div>
          <input
            v-model.trim="info.confirmPassword"
            maxlength="32"
            class="autofill-input h-full flex-1 rounded bg-transparent pl-10 text-sm text-black outline-none"
            :style="{
              '--bg-body': confirmPasswordError ? '#F5DFDF' : 'white',
            }"
            autocomplete="new-password"
            :type="confirmPasswordView ? 'text' : 'password'"
            data-cy="confirm-password-create-password-field"
            :placeholder="$t('auth.hint.confirmPassword')"
            @focus="confirmPasswordFocus = true"
            @blur="confirmPasswordFocus = false"
            @change="onConfirmPasswordChange"
            @input="onConfirmPasswordChange"
          />
          <i
            class="fa-solid absolute right-3 top-[0.7rem] scale-100 cursor-pointer text-base text-black/50 transition-all active:scale-90"
            :class="confirmPasswordView ? 'fa-eye' : 'fa-eye-slash'"
            data-cy="95bdd6e8a3d2e010"
            @click="confirmPasswordView = !confirmPasswordView"
          />
          <div
            v-if="confirmPasswordError"
            class="absolute -bottom-[1.1rem] left-0 text-xs text-[#E54E4E]"
          >
            {{ confirmPasswordError }}
          </div>
        </div>
      </div>
      <AuthButton
        :disabled="!isCheck"
        :loading="loading"
        data-cy="create-password-submit-button"
        @click="onEnter"
      >
        {{ $t('auth.forgot.recovery.password.create') }}
      </AuthButton>
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
      loading: false,
      passwordFocus: false,
      passwordView: false,
      confirmPasswordFocus: false,
      confirmPasswordView: false,
      passwordError: '',
      confirmPasswordError: '',
      provider: '',
    };
  },
  computed: {
    info() {
      return this.authStore.passwordRecoveryInfo;
    },
    isCheck() {
      return (
        checkPassword(this.info.password) &&
        checkPassword(this.info.confirmPassword) &&
        this.info.password === this.info.confirmPassword
      );
    },
  },
  mounted() {
    const { provider } = this.$route.query;
    if (provider && provider !== 'email') {
      this.provider = this.$route.query.provider;
    }
  },
  methods: {
    async onEnter() {
      if (!this.isCheck) {
        return;
      }
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;
        await sleep(2000);
        await this.authStore.reset({
          newPassword: this.info.password,
          token: this.$route.query.token,
        });
        this.authStore.passwordRecoveryStep = 1;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    onConfirmPasswordChange() {
      const { confirmPassword, password } = this.info;
      if (confirmPassword !== password) {
        this.confirmPasswordError = this.$t('auth.error.password.notMatch');
      } else if (!confirmPassword) {
        this.confirmPasswordError = this.$t('auth.error.required');
      } else {
        this.confirmPasswordError = '';
      }
    },
    onBack() {
      this.$router.push('/');
    },
  },
};
</script>

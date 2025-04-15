<template>
  <div>
    <div
      class="next-icon flex h-8 scale-100 cursor-pointer items-center justify-center gap-2 pb-4 transition-all active:scale-95"
      data-cy="9a0c3862adb4d503"
      @click="goBack"
    >
      <BaseNext class="rotate-180" />
      {{ $t('auth.button.back') }}
    </div>
    <div class="flex flex-col items-center px-4">
      <AuthSignupAvatar :error="profilePictureError" />
      <div class="mb-4 flex items-center gap-2">
        <div
          class="flex h-4 w-4 cursor-pointer items-center justify-center rounded border pt-0.5 transition-all"
          :class="
            checkError
              ? 'border-[#E54E4E]'
              : 'border-white/50 hover:border-white'
          "
          tabindex="0"
          data-cy="5cda2b0c5dd3194e"
          @click="check = !check"
        >
          <i v-show="check" class="fa-solid fa-check tex-sm" />
        </div>
        <div
          class="text-xs"
          :class="checkError ? 'text-[#E54E4E]' : 'text-white/70'"
        >
          {{ $t('auth.accept') }}
          <span
            class="underline"
            :class="checkError ? 'text-[#E54E4E]' : 'text-white'"
          >
            {{ $t('auth.terms_conditions') }}
          </span>
          {{ $t('auth.and') }}
          <span
            class="underline"
            :class="checkError ? 'text-[#E54E4E]' : 'text-white'"
          >
            {{ $t('auth.privacy_policy') }}
          </span>
        </div>
      </div>
      <div class="mb-4 text-center text-xs">
        {{ $t('auth.signup.body.title') }}
      </div>
      <div
        class="group relative mb-6 flex h-10 w-full items-center rounded"
        :class="{
          'bg-[#F5DFDF]': nameError && !nameFocus,
          'bg-white': !nameError && !nameFocus,
          'bg-white opacity-80': nameFocus,
        }"
      >
        <div
          v-if="nameError"
          class="pointer-events-none absolute inset-0 rounded border border-[#E54E4E]"
        />
        <div
          class="absolute left-0 flex w-10 items-center justify-center text-xl"
        >
          <i class="fa-solid fa-user text-base text-black/70" />
        </div>
        <input
          v-model.trim="info.name"
          tabindex="1"
          maxlength="50"
          class="h-full flex-1 rounded bg-transparent px-10 text-sm text-black outline-none transition-all"
          autocomplete="new-password"
          type="text"
          data-cy="032d5393f2970467"
          :placeholder="$t('auth.hint.name')"
          @focus="nameFocus = true"
          @blur="nameFocus = false"
          @change="onNameChange"
          @input="onNameChange"
        />
        <div
          v-if="nameError"
          class="absolute -bottom-[1.1rem] left-0 text-xs text-[#E54E4E]"
        >
          {{ nameError }}
        </div>
      </div>
      <div
        class="group relative mb-6 flex h-10 w-full items-center rounded"
        :class="{
          'bg-[#F5DFDF]': surnameError && !surnameFocus,
          'bg-white': !surnameError && !surnameFocus,
          'bg-white opacity-80': surnameFocus,
        }"
      >
        <div
          v-if="surnameError"
          class="pointer-events-none absolute inset-0 rounded border border-[#E54E4E]"
        />
        <div
          class="absolute left-0 flex w-10 items-center justify-center text-xl"
        >
          <i class="fa-solid fa-user text-base text-black/70" />
        </div>
        <input
          v-model.trim="info.surname"
          tabindex="2"
          maxlength="70"
          class="h-full flex-1 rounded bg-transparent px-10 text-sm text-black outline-none transition-all"
          autocomplete="new-password"
          type="text"
          data-cy="e69b3b92cc999f2c"
          :placeholder="$t('auth.hint.surname')"
          @focus="surnameFocus = true"
          @blur="surnameFocus = false"
          @change="onSurnameChange"
          @input="onSurnameChange"
        />
        <div
          v-if="surnameError"
          class="absolute -bottom-[1.1rem] left-0 text-xs text-[#E54E4E]"
        >
          {{ surnameError }}
        </div>
      </div>
      <div
        class="group relative mb-6 flex h-10 w-full items-center rounded"
        :class="{
          'bg-[#F5DFDF]': emailError && !emailFocus,
          'bg-[#A8A8A8]': !emailError && !emailFocus,
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
          v-model.trim="info.email"
          disabled
          maxlength="100"
          class="h-full flex-1 rounded bg-transparent pl-10 text-sm text-black outline-none transition-all"
          autocomplete="new-password"
          type="text"
          data-cy="65e7d2c6b29dd9f9"
          :placeholder="$t('auth.hint.email')"
          @focus="emailFocus = true"
          @blur="emailFocus = false"
          @change="onEmailChange"
          @input="onEmailChange"
        />
        <div
          v-if="emailError"
          class="absolute -bottom-[1.1rem] left-0 text-xs text-[#E54E4E]"
        >
          {{ emailError }}
        </div>
      </div>
      <div
        class="group relative mb-1 flex h-10 w-full items-center rounded"
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
          v-model.trim="info.email"
          type="email"
          name="email"
          class="hidden"
        />
        <input
          v-model.trim="info.password"
          tabindex="3"
          maxlength="32"
          class="autofill-input h-full flex-1 rounded bg-transparent px-10 text-sm text-black outline-none"
          autocomplete="new-password"
          :type="passwordView ? 'text' : 'password'"
          :style="{
            '--bg-body': passwordError ? '#F5DFDF' : 'white',
          }"
          data-cy="aa45d3476d2e5981"
          :placeholder="$t('auth.hint.password')"
          @focus="passwordFocus = true"
          @blur="passwordFocus = false"
          @change="onPasswordChange"
          @input="onPasswordChange"
          @keyup.enter="onEnter"
        />
        <i
          class="fa-solid absolute right-3 top-[0.7rem] scale-100 cursor-pointer text-base text-black/50 transition-all active:scale-90"
          :class="passwordView ? 'fa-eye' : 'fa-eye-slash'"
          data-cy="ba462f1b32360f08"
          @click="passwordView = !passwordView"
        />
      </div>
      <AuthPassword
        :error="passwordError"
        :password="info.password"
        class="mb-2"
      />
      <div
        class="group relative mb-6 flex h-10 w-full items-center rounded"
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
          tabindex="4"
          maxlength="32"
          class="autofill-input h-full flex-1 rounded bg-transparent px-10 text-sm text-black outline-none"
          autocomplete="new-password"
          :type="confirmPasswordView ? 'text' : 'password'"
          :style="{
            '--bg-body': confirmPasswordError ? '#F5DFDF' : 'white',
          }"
          data-cy="3c73965436bd9ae6"
          :placeholder="$t('auth.hint.confirmPassword')"
          @focus="confirmPasswordFocus = true"
          @blur="confirmPasswordFocus = false"
          @change="onConfirmPasswordChange"
          @input="onConfirmPasswordChange"
          @keyup.enter="onEnter"
        />
        <i
          class="fa-solid absolute right-3 top-[0.7rem] scale-100 cursor-pointer text-base text-black/50 transition-all active:scale-90"
          :class="confirmPasswordView ? 'fa-eye' : 'fa-eye-slash'"
          data-cy="98409883ebe44ea9"
          @click="confirmPasswordView = !confirmPasswordView"
        />
        <div
          v-if="confirmPasswordError"
          class="absolute -bottom-[1.1rem] left-0 text-xs text-[#E54E4E]"
        >
          {{ confirmPasswordError }}
        </div>
      </div>
      <AuthButton
        tabindex="5"
        class="mb-2"
        :loading="authStore.loading"
        data-cy="00619f0545bb85a7"
        @click="onEnter"
        @keyup.enter="onEnter"
      >
        {{ $t('auth.button.enter') }}
      </AuthButton>
      <!-- <div class="cursor-pointer text-center text-white/40">
        {{ $t('auth.terms_conditions') }}
      </div> -->
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
      check: false,
      emailFocus: false,
      nameFocus: false,
      surnameFocus: false,
      passwordFocus: false,
      confirmPasswordFocus: false,
      passwordView: false,
      confirmPasswordView: false,
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      nameError: '',
      surnameError: '',
      checkError: false,
      profilePictureError: false,
    };
  },
  computed: {
    info() {
      return this.authStore.signUpInfo;
    },
    isCheck() {
      return (
        this.info.name.trim().length &&
        this.info.surname.trim().length &&
        checkPassword(this.info.password) &&
        checkPassword(this.info.confirmPassword) &&
        this.info.password === this.info.confirmPassword
      );
    },
  },
  watch: {
    check(state) {
      if (state) {
        this.checkError = false;
      }
    },
    'info.profilePicture'(state) {
      if (state) {
        this.profilePictureError = false;
      }
    },
  },
  methods: {
    goBack() {
      this.authStore.type = 'login';
      this.check = false;
    },
    async onEnter() {
      if (!this.check) {
        this.checkError = true;
        return;
      }
      this.onEmailChange();
      this.onNameChange();
      this.onSurnameChange();
      this.onPasswordChange();
      this.onConfirmPasswordChange();
      await this.$nextTick();
      if (
        this.emailError ||
        this.nameError ||
        this.surnameError ||
        this.passwordError ||
        this.confirmPasswordError
      ) {
        return;
      }
      await this.authStore.register({
        firstName: this.info.name,
        lastName: this.info.surname,
        email: this.info.email,
        password: this.info.password,
        privileges: [],
      });
      this.authStore.signUpStep = 1;
    },
    onEmailChange() {
      if (checkMail(this.info.email)) {
        this.emailError = '';
      } else if (!this.info.email) {
        this.emailError = this.$t('auth.error.required');
      } else {
        this.emailError = this.$t('auth.error.email.invalid');
      }
    },
    onNameChange() {
      this.nameError = '';
      if (this.info.name.length < 2) {
        this.nameError = this.$t('auth.error.name.required');
      }
      if (!this.info.name) {
        this.nameError = this.$t('auth.error.required');
      }
    },
    onSurnameChange() {
      this.surnameError = '';
      if (this.info.surname.length < 2) {
        this.surnameError = this.$t('auth.error.name.required');
      }
      if (!this.info.surname) {
        this.surnameError = this.$t('auth.error.required');
      }
    },
    onPasswordChange() {
      if (checkPassword(this.info.password)) {
        this.passwordError = '';
      } else if (!this.info.password) {
        this.passwordError = this.$t('auth.error.required');
      } else {
        this.passwordError = this.$t('auth.error.password.invalid');
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
  },
};
</script>

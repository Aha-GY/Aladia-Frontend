<template>
  <div class="flex flex-col items-center px-6 pt-8">
    <img :src="info.pictureUrl" class="mb-2 h-24 w-24 rounded object-cover" />
    <div class="mb-4 text-lg font-semibold">
      {{ info.name }} {{ info.surname }}
    </div>
    <div class="mb-8 text-white/70">{{ $t('auth.signup.thanks') }}.</div>
    <div class="mb-20 text-center text-white/70">
      {{ $t('auth.signup.otp.description') }}
    </div>
    <div
      ref="codes"
      class="relative mb-4 flex h-10 w-full justify-between text-xl text-black"
    >
      <input
        v-for="n in 6"
        :key="n"
        v-model="codes[n - 1]"
        maxlength="1"
        :disabled="authStore.loading"
        class="flex w-10 items-center justify-center rounded bg-white text-center outline-none transition-transform active:scale-90"
        data-cy="a7948a40ee1ea028"
        @input="onInput(n - 1)"
        @paste="onPaste"
        @click="onClick"
        @keyup.delete="onDelete(n - 1)"
        @keydown.enter="onEnter"
      />
    </div>
    <div class="mb-24 flex w-full justify-center">
      <div
        class="flex cursor-pointer items-center justify-center text-xs transition-all"
        data-cy="7eaef8b0f6530d6c"
        @click="onResend"
      >
        <i
          v-if="resendLoading"
          class="fa-solid fa-spinner animate-spin text-xs"
        />
        <div v-else class="text-white/50">{{ $t('auth.signup.otp.ask') }}</div>
      </div>
    </div>
    <AuthButton
      class="mb-2"
      :loading="authStore.loading || resendLoading"
      data-cy="6ecc503dda7f7dbd"
      @click="onEnter"
    >
      {{ $t('auth.button.enter') }}
    </AuthButton>
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
      code: '',
      isFocus: false,
      codes: ['', '', '', '', '', ''],
      resendLoading: false,
    };
  },
  computed: {
    info() {
      return this.authStore.signUpInfo;
    },
    isCheck() {
      return this.codes.map((item) => item.trim()).filter(Boolean).length === 6;
    },
  },
  watch: {
    isCheck(state) {
      if (state) {
        this.onEnter();
      }
    },
  },
  methods: {
    async onResend() {
      if (this.resendLoading) {
        return;
      }
      try {
        this.resendLoading = true;
        await sleep(2000);
        await this.authStore.resendCode({
          email: this.info.email,
        });
        this.$toast.success(this.$t('auth.signup.otp.sent'));
      } finally {
        this.resendLoading = false;
      }
    },
    async onEnter() {
      if (this.resendLoading) {
        return;
      }
      if (!this.isCheck) {
        return this.$toast.error(this.$t('auth.signup.otp.empty'));
      }
      await this.authStore.confirm({
        code: Number(this.codes.join('')),
        email: this.info.email,
      });
      this.authStore.signUpStep = 2;
    },
    onInput(index) {
      const $next = this.$refs.codes.children[index + 1];
      if ($next && this.codes[index].trim()) {
        $next.focus();
        $next.select();
      }
    },
    onDelete(index) {
      const $prev = this.$refs.codes.children[index - 1];
      if ($prev && !this.codes[index].trim()) {
        $prev.focus();
        $prev.select();
      }
    },
    onPaste(event) {
      const codes = event.clipboardData.getData('text');
      this.codes = codes.split('');
    },
    onClick(event) {
      event.target.select();
    },
  },
};
</script>

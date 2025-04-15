<template>
  <div class="flex flex-col items-center px-6 pt-8">
    <div class="mb-4 text-lg font-semibold">
      {{ info.name }} {{ info.surname }},
    </div>
    <div class="mb-24 text-white/70">{{ $t('auth.signup.thanks') }}</div>
    <img src="~/assets/logo/image.png" class="mb-28 h-28" />
    <AuthButton data-cy="1586d8b9e5ba6996" @click="onEnter">
      {{ $t('auth.signup.button.marketplace') }}
    </AuthButton>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  computed: {
    info() {
      return this.authStore.signUpInfo;
    },
  },
  methods: {
    onEnter() {
      this.$router.push('/marketplace');
      this.authStore.popup = false;
    },
  },
};
</script>

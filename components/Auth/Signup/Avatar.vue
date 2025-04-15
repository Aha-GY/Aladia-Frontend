<template>
  <div class="mb-4 flex w-full gap-6 px-4">
    <div
      class="relative h-24 w-24 rounded border transition-all"
      :class="error ? 'border-[#E54E4E]' : 'border-white/20 hover:border-white'"
    >
      <div class="gradient absolute inset-0 opacity-20" />
      <img
        v-if="info.pictureUrl"
        class="absolute inset-0 h-full w-full rounded object-cover"
        :src="info.pictureUrl"
      />
      <div class="absolute inset-0 flex items-end justify-center pb-4">
        <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
      </div>
      <input
        type="file"
        accept="image/*"
        class="absolute inset-0 opacity-0"
        @change="onFileChange"
      />
    </div>
    <div>
      <div class="mb-1 text-sm font-semibold">
        {{ $t('auth.signup.header.title') }},
      </div>
      <div class="text-xs text-white/70">
        <div>{{ $t('auth.signup.header.description1') }}</div>
        <div>{{ $t('auth.signup.header.description2') }}</div>
        <div>{{ $t('auth.signup.header.description3') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: Boolean,
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    info() {
      return this.authStore.signUpInfo;
    },
  },
  mounted() {
    this.info.pictureUrl = '/logo/image.png';
  },
  methods: {
    async onFileChange(event) {
      const file = event.target.files[0];

      if (!file.type.startsWith('image/')) {
        return this.$toast.error(this.$t('auth.signup.image.error'));
      }

      this.loading = true;
      await sleep(2000);
      this.info.profilePicture = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.info.pictureUrl = reader.result;
        this.loading = false;
      };
      reader.readAsDataURL(file);
      event.target.value = null;
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

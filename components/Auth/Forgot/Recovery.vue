<template>
  <div
    class="relative flex overflow-hidden rounded border border-white/20 bg-black px-4 py-4"
  >
    <div class="gradient absolute inset-0 opacity-[0.15]" />
    <img src="~/assets/logo/image.png" class="mr-3 h-20 w-20 object-cover" />
    <div>
      <div class="mb-1 text-base font-semibold">
        {{ $t('auth.forgot.recovery.title') }}
      </div>
      <div class="text-white/70">
        <div>{{ $t('auth.forgot.recovery.description1') }}</div>
        <div>{{ $t('auth.forgot.recovery.description2') }}</div>
        <div>{{ $t('auth.forgot.recovery.description3') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
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

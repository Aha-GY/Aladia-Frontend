<template>
  <div
    v-if="appStore.splash"
    class="fixed inset-0 z-[9999] flex h-full w-full items-center justify-center bg-[#101010] transition-opacity duration-300 ease-in-out"
  >
    <div class="relative flex h-64 w-64 items-center justify-center">
      <img
        class="absolute h-full w-full object-cover"
        src="~/assets/images/splash/bg.gif"
      />
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const nuxtApp = useNuxtApp();
const appStore = useAppStore();
const authStore = useAuthStore();
const isFinish = ref(false);

function start() {
  if (!isFinish.value && authStore.logged) {
    appStore.splash = true;
  }
}

async function finish() {
  if (appStore.splash && !isFinish.value) {
    isFinish.value = true;
    appStore.splash = false;
  }
}

nuxtApp.hook('page:start', start);
nuxtApp.hook('page:finish', finish);
nuxtApp.hook('vue:error', finish);
watch(route, start, { immediate: true });
</script>

<style lang="scss" scoped>
.wave-icon {
  animation: waveIconPulse 1.83s 0.4s infinite;
}

@keyframes waveIconPulse {
  0% {
    transform: scaleZ(1);
  }

  30% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  60% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  to {
    transform: scaleZ(1);
  }
}
</style>

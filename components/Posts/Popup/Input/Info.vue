<template>
  <div class="w-18 relative flex h-12 shrink-0 items-center justify-center">
    <div v-if="logged" class="flex items-center">
      <BaseAvatarSwitch class="relative" />
    </div>

    <div v-else class="relative flex h-full w-full items-center justify-center">
      <img
        class="h-full w-full object-contain opacity-50"
        src="~/assets/logo/image.png"
      />
      <img class="absolute h-6 object-contain" src="~/assets/icons/lock.svg" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const globalStore = useGlobalStore();
    return { authStore, globalStore };
  },
  computed: {
    logged() {
      return this.authStore.logged;
    },
    editorLoading() {
      return this.globalStore.editorLoading;
    },
  },
};
</script>

<template>
  <div
    class="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/5"
  >
    <BaseAvatarNext
      v-if="logged"
      :picture="authStore?.user?.picture"
      size="md"
      :show-online="false"
      class="size-12 rounded-full bg-transparent object-contain"
    />
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
    const socialStore = useSocialStore();
    return { authStore, socialStore };
  },
  computed: {
    logged() {
      return this.authStore.logged;
    },
  },
};
</script>

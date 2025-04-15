<template>
  <LazyHeaderStateMobile v-if="$device.isMobile" />
  <div v-else class="pr-4">
    <LazyHeaderStateLogged v-if="isLogged" />
    <LazyHeaderStateJoin v-else />
  </div>
</template>

<script setup>
const authStore = useAuthStore();
const isLogged = computed(() => authStore.logged);
</script>

<style lang="scss">
.ProfileMenuDrawer {
  .el-drawer__body {
    .work-education-cerificate {
      padding: 0.5rem 1rem;
    }
  }
}
</style>

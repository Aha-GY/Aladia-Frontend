<template>
  <OrganizationDetail
    v-if="authStore.isOrg"
    class="relative text-[#D9D9D9] transition-all duration-500"
    :is-header="true"
  />
  <PersonalDetail
    v-if="authStore.isUser"
    class="relative text-[#D9D9D9] transition-all duration-500"
    :is-header="true"
  />
  <PostsDetail />
</template>

<script setup>
const authStore = useAuthStore();
</script>

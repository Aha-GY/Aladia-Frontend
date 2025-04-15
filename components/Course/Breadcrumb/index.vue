<template>
  <div
    v-if="from"
    class="breadcrumb-shadow pointer-events-none absolute left-0 top-0 z-10 h-1/3 w-full"
  />
  <div
    v-if="from"
    class="absolute left-0 right-0 top-0 z-20 overflow-hidden px-5 pt-5"
  >
    <OrganizationHubSpaceBreadcrumb
      v-if="from === 'space' && logged"
      class="pointer-events-auto"
    />
    <CourseBreadcrumbMarketplace
      v-if="from === 'marketplace'"
      class="pointer-events-auto"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  computed: {
    from() {
      return this.$route.query.from;
    },
    logged() {
      return this.authStore.logged;
    },
  },
};
</script>

<style>
.breadcrumb-shadow {
  background: transparent
    linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0, rgba(0, 0, 0, 0) 100%) 0% 0%
    no-repeat padding-box;
}
</style>

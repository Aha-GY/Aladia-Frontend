<template>
  <div class="min-h-[32rem]">
    <OrganizationHubSpaceList v-if="view === 'list'" />
    <OrganizationHubSpaceGrid v-if="view === 'grid'" />
  </div>
</template>

<script>
export default {
  computed: {
    view() {
      return this.$route.query.view || 'grid';
    },
  },
};
</script>

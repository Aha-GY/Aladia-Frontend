<template>
  <OrganizationHubSpaceGridDetail v-if="spaceId" />
  <OrganizationHubSpaceGridSpace v-else />
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  computed: {
    spaceId() {
      return this.$route.query.space;
    },
  },
};
</script>

<template>
  <div data-layout="list">
    <OrganizationHubSpaceListSpace
      v-for="space in spaces"
      :key="space.id"
      :space="space"
    />
    <OrganizationHubSpaceDrag />
  </div>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  computed: {
    type() {
      return this.$route.query.type || 'all';
    },
    spaces() {
      if (this.type === 'my') {
        return this.hubSpaces.spaces.filter((space) => !space.invitedBy);
      }

      if (this.type === 'shared') {
        return this.hubSpaces.spaces.filter((space) => !!space.invitedBy);
      }

      return this.hubSpaces.spaces;
    },
  },
  mounted() {
    this.hubSpaces.getSpaces();
  },
};
</script>

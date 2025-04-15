<template>
  <OrganizationHubSpaceGridDetailMain v-if="space?.id" />
  <OrganizationHubSpaceDrag />
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
    space() {
      return this.hubSpaces.find(this.spaceId);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (!this.space?.id) {
        await this.hubSpaces.getSpaces();
      }

      if (!this.space?.id) {
        showError({
          statusCode: 404,
          statusMessage: `Space not found: ${this.spaceId}`,
        });
      }
    },
  },
};
</script>

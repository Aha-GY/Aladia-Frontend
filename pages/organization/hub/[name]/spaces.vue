<template>
  <client-only>
    <OrganizationHubSpace />
  </client-only>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
};
</script>

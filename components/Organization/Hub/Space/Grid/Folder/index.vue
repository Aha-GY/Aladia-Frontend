<template>
  <div
    v-if="folders.length > 0"
    id="folder"
    class="folder-list -m-4 mb-4 flex flex-wrap"
  >
    <OrganizationHubSpaceGridFolderItem
      v-for="folder in folders"
      :key="folder.id"
      :folder="folder"
    />
  </div>
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
    folders() {
      return this.space?.folders || [];
    },
  },
};
</script>

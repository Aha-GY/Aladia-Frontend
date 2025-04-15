<template>
  <div class="mb-2 flex flex-col gap-2">
    <OrganizationHubSidebarChildrenFoldersItem
      v-for="folder in folders"
      :key="folder.id"
      :folder="folder"
      :data-cy="`space-folders-${folder.id}`"
    />
  </div>
</template>

<script>
export default {
  props: {
    folders: {
      type: Array,
      required: true,
    },
  },
};
</script>

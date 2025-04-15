<template>
  <div class="flex h-14 items-center gap-2 pl-9 pr-4">
    <BaseIconFolder class="size-10 shrink-0" />
    <div class="relative flex-1">
      <BaseInput
        ref="name"
        v-model="name"
        class="text-sm"
        fixed
        :max-length="30"
        :placeholder="$t('index.name')"
        show-limit
        data-cy="sidebar-create-new-folder-name"
        @enter="onSave"
      />
    </div>
    <div
      class="flex size-5 cursor-pointer items-center justify-center text-sm"
      data-cy="00d2324a8671f13e"
      @click="onSave"
    >
      <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
      <i v-else class="fa-solid fa-check text-[#578348]" />
    </div>
    <div
      class="flex size-5 cursor-pointer items-center justify-center text-sm"
      data-cy="be687f8693a6ddd7"
      @click="onClose"
    >
      <i class="fa-solid fa-xmark" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    folder: {
      type: Object,
    },
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSpaces, hubSidebar };
  },
  data() {
    return {
      name: this.folder?.name || '',
      loading: false,
    };
  },
  computed: {
    space() {
      return this.hubSidebar.space.data;
    },
    children() {
      return this.hubSidebar.children;
    },
    length() {
      return this.name.length;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.name.$refs.input.focus();
    });
  },
  methods: {
    async onSave() {
      if (this.loading) {
        return;
      }

      if (!this.name.trim()) {
        return this.$toast.error(this.$t('space.error.folder.name'));
      }

      if (!this.space?.id) {
        return this.$toast.error(this.$t('space.error.empty'));
      }

      try {
        this.loading = true;

        if (this.folder) {
          await this.hubSpaces.updateFolder({
            spaceId: this.space.id,
            folderId: this.folder.id,
            name: this.name,
          });
        } else {
          await this.hubSpaces.createFolder({
            spaceId: this.space.id,
            parent: this.space.rootFolder.id,
            name: this.name,
          });
        }

        this.hubSpaces.getSpaces();

        this.hubSpaces.getFolders({
          spaceId: this.space.id,
        });

        this.loading = false;
        this.$emit('close');
        this.children.folderCreating = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    onClose() {
      this.children.folderCreating = false;
      this.$emit('close');
    },
  },
};
</script>

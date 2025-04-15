<template>
  <OrganizationHubSpacePopup>
    <div class="-mt-36 w-full rounded bg-black p-3 md:w-[36rem]">
      <div class="mb-3 flex items-center justify-between text-sm">
        <div class="flex items-center gap-3">
          <i class="fa-sharp fa-solid fa-folder-xmark" />
          {{ $t('course.folder.label') }}
        </div>
        <BaseIconClose
          data-cy="3e4e3bed7bbf3c66"
          @click="hubSpaces.deleteFolder = false"
        />
      </div>
      <div class="mb-3 text-xs text-white/50">
        {{ $t('course.folder.description') }}
        {{ $t('course.folder.dialog') }}
      </div>
      <div
        v-for="folder in folders"
        :key="folder.id"
        class="mb-2 flex items-center gap-4 pl-4 text-sm"
      >
        <BaseIconFolder />
        <div class="max-w-96 truncate">{{ folder.name }}</div>
      </div>
      <div class="flex justify-end">
        <BaseButton type="error" data-cy="1299bf357a7361c5" @click="onDelete">
          <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
          {{ $t('org.collapse') }}
        </BaseButton>
      </div>
    </div>
  </OrganizationHubSpacePopup>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    folders() {
      return this.hubSpaces.deleteFolder;
    },
  },
  methods: {
    async onDelete() {
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;

        // 可能来自不同的spaces
        const sapces = {};

        for (let index = 0; index < this.folders.length; index++) {
          const folder = this.folders[index];
          sapces[folder._spaceId] = true;
          await this.hubSpaces.removeFolder({
            spaceId: folder._spaceId,
            folderId: folder.id,
          });
        }

        // 刷新space下的folders和courses
        for (const spaceId in sapces) {
          const space = this.hubSpaces.find(spaceId);
          await this.hubSpaces.getFolders({ spaceId });
          await this.hubSpaces.getCourses({
            spaceId,
            folderId: space.rootFolder.id,
          });
        }

        this.hubSpaces.getSpaces();

        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }

      this.hubSpaces.deleteFolder = false;
    },
  },
};
</script>

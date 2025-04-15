<template>
  <div
    class="group/space mb-2 rounded border-l bg-black"
    :class="expand ? '' : 'hover:bg-[#1c1c1c]'"
    :style="{ borderColor: space.color }"
  >
    <OrganizationHubSpaceListSpaceHeader
      :space="space"
      :expand="expand"
      @expand="onChange"
    />
    <div
      class="overflow-hidden px-2 transition-all duration-300"
      :class="{
        'pb-3': expand,
        'pb-0': !expand,
        'max-h-0': !expand,
        'max-h-[100rem]': expand,
      }"
    >
      <div v-if="expand">
        <OrganizationHubSpaceListFolder
          v-for="folder in space.folders"
          :key="folder.id"
          :space="space"
          :folder="folder"
        />
        <OrganizationHubSpaceListFolderNew :space="space" />
        <div class="px-0">
          <OrganizationHubSpaceListCourse
            :space="space"
            :folder="space.rootFolder"
            :courses="space.courses"
            :level="0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    space: Object,
  },
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
    expand() {
      return this.hubSpaces.spacesExpand.includes(this.space.id);
    },
  },
  watch: {
    expand: {
      immediate: true,
      handler(state) {
        if (state) {
          this.load();
        }
      },
    },
  },
  methods: {
    async load() {
      if (this.loading) {
        return;
      }
      try {
        this.loading = true;
        await this.hubSpaces.getFolders({
          spaceId: this.space.id,
        });
        await this.hubSpaces.getCourses({
          spaceId: this.space.id,
          folderId: this.space.rootFolder.id,
        });
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    onChange() {
      if (this.expand) {
        this.hubSpaces.spacesExpand = this.hubSpaces.spacesExpand.filter(
          (id) => id !== this.space.id,
        );
      } else {
        this.hubSpaces.spacesExpand.push(this.space.id);
      }
    },
  },
};
</script>

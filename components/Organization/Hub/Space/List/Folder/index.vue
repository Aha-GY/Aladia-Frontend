<template>
  <div
    class="group/folder mb-2 rounded"
    :class="expand ? 'bg-[#0d0d0d]' : 'hover:bg-[#0d0d0d]'"
  >
    <OrganizationHubSpaceListFolderHeader
      :folder="folder"
      :space="space"
      :expand="expand"
      @expand="expand = !expand"
    />
    <div
      class="overflow-hidden px-1 transition-all duration-300"
      :class="{
        'pb-3': expand,
        'pb-0': !expand,
        'max-h-0': !expand,
        'max-h-[100rem]': expand,
      }"
    >
      <OrganizationHubSpaceListCourse
        v-if="expand"
        :space="space"
        :folder="folder"
        :courses="folder.courses"
        :level="1"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    space: Object,
    folder: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  data() {
    return {
      expand: false,
    };
  },
  watch: {
    expand(state) {
      if (state) {
        this.load();
      }
    },
  },
  methods: {
    async load() {
      await this.hubSpaces.getCourses({
        spaceId: this.space.id,
        folderId: this.folder.id,
      });
    },
  },
};
</script>

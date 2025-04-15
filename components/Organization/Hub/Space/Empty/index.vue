<template>
  <div class="flex flex-col items-center pt-24">
    <BaseNoData class="mb-4" />
    <div class="mb-16 text-sm text-[#505050]">
      {{ $t('course.empty') }} {{ $t('course.buy') }}
    </div>
    <BaseButton
      v-if="space.mode === 'shopping'"
      type="primary"
      data-cy="c3555cfcd8a6c068"
      @click="$router.push(`/marketplace`)"
    >
      {{ $t('index.hero.button') }}
    </BaseButton>
  </div>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSpaces, hubSidebar };
  },
  computed: {
    spaceId() {
      return this.$route.query.space;
    },
    space() {
      return this.hubSpaces.find(this.spaceId);
    },
    folder() {
      return this.hubSpaces.find(this.folderId);
    },
    folderId() {
      return this.$route.query.folder;
    },
    isFolder() {
      return !!this.folderId;
    },
  },
  methods: {
    onCourseCreate() {
      this.hubSidebar.createSidebarCourse({
        space: this.space,
        folder: this.isFolder ? this.folder : this.space.rootFolder,
      });
    },
  },
};
</script>

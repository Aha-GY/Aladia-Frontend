<template>
  <div class="mb-2 flex items-center rounded bg-[#5c1fad] px-2 py-0.5 text-sm">
    <div class="flex-1 text-center">
      {{ $t('index.version.viewing') }}
      <span class="underline">{{ versionViewing.title }}</span>
    </div>
    <div
      class="flex size-4 cursor-pointer items-center justify-center"
      data-cy="3fba97e74d87ec5b"
      @click="onExitVersion"
    >
      <i class="fa-light fa-close" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSpaces, hubSidebar };
  },
  computed: {
    versionViewing() {
      return this.hubCourse.versionViewing;
    },
    version() {
      return this.hubCourse.version;
    },
  },
  methods: {
    onExitVersion() {
      this.version.exit = true;
    },
  },
};
</script>

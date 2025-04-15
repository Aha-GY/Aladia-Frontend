<template>
  <div
    class="flex items-center gap-4"
    :class="level === 1 ? '-translate-x-1' : ''"
  >
    <OrganizationHubSpaceListHandle
      :item="course"
      :class="
        checked || $device.isMobile
          ? ''
          : 'opacity-0 group-hover/course:opacity-100'
      "
    />
    <OrganizationHubSpaceListCheckbox
      :item="course"
      :folder="folder"
      :space="space"
      class="shrink-0"
      :class="
        checked || $device.isMobile
          ? ''
          : 'opacity-0 group-hover/course:opacity-100'
      "
    />
    <div class="flex shrink-0 items-center gap-2 leading-none">
      <BaseCourseThumbnail class="h-7 shrink-0" :url="course.thumbnail?.url" />
      {{ course.title }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    folder: Object,
    course: Object,
    space: Object,
    level: Number,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  computed: {
    checked() {
      return this.course._state === 'checked';
    },
  },
};
</script>

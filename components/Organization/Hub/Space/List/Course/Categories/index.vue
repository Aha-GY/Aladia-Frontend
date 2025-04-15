<template>
  <div
    class="flex h-8 cursor-pointer items-center justify-between rounded"
    data-cy="e653d974f00cc0cb"
    @click="onEdit"
  >
    <div v-if="item" class="flex items-center gap-2">
      <img :src="item.image" class="size-4 rounded-sm object-cover" />
      {{ item.name }}
    </div>
    <div v-else>---</div>
    <div v-if="rest > 0" class="text-white/50">+{{ rest }}</div>
  </div>
</template>

<script>
export default {
  props: {
    course: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSpaces, hubCourse, hubSidebar };
  },
  computed: {
    editable() {
      return this.hubSpaces.checkCourseEditable(this.course);
    },
    subCategories() {
      return this.course?.subCategories || [];
    },
    item() {
      return this.subCategories[0];
    },
    rest() {
      return this.subCategories.length - 1;
    },
  },
  methods: {
    onEdit() {
      if (!this.editable) {
        return;
      }
      this.hubSidebar.edieCourse({
        course: this.course,
        isBuilder: true,
      });
      this.hubCourse.step = 2;
    },
  },
};
</script>

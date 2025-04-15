<template>
  <div class="flex cursor-pointer items-center justify-center">
    <div
      v-if="editable"
      class="flex size-5 items-center justify-center rounded border"
      :class="
        isEditOpen
          ? 'border-white bg-white/10 text-white'
          : 'border-white/50 text-white/50'
      "
      data-cy="c5bb647b984f1707"
      @click="onEdit"
    >
      <i class="fa-light fa-pen-to-square scale-75 text-xs" />
    </div>
    <div
      v-else
      class="flex size-5 items-center justify-center rounded border border-[#e1c152]"
      :class="isAssignOpen ? 'bg-yellow-500/50 text-white' : 'text-[#e1c152]'"
      data-cy="9a0938a84af80620"
      @click="onAssign"
    >
      <i
        class="fa-light fa-cart-shopping -translate-x-[1px] scale-75 text-xs"
      />
    </div>
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
    return { hubCourse, hubSpaces, hubSidebar };
  },
  computed: {
    editable() {
      return this.hubSpaces.checkCourseEditable(this.course);
    },
    isEditOpen() {
      return this.hubCourse.isEdit;
    },
    isAssignOpen() {
      return this.hubSpaces.editLicenses;
    },
  },
  methods: {
    onEdit() {
      this.hubSidebar.edieCourse({
        course: this.course,
        isBuilder: true,
      });
    },
    onAssign() {
      //
    },
  },
};
</script>

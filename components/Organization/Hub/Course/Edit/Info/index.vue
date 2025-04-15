<template>
  <OrganizationHubCourseEditWrap
    :step="1"
    title="Info"
    icon="fa-solid fa-book-reader"
  >
    <OrganizationHubCourseEditInfoTitle />
    <OrganizationHubCourseEditInfoType />
    <OrganizationHubCourseEditInfoThumbnail />
    <OrganizationHubCourseEditInfoTrailer />
    <OrganizationHubCourseEditInfoCycles v-if="course.type === 'live'" />
    <OrganizationHubCourseEditInfoAvailability v-if="course.type === 'live'" />
    <OrganizationHubCourseEditInfoReview />
    <OrganizationHubCourseEditInfoLanguage />
    <OrganizationHubCourseEditInfoSpace />
    <OrganizationHubCourseEditInfoVisibility />
    <OrganizationHubCourseEditInfoSkills />
    <OrganizationHubCourseEditInfoDescription />
    <OrganizationHubCourseEditInfoGoals
      :selected-goals="selectedGoals"
      @on-remove="onRemove"
      @on-select="onSelect"
    />
    <OrganizationHubCourseEditInfoRequirements
      :number-of-elements="numberOfElements"
      :selected-requirements="selectedRequirements"
      @on-remove="onRemove"
      @on-select="onSelect"
    />
  </OrganizationHubCourseEditWrap>

  <template v-if="numberOfElements">
    <div
      v-if="!hubCourse.isPreview"
      class="absolute bottom-12 left-0 !z-[100] w-full p-4"
    >
      <OrganizationHubCourseEditInfoActionToolbar
        :number-of-elements="numberOfElements"
        @on-cancel="oncancel"
        @on-delete="onDelete"
      />
    </div>

    <Teleport v-else to="body">
      <div
        v-if="numberOfElements"
        class="fixed bottom-16 left-0 !z-[100] w-full p-4"
      >
        <div class="mx-auto w-3/6">
          <OrganizationHubCourseEditInfoActionToolbar
            :number-of-elements="numberOfElements"
            @on-cancel="oncancel"
            @on-delete="onDelete"
          />
        </div>
      </div>
    </Teleport>
  </template>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      selectedGoals: [],
      selectedRequirements: [],
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    numberOfElements() {
      return this.selectedGoals.length + this.selectedRequirements.length;
    },
  },
  methods: {
    onSelect(index, type) {
      if (type === 'goal') {
        if (this.selectedGoals.includes(index)) {
          this.selectedGoals = this.selectedGoals.filter((i) => i !== index);
        } else {
          this.selectedGoals.push(index);
        }
      } else {
        if (this.selectedRequirements.includes(index)) {
          this.selectedRequirements = this.selectedRequirements.filter(
            (i) => i !== index,
          );
        } else {
          this.selectedRequirements.push(index);
        }
      }
    },
    onRemove(index, type) {
      if (type === 'goal') {
        this.hubCourse.detail.objectives.splice(index, 1);

        this.selectedGoals = this.selectedGoals
          .filter((i) => i !== index)
          .map((i) => (i > index ? i - 1 : i));
      } else {
        this.hubCourse.detail.requirements.splice(index, 1);

        this.selectedRequirements = this.selectedRequirements
          .filter((i) => i !== index)
          .map((i) => (i > index ? i - 1 : i));
      }
    },
    oncancel() {
      this.selectedRequirements = [];
      this.selectedGoals = [];
    },
    onDelete() {
      this.hubCourse.detail.objectives =
        this.hubCourse.detail.objectives.filter(
          (_, i) => !this.selectedGoals.includes(i),
        );
      this.hubCourse.detail.requirements =
        this.hubCourse.detail.requirements.filter(
          (_, i) => !this.selectedRequirements.includes(i),
        );
      this.selectedGoals = [];
      this.selectedRequirements = [];
    },
  },
};
</script>

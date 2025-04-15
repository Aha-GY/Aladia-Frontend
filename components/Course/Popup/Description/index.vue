<template>
  <div>
    <CoursePopupDescriptionCollapse
      :name="$t('course.popup.course.name')"
      icon="fa-angle-right"
      :title="$t('course.popup.course.title')"
    >
      <CoursePopupDescriptionCourse />
      <div v-for="(chapter, index) in chapters" :key="index">
        <CoursePopupDescriptionChapter
          :chapter="chapter"
          :chapter-index="index"
        />
      </div>
    </CoursePopupDescriptionCollapse>
    <CoursePopupDescriptionCollapse
      id="data-course-popup-description-skills"
      :name="$t('course.popup.skill.name')"
      icon="fa-bullseye-arrow"
      :title="$t('course.popup.skill.title')"
    >
      <CoursePopupDescriptionSkills />
    </CoursePopupDescriptionCollapse>
    <CoursePopupDescriptionCollapse
      :name="$t('course.popup.goals.name')"
      icon="fa-bullseye-arrow"
      :title="$t('course.popup.goals.title')"
    >
      <CoursePopupDescriptionGoals />
    </CoursePopupDescriptionCollapse>
    <CoursePopupDescriptionCollapse
      :name="$t('course.popup.requirement.name')"
      icon="fa-check"
      :title="$t('course.requirements')"
    >
      <CoursePopupDescriptionRequirement />
    </CoursePopupDescriptionCollapse>
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    chapters() {
      return this.courseStore.course.chapters;
    },
  },
};
</script>

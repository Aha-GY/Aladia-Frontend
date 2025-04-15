<template>
  <div class="pt-4">
    <CoursePopupQuestionHeader />
    <div class="flex gap-4">
      <CoursePopupQuestionState />
      <CoursePopupQuestionGrid v-if="question.view === 'grid'" />
      <CoursePopupQuestionList v-if="question.view === 'list'" />
    </div>
    <PostsCreation type="question" @send="handleCreated" />
    <PostsDetail @delete="handleDelete" @hide="handleDelete" />
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    question() {
      return this.courseStore.question;
    },
  },
  methods: {
    handleCreated() {
      this.courseStore.getQuestions();
    },
    handleDelete(item) {
      this.courseStore.deleteQuestion(item);
    },
  },
};
</script>

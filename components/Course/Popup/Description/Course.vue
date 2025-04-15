<template>
  <div class="mb-8 pl-3" data-cy="course-description">
    <div
      class="mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row"
    >
      <div class="flex gap-4">
        <BaseAvatarNext
          :picture="course.owner?.picture"
          :user-id="course.owner?.id"
          :story="course.owner?.story"
          :source="'profile'"
          :size="'md'"
          :show-online="false"
          class="size-[3.875rem]"
        />
        <div>
          <div class="text-sm text-white/50">{{ course.owner?.name }}</div>
          <div class="text-white">{{ course.title }}</div>
        </div>
      </div>
      <BaseCourseThumbnail class="h-16" :url="course.thumbnail?.url" />
    </div>
    <div
      v-if="course.description"
      class="[&>ul]:ml-6 [&>ul]:list-disc"
      v-html="course.description"
    />
    <CoursePopupDescriptionNoData v-else />
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
    completion() {
      return this.course.completion || this.courseStore.completion.average || 0;
    },
  },
};
</script>

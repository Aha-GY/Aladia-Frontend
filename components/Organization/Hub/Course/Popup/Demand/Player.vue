<template>
  <div class="flex gap-4">
    <div class="flex w-4 justify-center" />
    <div class="aspect-video flex-1">
      <MarketCardFloatPlayer :autoplay="false" :course="course" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lecture: Object,
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    course() {
      return {
        ...this.lecture,
        trailer: this.lecture.videos[0],
        thumbnail: this.lecture.thumbnail?.url
          ? this.lecture.thumbnail
          : this.hubCourse.detail.thumbnail,
      };
    },
  },
};
</script>

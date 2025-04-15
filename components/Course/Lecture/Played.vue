<template>
  <div
    v-if="played"
    class="absolute -bottom-1.5 left-0.5 right-0.5 h-0.5 rounded bg-white/30"
  >
    <div class="h-full bg-purple-800" :style="{ width: `${played * 100}%` }" />
  </div>
</template>

<script>
export default {
  props: {
    lecture: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    isLiveRecord: {
      type: Boolean,
      required: false,
    },
    lectureIndex: {
      type: Number,
    },
  },
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    player() {
      return this.courseStore.player;
    },
    completion() {
      const completion = this.courseStore.getLectureCompletion(
        this.lecture,
        this.isLiveRecord,
      );
      if (this.isLiveRecord) {
        if (this.lectureIndex >= 0 && completion && completion.length > 0) {
          return completion && completion[this.lectureIndex - 1];
        } else {
          return 0;
        }
      }
      return completion || 0;
    },
    played() {
      return this.active && this.player.currentTime
        ? this.player.played
        : this.completion / 100;
    },
  },
};
</script>

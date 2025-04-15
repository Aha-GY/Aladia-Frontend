<template>
  <div class="flex flex-col gap-4 p-3">
    <draggable
      :list="chapter.lectures"
      item-key="id"
      :animation="200"
      ghost-class="ghost"
      :disabled="disabled"
      handle=".lecture-handle"
      tag="div"
      :component-data="componentData"
      @start="onStart"
      @end="onEnd"
    >
      <template #item="{ element }">
        <OrganizationHubCoursePreviewContentLecturesItem
          :chapter-index="chapterIndex"
          :chapter="chapter"
          :lecture="element"
          :drag="drag"
        />
      </template>
    </draggable>
    <div v-if="chapter.lectures.length === 0">
      <OrganizationHubCoursePreviewContentLecturesAdd
        :chapter="chapter"
        :chapter-index="chapterIndex"
        :lecture-index="-1"
      />
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  props: {
    chapter: {
      type: Object,
      required: true,
    },
    chapterIndex: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      drag: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    disabled() {
      if (this.chapterIndex === 0) {
        return false;
      }
      return this.course.type === 'live';
    },
    componentData() {
      return {
        'data-chapter-index': this.chapterIndex,
        'data-chapter-id': this.chapter.id,
      };
    },
  },
  methods: {
    onStart() {
      this.drag = true;
    },
    async onEnd({ item, newIndex, oldIndex }) {
      this.drag = false;
      if (newIndex === oldIndex) {
        return;
      }
      await this.hubCourse.reorderLecture({
        chapterId: this.chapter.id,
        lectureId: item.dataset.lectureId,
        position: newIndex,
      });
    },
  },
};
</script>

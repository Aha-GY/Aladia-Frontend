<template>
  <div class="relative mb-5 flex items-end gap-3">
    <div class="flex size-4 items-center justify-center pb-2 text-white/50">
      <i class="fa-light fa-video" />
    </div>
    <BaseInputUpload
      title="course.trailer"
      accept="video/*"
      :name="metadata.name"
      placeholder="base.upload.video"
      class="flex-1"
      data-cy="upload-video-item"
      unsupported="base.upload.error.video"
      :show-remove="false"
      @start="onStart"
      @uploaded="onUploaded"
      @remove="onRemove"
      @error="onRemove"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    trailer() {
      return this.course.trailer;
    },
    metadata() {
      return this.trailer.metadata;
    },
  },
  beforeUnmount() {
    this.hubCourse.courseSaveDisabled = false;
  },
  methods: {
    onStart({ file }) {
      this.metadata.name = file.name;
      this.hubCourse.courseSaveDisabled = true;
    },
    onUploaded({ fileId, file }) {
      this.trailer.fileId = fileId;
      this.trailer.url = URL.createObjectURL(file);
      this.metadata.size = file.size;
      this.metadata.mimetype = file.type;
      this.hubCourse.courseSaveDisabled = false;
    },
    onRemove() {
      this.metadata.name = '';
      this.hubCourse.courseSaveDisabled = false;
    },
  },
};
</script>

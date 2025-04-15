<template>
  <div class="relative mb-5 flex items-end gap-3">
    <div class="flex size-4 items-center justify-center pb-2 text-white/50">
      <i class="fa-light fa-image" />
    </div>
    <BaseInputUpload
      title="course.thumbnail.name"
      accept="image/*"
      :name="metadata.name"
      placeholder="base.upload.image"
      class="flex-1"
      data-cy="upload-image-item"
      unsupported="auth.signup.image.error"
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
    thumbnail() {
      return this.course.thumbnail;
    },
    metadata() {
      return this.thumbnail.metadata;
    },
  },
  methods: {
    onStart({ file }) {
      this.metadata.name = file.name;
      this.hubCourse.courseSaveDisabled = true;
    },
    onUploaded({ fileId, file }) {
      this.thumbnail.fileId = fileId;
      this.metadata.size = file.size;
      this.metadata.mimetype = file.type;
      this.hubCourse.courseSaveDisabled = false;
      this.course.thumbnail.url = URL.createObjectURL(file);
    },
    onRemove() {
      this.metadata.name = '';
      this.hubCourse.courseSaveDisabled = false;
    },
  },
};
</script>

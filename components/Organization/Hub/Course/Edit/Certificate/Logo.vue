<template>
  <div class="mb-2 flex w-full items-end gap-2">
    <div class="flex size-5 items-center justify-center pb-1">
      <i class="fa-solid fa-image text-sm text-white/50" />
    </div>
    <BaseInputUpload
      title="course.thumbnail.logo"
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
    placeholder() {
      return this.hubCourse.detail.certificateTemplate;
    },
    metadata() {
      return this.placeholder.logo.metadata;
    },
  },
  methods: {
    onStart({ file }) {
      this.metadata.name = file.name;
      this.metadata.size = file.size;
      this.metadata.mimetype = file.type;
      this.placeholder.logo.url = URL.createObjectURL(file);
    },
    onUploaded({ fileId, file }) {
      this.placeholder.logo.url = URL.createObjectURL(file);
      this.placeholder.logo.fileId = fileId;
    },
    onRemove() {
      this.metadata.name = '';
    },
  },
};
</script>

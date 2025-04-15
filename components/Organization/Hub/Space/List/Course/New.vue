<template>
  <div
    class="flex h-12 items-center gap-3"
    :class="level === 1 ? 'pl-[3.9rem]' : 'pl-[4.1rem]'"
  >
    <OrganizationHubSpaceCreateCourseMain
      ref="course"
      class="w-64"
      @name="onNameChange"
      @file="onFileChange"
      @color="onColorChange"
      @enter="onCreate"
    />
    <div
      v-show="name"
      class="flex cursor-pointer items-center gap-2 rounded bg-black px-2 py-1 text-13 text-white/70 hover:bg-white/10 hover:text-white"
      data-cy="0641d947677fe2db"
      @click="onCreate"
    >
      <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
      <i v-else class="fa-light fa-check" />
      {{ $t('base.upload.save') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    level: Number,
    space: Object,
    folder: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  data() {
    return {
      name: '',
      color: '',
      file: null,
      loading: false,
    };
  },
  methods: {
    async onCreate() {
      if (this.loading) {
        return;
      }

      if (!this.name) {
        this.$toast.error(this.$t('course.error.name'));
        return;
      }

      if (!this.color) {
        this.$toast.error(this.$t('course.error.color'));
        return;
      }

      if (!this.file) {
        this.$toast.error(this.$t('course.error.thumbnail'));
        return;
      }

      try {
        this.loading = true;
        const { fileId } = await upload({ file: this.file });

        await this.hubSpaces.createCourse({
          spaceId: this.folder._spaceId,
          folderId: this.folder.id,
          title: this.name,
          type: 'on-demand',
          color: this.color,
          visibility: 'public',
          thumbnail: {
            fileId,
            metadata: {
              size: this.file.size,
              mimetype: this.file.type,
              name: this.file.name,
            },
          },
        });

        await this.hubSpaces.getCourses({
          spaceId: this.folder._spaceId,
          folderId: this.folder.id,
        });

        this.hubSpaces.getSpaces();

        this.$refs.course.reset();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }

      this.hubSpaces.newCourse = false;
    },
    onNameChange(name) {
      this.name = name;
    },
    onFileChange(file) {
      this.file = file;
    },
    onColorChange(color) {
      this.color = color;
    },
  },
};
</script>

<template>
  <div class="flex items-center gap-4">
    <div class="flex w-4 justify-center">
      <i class="fa-light fa-image text-base text-white/20" />
    </div>
    <div
      ref="inputRef"
      class="group/input relative flex flex-1 flex-col items-center justify-end pb-1 text-13"
    >
      <div class="flex w-full items-center gap-1">
        <div
          class="relative z-0 flex w-0 flex-1 cursor-pointer items-center"
          :class="focus || name ? 'opacity-100' : 'opacity-0'"
          data-cy="0d91da5e169815e2"
          @click="focus = true"
        >
          <div v-if="name" class="flex h-full w-full items-center gap-2 pr-4">
            <div class="w-0 flex-1 truncate">
              {{ name }}
            </div>
            <div v-if="file && loading" class="text-white/50">
              {{ getFileSize(size) }}
              /
              {{ getFileSize(file.size) }}
            </div>
          </div>
          <div
            v-else
            class="flex h-full items-center gap-2 text-white/30 group-hover/input:text-white/50"
          >
            {{ $t('base.upload.image') }}
          </div>
          <input
            type="file"
            accept="image/*"
            class="absolute inset-0 z-10 opacity-0"
            data-cy="95ffd7819cca385f"
            @change="onUpload"
          />
        </div>
      </div>
      <div
        class="pointer-events-none absolute bottom-0.5 left-0 z-10 transition-all"
        :class="{
          'opacity-0': focus || name,
          'text-[#b0a43e]': focus,
          'text-white/30 group-hover/input:text-white/50': !focus,
        }"
      >
        {{ $t('course.thumbnail.name') }}
      </div>
      <div
        class="absolute bottom-0 left-0 right-0 h-[1px] transition-all duration-300"
        :class="
          focus && !loading
            ? 'bg-[#a2842a]'
            : 'bg-white/10 group-hover/input:bg-white/30'
        "
      >
        <div
          v-if="file && loading"
          class="h-full bg-[#68598a] transition-all duration-300"
          :style="{
            width: (size / file.size) * 100 + '%',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lecture: Object,
  },
  setup() {
    const focus = ref(false);
    const inputRef = ref(null);

    onClickOutside(inputRef, () => {
      focus.value = false;
    });

    const hubCourse = useHubCoursesStore();
    return { hubCourse, focus, inputRef };
  },
  data() {
    return {
      file: null,
      size: 0,
      loading: false,
    };
  },
  computed: {
    thumbnail() {
      return this.lecture.thumbnail;
    },
    metadata() {
      return this.thumbnail.metadata;
    },
    name() {
      return this.metadata.name;
    },
  },
  beforeUnmount() {
    this.hubCourse.lectureThumbnailUploading = false;
  },
  methods: {
    async onUpload(event) {
      try {
        const file = event.target.files[0];
        event.target.value = '';

        if (!file.type.startsWith('image/')) {
          return this.$toast.error(this.$t('auth.signup.image.error'));
        }

        this.file = file;
        this.size = 0;
        this.loading = true;
        this.metadata.name = file.name;

        this.thumbnail.url = URL.createObjectURL(file);
        this.hubCourse.lectureThumbnailUploading = true;
        const { fileId } = await upload({
          file,
          onProgress: (progress) => {
            this.size = (progress / 100) * file.size;
          },
        });

        this.thumbnail.fileId = fileId;
        this.metadata.size = file.size;
        this.metadata.mimetype = file.type;

        this.size = file.size;
        this.loading = false;
        this.focus = false;
        this.hubCourse.lectureThumbnailUploading = false;
      } catch (error) {
        this.file = null;
        this.size = 0;
        this.loading = false;
        this.focus = false;
        this.hubCourse.lectureThumbnailUploading = false;
        throw error;
      }
    },
    onRemove() {
      this.file = null;
      this.size = 0;
      this.loading = false;
      this.focus = false;
      this.metadata.name = '';
      this.hubCourse.lectureThumbnailUploading = false;
    },
  },
};
</script>

<template>
  <div class="flex h-14 items-center gap-2 pl-9 pr-4">
    <BaseCourseThumbnail
      class="!aspect-auto h-7 w-10 !bg-white/10 text-xs"
      :url="course.thumbnail?.url"
    />
    <BaseInput
      ref="title"
      v-model="title"
      class="text-sm"
      fixed
      :placeholder="$t('course.question.title')"
      @enter="onSave"
    />
    <div
      class="flex size-5 cursor-pointer items-center justify-center text-sm"
      data-cy="22351c9fd8f9a232"
      @click="onSave"
    >
      <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
      <i v-else class="fa-solid fa-check text-[#578348]" />
    </div>
    <div
      class="flex size-5 cursor-pointer items-center justify-center text-sm"
      data-cy="09dc6ca72da0f0fa"
      @click="onClose"
    >
      <i class="fa-solid fa-xmark" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
    },
    folder: {
      type: Object,
    },
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSpaces, hubSidebar };
  },
  data() {
    return {
      title: this.course?.title || '',
      loading: false,
    };
  },
  computed: {
    space() {
      return this.hubSidebar.space.data;
    },
    children() {
      return this.hubSidebar.children;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.title.$refs.input.focus();
    });
  },
  methods: {
    async onSave() {
      if (this.loading) {
        return;
      }

      if (!this.title.trim()) {
        return this.$toast.error(this.$t('course.error.title'));
      }

      if (!this.space?.id) {
        return this.$toast.error(this.$t('course.error.space'));
      }

      try {
        this.loading = true;

        await this.hubCourse.updateCourse({
          id: this.course.id,
          title: this.title,
        });

        await this.hubSpaces.getSpaces();

        await this.hubSpaces.getCourses({
          spaceId: this.space.id,
          folderId: this.folder.id,
        });

        this.loading = false;
        this.$emit('close');
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    onClose() {
      this.$emit('close');
    },
  },
};
</script>

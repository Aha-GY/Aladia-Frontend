<template>
  <div
    class="absolute bottom-0 left-0 right-0 top-0 z-10 bg-[#070707] p-4 pt-0"
  >
    <div
      class="flex justify-between"
      :class="$device.isMobile ? 'w-full flex-col' : ''"
    >
      <div :class="$device.isMobile ? '' : 'flex-1 text-nowrap'">
        <div
          class="group flex cursor-pointer items-center"
          :class="$device.isMobile ? '' : 'py-2'"
          data-cy="6553c37376b87d41"
          @click="handleBack"
        >
          <span class="flex items-center gap-2 leading-6 text-[#FAFAFA]">
            <span
              class="translation-all duration-300 group-hover:-translate-x-1"
            >
              <i class="fa-solid fa-arrow-left" />
            </span>
            <span class="text-xs">
              {{ $t('course.question.create.back') }}
            </span>
          </span>
        </div>

        <div class="text-sm text-[#D9D9D9]">
          {{ $t('course.question.create.selectLecture') }}
        </div>
      </div>
      <BaseInput
        v-model="name"
        search
        fixed
        clear
        placeholder="Search a Lecture"
        :class="$device.isMobile ? 'mt-2 !w-full' : '!w-64'"
      />
    </div>

    <div class="my-2 flex h-[68%] w-full flex-wrap overflow-y-auto">
      <div
        ref="chapters"
        class="hide-scrollbar flex h-full max-h-[76vh] w-full flex-col overflow-y-auto transition-all duration-300"
      >
        <CourseChapterItem
          v-for="(item, index) in chapters"
          :key="index"
          :chapter="item"
          :chapter-index="index"
          :height="height"
          :is-select-model="true"
          class="!w-full"
        />
      </div>
    </div>

    <div
      class="mb-1 flex cursor-pointer items-center gap-2 rounded-[0.3125rem] px-3 py-2 transition-all hover:bg-white/5"
      data-cy="4ce84c88a3f2c786"
      @click="handleRealteToCourse"
    >
      <BaseCheckboxStyle
        :state="
          socialStore.selectedLecture.realteToCourse
            ? 'correctChecked'
            : 'unchecked'
        "
        @mousedown.stop
        @mouseup.stop
      />
      <span>
        {{ $t('course.question.create.related') }}
      </span>
    </div>

    <div class="flex items-center justify-between">
      <BaseButton
        type="secondary"
        icon="trash-can"
        class="!w-[6.25rem]"
        data-cy="328f38efbb21cdc6"
        @click="handleBack"
      >
        <i class="fa-light fa-trash-can" />
        {{ $t('base.upload.cancel') }}
      </BaseButton>
      <BaseButton
        type="secondary"
        class="!w-[6.25rem]"
        data-cy="00b518f15b411df5"
        @click="handleComfirm"
      >
        <i class="fa-thin fa-floppy-disk" />
        {{ $t('base.upload.confirm') }}
      </BaseButton>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    const authStore = useAuthStore();
    const courseStore = useCourseStore();
    return { socialStore, authStore, courseStore };
  },
  data() {
    return {
      height: 538,
      name: '',
      select: null,
      timer: null,
    };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    chapters() {
      return this.course.chapters;
    },
  },
  watch: {
    async 'chapter.index'(chapterIndex) {
      this.updateHeight();
      await sleep(300);

      if (chapterIndex === 0) {
        return this.$refs.chapters.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }

      if (chapterIndex === this.chapters.length - 1) {
        const $prev = this.$refs.chapters.children[chapterIndex - 2];
        return this.$refs.chapters.scrollTo({
          top: $prev?.offsetTop || 0,
          behavior: 'smooth',
        });
      }

      const $prev = this.$refs.chapters.children[chapterIndex - 1];
      this.$refs.chapters.scrollTo({
        top: $prev?.offsetTop || 0,
        behavior: 'smooth',
      });
    },
  },
  mounted() {
    this.updateHeight();
  },
  methods: {
    onChecked(item) {
      this.select = item;
    },
    handleBack() {
      this.$emit('back');
    },
    handleComfirm() {
      this.$emit('select');
    },
    initCategories() {},
    updateHeight() {
      this.height = this.$el.clientHeight;
    },
    handleRealteToCourse() {
      this.socialStore.setSelectLecture({
        chapterIndex: null,
        lectureIndex: null,
        thumbnail: this.course.thumbnail.url,
        id: this.course.id,
        realteToCourse: true,
      });
    },
  },
};
</script>

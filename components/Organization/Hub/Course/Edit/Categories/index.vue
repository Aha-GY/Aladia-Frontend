<template>
  <OrganizationHubCourseEditWrap :step="2" title="Categories">
    <div class="mb-2 text-xs">
      {{ $t('course.category.label') }}
    </div>
    <div v-if="assigningCategories">
      <div
        v-for="n in 3"
        :key="n"
        class="mb-4 flex h-12 cursor-pointer items-center gap-2 rounded border border-white/30 px-2"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded bg-white/15 p-2"
        >
          <i class="fa-solid fa-spinner animate-spin text-lg text-white/30" />
        </div>
        <div class="flex-1 text-xs text-white">
          {{ $t('course.category.best') }}
        </div>
      </div>
    </div>
    <div v-else>
      <div
        v-for="item in subCategories"
        :key="item.id"
        class="relative mb-4 flex h-12 cursor-pointer items-center gap-2 rounded border border-white/30 bg-[#0f0f0f] p-2"
        @click="openCategory"
      >
        <BaseCategoryIcon
          class="scale-90"
          size="xl"
          show-close
          :image="item.image?.url"
          data-cy="c1d4b5675c5b234f"
          @click="onClose(item)"
        />
        <div class="flex-1">
          <div class="text-xs text-white/70">{{ item.name }}</div>
        </div>
        <div
          class="flex size-4 cursor-pointer items-center justify-center text-sm text-white/50 hover:text-white"
          @click.stop="onClose(item)"
        >
          <i class="fa-solid fa-circle-xmark" />
        </div>
      </div>
      <div
        v-for="n in rest"
        :key="n"
        class="mb-4 flex h-12 cursor-pointer items-center gap-2 rounded border border-dashed border-white/30 hover:border-solid hover:bg-white/10"
        @click="openCategory"
      >
        <div class="h-10 w-10 rounded p-2">
          <img
            src="~/assets/icons/selecte-category.svg"
            class="h-full w-full"
          />
        </div>
        <div class="flex-1 text-xs text-white/50">
          {{ $t('course.category.content') }}
        </div>
      </div>
    </div>
    <div
      class="flex h-12 cursor-pointer items-center justify-between rounded border border-dashed border-white/50 p-2"
      data-cy="61a9a94412f25bfe"
      @click="hubCourse.isPreview = !hubCourse.isPreview"
    >
      <div class="text-xs">Browse List</div>
      <div class="flex items-center gap-2 text-white/70">
        <i class="fa-light fa-sidebar" />
        <i v-if="hubCourse.isPreview" class="fa-light fa-arrow-right-long" />
        <i v-else class="fa-light fa-arrow-left-long" />
      </div>
    </div>
    <OrganizationHubCourseEditCategoriesSuggestionDialog
      v-if="hubCourse.ai.suggestSubCategoriesDialog"
    />
  </OrganizationHubCourseEditWrap>
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
    subCategories() {
      return this.hubCourse.subCategories;
    },
    pass() {
      return false;
    },
    rest() {
      return 3 - this.subCategories?.length;
    },
    assigningCategories() {
      return this.hubCourse.ai.assigning || false;
    },
  },
  watch: {
    'course.subCategories': {
      deep: true,
      immediate: true,
      async handler() {
        this.hubCourse.previewSubCategories();
      },
    },
  },
  methods: {
    onClose(category) {
      const index = this.course.subCategories.findIndex(
        (item) => item === category.id,
      );
      this.course.categories.splice(index, 1);
      this.course.subCategories.splice(index, 1);
    },
    openCategory() {
      this.hubCourse.isPreview = true;
    },
  },
};
</script>

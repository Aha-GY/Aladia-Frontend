<template>
  <div class="flex items-center gap-2 text-sm">
    <div
      class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-all hover:bg-white/10"
      data-cy="3a51154d90ba519b"
      @click="onTopClick"
    >
      {{ $t('course.header.title') }}
    </div>
    <OrganizationHubSpaceBreadcrumbChevron />
    <div v-if="typeInfo" class="flex items-center gap-2">
      <div
        class="flex items-center gap-2 rounded px-2 py-1 transition-all hover:bg-white/10"
      >
        <div class="flex size-5 items-center justify-center">
          <i class="fa-solid" :class="typeInfo.icon" />
        </div>
        <div class="max-w-24 truncate">
          {{ $t(typeInfo.name) }}
        </div>
      </div>
      <OrganizationHubSpaceBreadcrumbChevron />
    </div>
    <div v-if="category && !typeInfo" class="flex items-center gap-2">
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-all hover:bg-white/10"
        data-cy="77fa81f447e439e4"
        @click="onCategoryClick"
      >
        <BaseCourseThumbnail
          class="h-5 !rounded-sm"
          :url="category.image?.url"
        />
        <div class="max-w-24 truncate">
          {{ category.name }}
        </div>
      </div>
      <OrganizationHubSpaceBreadcrumbChevron />
    </div>
    <div v-if="subCategory && !typeInfo" class="flex items-center gap-2">
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-all hover:bg-white/10"
        data-cy="73c595e98b44365d"
        @click="onSubCategoryClick"
      >
        <BaseCourseThumbnail
          class="h-5 !rounded-sm"
          :url="subCategory.image?.url"
        />
        <div class="max-w-24 truncate">
          {{ subCategory.name }}
        </div>
      </div>
      <OrganizationHubSpaceBreadcrumbChevron />
    </div>
    <div class="flex items-center gap-2">
      <BaseCourseThumbnail
        class="h-5 !rounded-sm"
        :url="course.thumbnail?.url"
      />
      <div class="max-w-72 truncate">
        {{ course.title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  data() {
    return {
      category: null,
      subCategory: null,
      types: {
        continue: {
          name: 'course.header.continue',
          icon: 'fa-video',
        },
        top: {
          name: 'course.header.top',
          icon: 'fa-star',
        },
        popular: {
          name: 'course.header.popular',
          icon: 'fa-users',
        },
        new: {
          name: 'course.header.new',
          icon: 'fa-circle-exclamation',
        },
      },
    };
  },
  computed: {
    type() {
      return this.$route.query.type;
    },
    categoryId() {
      return this.$route.query.categoryId;
    },
    subCategoryId() {
      return this.$route.query.subCategoryId;
    },
    typeInfo() {
      return this.types[this.type];
    },
    course() {
      return this.courseStore.course;
    },
  },
  mounted() {
    if (this.categoryId && this.subCategoryId) {
      this.load();
    }
  },
  methods: {
    async load() {
      if (this.typeInfo) {
        return;
      }
      const results = await Promise.all([
        this.courseStore.getCategory({
          id: this.categoryId,
        }),
        this.courseStore.getCategory({
          id: this.subCategoryId,
        }),
      ]);
      this.category = results[0];
      this.subCategory = results[1];
    },
    onTopClick() {
      this.$router.push('/marketplace');
    },
    onCategoryClick() {
      this.$router.push({
        path: '/marketplace',
        query: {
          categoryId: this.category.id,
        },
      });
    },
    onSubCategoryClick() {
      this.$router.push({
        path: '/marketplace',
        query: {
          categoryId: this.category.id,
          subCategoryId: this.subCategory.id,
        },
      });
    },
  },
};
</script>

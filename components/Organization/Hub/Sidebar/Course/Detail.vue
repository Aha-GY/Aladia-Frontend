<template>
  <div class="mb-2 flex flex-col gap-1 bg-white/5 px-3 py-3">
    <div
      class="flex h-12 cursor-pointer items-center justify-between rounded p-2 hover:bg-white/10"
      data-cy="438af4b82cdcbaf2"
      @click="onEditCategories"
    >
      <div class="flex items-center gap-4">
        <div class="flex size-4 items-center justify-center">
          <i class="fa-solid fa-grid text-white" />
        </div>
        <div class="text-sm">
          {{ $t('category.label') }}
        </div>
      </div>
      <OrganizationHubSidebarCourseCategories />
    </div>
    <div
      class="flex h-12 cursor-pointer items-center justify-between rounded p-2 hover:bg-white/10"
      data-cy="edit-billing-option"
      @click="onEditBilling"
    >
      <div class="flex items-center gap-4">
        <div class="flex size-4 items-center justify-center">
          <i class="fa-solid fa-dollar text-white" />
        </div>
        <div class="text-sm">
          {{ $t('course.price.billing.label') }}
        </div>
      </div>
      <div
        v-if="typeof course.billing?.totalPrice === 'number'"
        class="rounded p-1 text-xs hover:bg-white/10"
      >
        $ {{ moneyFormat(course.billing.totalPrice) }}
      </div>
      <div v-else class="rounded p-1 text-xs hover:bg-white/10">
        $ ------ ,00
      </div>
    </div>
    <div
      class="flex h-12 cursor-pointer items-center justify-between rounded p-2 hover:bg-white/10"
      data-cy="edit-content-icon"
      @click="onEditContent"
    >
      <div class="flex items-center gap-4">
        <div class="flex size-4 items-center justify-center">
          <i class="fa-solid fa-book text-white" />
        </div>
        <div class="text-sm">
          {{ $t('course.content') }}
        </div>
      </div>
      <div class="flex items-center gap-3 text-xs">
        <div class="rounded p-1 text-xs hover:bg-white/10">
          {{ chapters || 0 }} {{ $t('base.courses.chapters') }}
        </div>
        <div class="rounded p-1 text-xs hover:bg-white/10">
          {{ lectures || 0 }} {{ $t('base.courses.lessons') }}
        </div>
      </div>
    </div>
    <div
      class="flex h-12 cursor-pointer items-center justify-between rounded p-2 hover:bg-white/10"
      data-cy="edit-content-icon"
      @click="onEditCertificate"
    >
      <div class="flex items-center gap-4">
        <div class="flex size-4 items-center justify-center">
          <i class="fa-solid fa-file-certificate text-white" />
        </div>
        <div class="text-sm">Certificate</div>
      </div>
      <div
        class="flex items-center gap-3 rounded p-1 text-xs hover:bg-white/10"
      >
        6 Certificates Issued
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSpaces, hubSidebar };
  },
  data() {
    return {
      open: false,
      loading: false,
    };
  },
  computed: {
    course() {
      const { data } = this.hubSidebar.course;
      return this.hubSpaces.find(data.id) || data;
    },
    builder() {
      return this.hubSidebar.builder;
    },
    numberOf() {
      return this.course.version?.numberOf || {};
    },
    chapters() {
      const { chapters } = this.hubCourse.detail;
      return chapters.length || this.numberOf.chapters;
    },
    lectures() {
      const { chapters } = this.hubCourse.detail;
      const lectures = chapters.reduce(
        (acc, chapter) => acc + chapter.lectures.length,
        0,
      );
      return (
        lectures || this.numberOf.onDemandLectures + this.numberOf.liveLectures
      );
    },
  },
  methods: {
    onEditCategories() {
      this.hubCourse.step = 2;
      this.hubSidebar.builder.state = true;
    },
    onEditBilling() {
      this.hubCourse.step = 3;
      this.hubSidebar.builder.state = true;
    },
    onEditContent() {
      this.hubCourse.step = 4;
      this.hubSidebar.builder.state = true;
    },
    onEditCertificate() {
      this.hubCourse.step = 5;
      this.hubSidebar.builder.state = true;
    },
  },
};
</script>

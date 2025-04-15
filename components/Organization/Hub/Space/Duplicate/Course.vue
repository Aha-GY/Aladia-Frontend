<template>
  <OrganizationHubSpacePopup>
    <div class="-mt-36 w-full rounded bg-black p-3 md:w-[26.25rem]">
      <div class="mb-3 flex items-center justify-between text-sm">
        <div class="flex items-center gap-3">
          <i class="fa-sharp fa-solid fa-copy" />
          {{ $t('course.duplicate.label') }}
        </div>
        <BaseIconClose
          data-cy="duplicate-course-close"
          @click="hubSpaces.duplicateCourse = false"
        />
      </div>
      <div class="mb-3 text-xs text-white/50">
        {{ $t('course.duplicate.content') }}
        <span class="font-bold">'{{ course.title }}'</span>
        {{ $t('course.duplicate.dialog') }}
      </div>
      <div class="mb-5 flex items-center gap-2 px-2 text-sm">
        <BaseCourseThumbnail class="h-6" :url="course.thumbnail?.url" />
        <div class="w-0 flex-1 text-xs">
          {{ course.title }}
        </div>
        <BaseCourseStatus :status="course.version?.status" />
      </div>

      <div
        v-if="course.type === 'live'"
        class="mb-5 flex flex-col gap-2 px-5 text-sm"
      >
        <OrganizationHubCourseEditInfoCyclesItem
          v-for="(item, index) in cycles"
          :key="index"
          :index="index"
          :item="item"
          :more="false"
          :diff="diff"
          :length="1"
          :course="course"
          :standalone="true"
          @dates-change="onDatesChange"
        />
      </div>

      <div class="flex justify-end gap-2">
        <BaseButton
          type="secondary"
          data-cy="duplicate-course-cancel"
          @click="hubSpaces.duplicateCourse = false"
        >
          {{ $t('base.upload.cancel') }}
        </BaseButton>
        <BaseButton
          type="primary"
          data-cy="duplicate-course-button"
          @click="onDuplicate"
        >
          <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
          {{ $t('base.upload.apply') }}
        </BaseButton>
      </div>
    </div>
  </OrganizationHubSpacePopup>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  setup() {
    const open = ref(false);
    const coursePopup = ref(null);
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();

    onClickOutside(coursePopup, () => {
      open.value = false;
    });

    return { hubSpaces, hubSidebar, open, coursePopup };
  },
  data() {
    return {
      loading: false,
      startDate: '',
    };
  },
  computed: {
    course() {
      return this.hubSpaces.duplicateCourse;
    },
    diff() {
      const startTime = this.cycles[0].dates.startDate;
      const endTime = this.cycles[0].dates.endDate;
      return dayjs(new Date(endTime)).diff(dayjs(new Date(startTime)));
    },
    cycles() {
      return this.course.cycles?.slice(0, 1) || [];
    },
  },
  methods: {
    onDatesChange(dates) {
      this.startDate = dates.startDate;
    },
    async onDuplicate() {
      if (this.loading) {
        return;
      }

      if (this.course.type === 'live' && !this.startDate) {
        console.error('startDate is required', this.startDate);
        return;
      }

      try {
        this.loading = true;
        const course = await this.hubSpaces.duplicateCourseInSpace({
          courseId: this.course.id,
          startDate: this.course.type === 'live' ? this.startDate : undefined,
        });

        this.hubSpaces.addVirtualCourse(course);
        this.hubSidebar.course.state = false;

        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }

      this.hubSpaces.duplicateCourse = false;
    },
  },
};
</script>

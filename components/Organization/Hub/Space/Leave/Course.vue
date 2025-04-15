<template>
  <OrganizationHubSpacePopup>
    <div class="-mt-36 w-full rounded bg-black p-3 md:w-[40rem]">
      <div class="mb-3 flex items-center justify-between text-sm">
        <div class="flex items-center gap-3">
          <i class="fa-sharp fa-solid fa-trash" />
          {{ $t('course.leave.label') }}
        </div>
        <BaseIconClose
          data-cy="69ecaeedc5598584"
          @click="hubSpaces.leaveCourse = false"
        />
      </div>
      <div class="mb-3 text-xs text-white/50">
        {{
          $t('course.leave.dialog', {
            orgName: space?.name,
            orgNameSuffix: orgNameSuffix,
          })
        }}
        {{ $t('course.leave.description') }}
      </div>
      <div class="mb-5 flex items-center gap-2 px-2 text-sm">
        <BaseCourseThumbnail class="h-6" :url="course.thumbnail?.url" />
        <div class="w-0 flex-1 text-xs">
          {{ course.title }}
        </div>
        <BaseCourseStatus :status="course.version?.status" />
      </div>
      <div class="flex justify-end">
        <BaseButton type="error" data-cy="57cb409c005c1985" @click="onLeave">
          <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
          <span v-if="isOrg">{{ $t('org.leave') }}</span>
          <span v-if="isUser">{{ $t('course.leave.label') }}</span>
        </BaseButton>
      </div>
    </div>
  </OrganizationHubSpacePopup>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const hubCourse = useHubCoursesStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSpaces, hubSidebar, authStore };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    course() {
      return this.hubSpaces.leaveCourse;
    },
    spaceId() {
      return this.$route.query.space;
    },
    space() {
      return this.hubSpaces.find(this.spaceId);
    },
    isUser() {
      return this.authStore.isUser;
    },
    isOrg() {
      return this.authStore.isOrg;
    },
    orgNameSuffix() {
      let orgNameSuffix;
      if (this.isUser) {
        orgNameSuffix = '';
      }
      if (this.isOrg) {
        orgNameSuffix = ' organization';
      }
      return orgNameSuffix;
    },
  },
  methods: {
    async onLeave() {
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;
        await this.hubSpaces.setLeaveCourse({
          courseId: this.course.id,
        });

        await this.hubSpaces.getCourses({
          spaceId: this.course._spaceId,
          folderId: this.course._folderId,
        });

        this.hubSpaces.getSpaces();
        this.hubSidebar.course.state = false;

        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }

      this.hubSpaces.leaveCourse = false;
    },
  },
};
</script>

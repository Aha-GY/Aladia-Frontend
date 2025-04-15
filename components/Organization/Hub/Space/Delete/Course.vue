<template>
  <OrganizationHubSpacePopup>
    <div class="-mt-36 w-full rounded bg-black p-3 md:w-[40rem]">
      <div class="mb-3 flex items-center justify-between text-sm">
        <div class="flex items-center gap-3">
          <i class="fa-sharp fa-solid fa-trash" />
          {{ $t('course.delete.label') }}
        </div>
        <BaseIconClose
          data-cy="1507ec1739197cf3"
          @click="hubSpaces.deleteCourse = false"
        />
      </div>
      <div class="mb-3 text-xs text-white/50">
        {{
          $t('course.delete.dialog', { orgName: space?.name, orgNameSuffix })
        }}
        {{ $t('course.delete.description') }}
      </div>
      <div class="mb-5 flex items-center gap-2 px-2 text-sm">
        <BaseCourseThumbnail class="h-6" :url="course.thumbnail?.url" />
        <div class="w-0 flex-1 text-xs">
          {{ course.title }}
        </div>
        <BaseCourseStatus :status="course.version?.status" />
      </div>
      <div class="flex justify-end">
        <BaseButton
          type="error"
          data-cy="delete-from-organization-button"
          @click="onDelete"
        >
          <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
          <span v-if="isOrg">{{ $t('org.delete') }}</span>
          <span v-if="isUser">{{ $t('course.delete.label') }}</span>
        </BaseButton>
      </div>
    </div>
  </OrganizationHubSpacePopup>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    const authStore = useAuthStore();
    return { hubSpaces, hubSidebar, authStore };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    course() {
      return this.hubSpaces.deleteCourse;
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
    async onDelete() {
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;
        await this.hubSpaces.deleteCourseFromSpace({
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

      this.hubSpaces.deleteCourse = false;
    },
  },
};
</script>

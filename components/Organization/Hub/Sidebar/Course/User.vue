<template>
  <OrganizationHubSidebarWrap :open="open">
    <OrganizationHubSidebarHeader
      type="course"
      data-cy="user-course"
      @close="onClose"
    />
    <OrganizationHubSidebarVersionHeader v-if="hubCourse.versionViewing" />
    <div
      class="hide-scrollbar flex h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
    >
      <div
        class="mb-2 flex cursor-pointer items-center gap-3 bg-white/5 p-4 text-white/50 hover:bg-white/10 hover:text-white"
        data-cy="edit-course-detail"
        @click="onEditInfo"
      >
        <div
          class="relative flex aspect-video h-10 items-center justify-center overflow-hidden rounded"
          :class="{
            'border border-dashed border-white/50': !course.thumbnail?.url,
          }"
        >
          <img
            v-if="course.thumbnail?.url"
            :src="course.thumbnail.url"
            class="h-full w-full object-cover"
          />
          <i v-else class="fa-light fa-cloud-upload scale-125 text-xl" />
        </div>
        <div v-if="course.id" class="w-0 flex-1">
          <div class="mb-0.5 truncate text-sm text-white" :title="course.title">
            {{ course.title }}
          </div>
          <div class="flex items-center gap-2 text-xs text-white/50">
            {{ $t('course.created.date', { date: timeAgo(course.createdAt) }) }}
            <div class="size-1 rounded-full bg-white/50" />
            <BaseCourseStatus
              :status="course?.version?.status"
              class="!gap-1"
            />
          </div>
        </div>
        <div v-else class="flex-1">
          <div class="mb-0.5 text-sm text-white">
            {{ $t('course.created.title') }}
          </div>
          <div class="flex items-center gap-2 text-xs text-white/50">
            {{ $t('course.created.now') }}
            <div class="size-1 rounded-full bg-white/80" />
            <div class="flex items-center gap-2 text-[#86EFAC]">
              <i class="fa-light fa-check" />
              {{ $t('course.created.published') }}
            </div>
          </div>
        </div>
        <div class="h-11">
          <el-popover
            ref="more"
            :width="160"
            trigger="click"
            placement="bottom-end"
          >
            <template #reference>
              <div
                class="flex size-6 cursor-pointer items-center justify-center rounded text-xs hover:bg-white/10"
                data-cy="d64a456b9203a8ef"
                @click.stop
              >
                <i class="fa-solid fa-ellipsis" />
              </div>
            </template>
            <div class="flex flex-col gap-1 p-1 text-13 text-white">
              <div
                class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
                data-cy="840ece5fbb46de3f"
                @click="onEditInfo"
              >
                <div class="flex size-4 items-center justify-center">
                  <i class="fa-solid fa-book-reader" />
                </div>
                {{ $t('course.info') }}
              </div>
              <div
                class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
                data-cy="9991c8a77b17f01a"
                @click="onDelete"
              >
                <div class="flex size-4 items-center justify-center">
                  <i class="fa-solid fa-folder-xmark" />
                </div>
                {{ $t('course.delete.label') }}
              </div>
            </div>
          </el-popover>
        </div>
      </div>
      <div
        class="mb-2 flex cursor-pointer items-center justify-between bg-white/5 px-5 py-4 hover:bg-white/10"
        data-cy="course-version-label"
        @click="onEditVersion"
      >
        <div class="flex items-center gap-4">
          <div class="flex size-4 items-center justify-center">
            <i class="fa-solid fa-clock-rotate-left text-white" />
          </div>
          <div class="text-sm">
            {{ $t('course.version.label') }}
          </div>
        </div>
        <div class="text-xs">{{ course.version?.title }}</div>
      </div>
      <OrganizationHubSidebarCourseDetail />
      <OrganizationHubSidebarMember v-if="course.id" type="course" />
    </div>
    <OrganizationHubSidebarCourseFooter />
  </OrganizationHubSidebarWrap>
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
    inCalendar() {
      return this.$route.name.endsWith('name-calendar');
    },
    version() {
      return this.hubCourse.version;
    },
    course() {
      return this.hubSidebar.course.data;
    },
    builder() {
      return this.hubSidebar.builder;
    },
  },
  watch: {
    'course.id'() {
      this.init();
    },
  },
  mounted() {
    // 假如是新建课程，不需要初始化
    if (this.hubSidebar.course.created) {
      this.hubSidebar.course.created = false;
    } else {
      this.init();
    }
    setTimeout(() => {
      this.open = true;
    }, 100);
  },
  methods: {
    async init() {
      if (this.course.id) {
        this.loading = true;
        const course = await this.hubCourse.getCourse({
          courseId: this.course.id,
        });
        this.hubSidebar.course.data = cloneDeep(course);
        this.loading = false;
      }
    },
    async onClose() {
      this.open = false;
      await sleep(500);
      this.hubSidebar.course.state = false;
      if (this.inCalendar) {
        this.hubSidebar.state = false;
      }
    },
    onEditInfo() {
      this.$refs.more.hide();
      this.hubCourse.step = 1;
      this.hubSidebar.builder.state = true;
    },
    onEditVersion() {
      this.hubSidebar.version.state = true;
    },
    onDelete() {
      this.$refs.more.hide();
      this.hubSpaces.deleteCourse = this.hubSpaces.find(this.course.id);
    },
  },
};
</script>

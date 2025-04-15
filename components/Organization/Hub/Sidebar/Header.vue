<template>
  <div
    class="mb-2 flex h-12 shrink-0 items-center justify-between gap-1 rounded-md bg-white/5 px-4 text-sm text-[#FAFAFA]"
    :data-cy="`org-hub-header-sidebar-${dataCy}`"
  >
    <BaseIconBack class="shrink-0" data-cy="back-icon" @click="onBackClick" />
    <div class="flex w-0 flex-1 items-center gap-1 overflow-hidden">
      <!-- Space Breadcrumb -->
      <div
        v-if="space?.name"
        class="container flex cursor-pointer items-center rounded-md bg-[#FFFFFF0D] px-1 py-1 hover:bg-white/10"
        :class="{
          'max-w-32': isCourse && isRootFolder,
          'max-w-24': isCourse && !isRootFolder,
        }"
        data-cy="35f5a888981d40d4"
      >
        <div
          class="flex items-center gap-1"
          @click="onClose('overview')"
          @mouseenter="spaceHover = true"
          @mouseleave="spaceHover = false"
        >
          <BaseSpaceLogo class="!size-5" :space="space" :expand="spaceHover" />
          <div
            class="truncate"
            :class="{
              'max-w-20': isCourse && isRootFolder,
              'max-w-[2.375rem]': isCourse && !isRootFolder,
            }"
            :title="space.name"
          >
            {{ space.name }}
          </div>
        </div>

        <el-popover
          v-if="space?.id"
          :width="200"
          trigger="hover"
          placement="bottom"
          :popper-style="{ zIndex: 80 }"
          @before-enter="spaceOpen = true"
          @before-leave="spaceOpen = false"
        >
          <template #reference>
            <OrganizationHubSpaceBreadcrumbChevron :open="spaceOpen" />
          </template>
          <div class="flex flex-col gap-1 p-1.5">
            <div
              v-for="space in spaces"
              :key="space.id"
              class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
              data-cy="a55b11a24ab01bb0"
              @click="onSpaceOpen(space)"
            >
              <BaseSpaceLogo class="!size-5" :space="space" />
              <div class="max-w-36 truncate" :title="space.name">
                {{ space.name }}
              </div>
            </div>
          </div>
        </el-popover>
      </div>
      <div v-if="isCourse" class="flex items-center gap-1">
        <i
          v-if="!isRootFolder && folder?.name"
          class="fa-regular fa-pipe px-[0.125rem] text-xs"
        />
        <!-- Folder Breadcrumb -->
        <div
          v-if="!isRootFolder && folder?.name"
          class="flex cursor-pointer items-center rounded-md bg-[#FFFFFF0D] px-1 py-1 hover:bg-white/10"
          data-cy="0113bf7f9c21d4ef"
        >
          <div
            class="flex items-center gap-1"
            @click="onClose('course')"
            @mouseenter="folderHover = true"
            @mouseleave="folderHover = false"
          >
            <BaseIconFolder class="size-4" :open="folderHover" />
            <div class="max-w-[2.375rem] truncate" :title="folder.name">
              {{ folder.name }}
            </div>
          </div>
          <el-popover
            v-if="space"
            :width="240"
            trigger="hover"
            placement="bottom"
            :popper-style="{ zIndex: 80 }"
            @before-enter="folderOpen = true"
            @before-leave="folderOpen = false"
          >
            <template #reference>
              <OrganizationHubSpaceBreadcrumbChevron :open="folderOpen" />
            </template>
            <div class="flex flex-col gap-1 p-1.5">
              <div
                v-for="folder in space.folders"
                :key="folder.id"
                data-type="folder"
                :data-id="folder.id"
                class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
                :data-cy="`space-folder-list-${folder.id}`"
                @click="onFolderOpen()"
              >
                <div class="flex w-8 items-center justify-center">
                  <BaseIconFolder class="w-5" />
                </div>
                <div class="max-w-36 truncate" :title="folder.name">
                  {{ folder.name }}
                </div>
              </div>
              <div
                v-for="course in space.courses"
                :key="course.id"
                class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
                data-cy="451af04f1dd5b9f6"
                @click="onCourseClick(course)"
              >
                <BaseCourseThumbnail
                  class="w-8 !rounded-sm text-xs"
                  :url="course.thumbnail?.url"
                />
                <div class="max-w-36 truncate" :title="course.name">
                  {{ course.title }}
                </div>
              </div>
            </div>
          </el-popover>
        </div>

        <i
          v-if="courseId && course?.id"
          class="fa-regular fa-pipe px-[0.125rem] text-xs"
        />
        <!-- Course Breadcrumb -->
        <div
          class="flex cursor-pointer items-center rounded-md bg-[#FFFFFF0D] px-1 py-1 hover:bg-white/10"
          data-cy="2eedc4334d045009"
        >
          <div class="flex items-center gap-1" @click="onClose('course')">
            <BaseCourseThumbnail
              class="h-5 rounded-sm"
              :url="course.thumbnail?.url"
            />
            <div
              class="truncate"
              :class="{
                'max-w-[2.375rem]': !isRootFolder,
                'max-w-20': isRootFolder,
                '!max-w-72': hubCourse.inReview,
              }"
              :title="course.title"
            >
              {{ course.title }}
            </div>
          </div>
          <el-popover
            v-if="folder"
            :width="240"
            trigger="hover"
            placement="bottom-start"
            :popper-style="{ zIndex: 80 }"
            @before-enter="courseOpen = true"
            @before-leave="courseOpen = false"
          >
            <template #reference>
              <OrganizationHubSpaceBreadcrumbChevron :open="courseOpen" />
            </template>
            <div class="flex flex-col gap-1 p-1.5">
              <div
                v-for="course in folder.courses"
                :key="course.id"
                class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
                data-cy="451af04f1dd5b9f6"
                @click="onCourseClick(course)"
              >
                <BaseCourseThumbnail
                  class="w-8 !rounded-sm text-xs"
                  :url="course.thumbnail?.url"
                />
                <div class="max-w-36 truncate" :title="course.name">
                  {{ course.title }}
                </div>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <div
      v-if="canPreview"
      class="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded bg-[#dabb4b] text-sm text-black"
      data-cy="a74552cc0e3cb5cc"
      @click="hubCourse.isPreview = !hubCourse.isPreview"
    >
      <i v-if="hubCourse.isPreview" class="fa-solid fa-sidebar" />
      <i v-else class="fa-solid fa-sidebar-flip" />
    </div>
    <BaseIconClose
      v-else
      class="shrink-0"
      data-cy="close-icon"
      @click="onClose('')"
    />
    <el-dialog
      v-model="savePopup"
      :show-close="false"
      align-center
      append-to-body
      destroy-on-close
      width="24rem"
    >
      <div class="flex flex-col">
        <div
          class="flex items-center justify-between rounded-t-sm bg-white/5 p-3"
        >
          <div class="flex items-center gap-2 text-sm">
            <i class="fa-regular fa-floppy-disk" />
            {{ $t('course.changeConfirmation.title') }}
          </div>
          <BaseIconClose @click="savePopup = false" />
        </div>
        <div
          class="flex flex-col gap-5 px-5 py-7 text-sm font-light text-white/70"
        >
          <div>{{ $t('course.changeConfirmation.contentOne') }}</div>
          <div>{{ $t('course.changeConfirmation.contentTwo') }}</div>
        </div>
        <div class="flex items-center justify-end gap-4 p-3">
          <BaseButton
            type="tertiary"
            :label="$t('course.changeConfirmation.quit')"
            icon="fa-regular fa-arrow-left-from-bracket"
            @click="onCancel"
          />
          <BaseButton @click="onSave">
            <div class="flex size-3 items-center justify-center">
              <i
                v-if="saving"
                class="fa-light fa-loader animate-spin text-base"
              />
              <i v-else class="fa-solid fa-save text-sm" />
            </div>
            {{ $t('course.changeConfirmation.save') }}
          </BaseButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    dataCy: {
      type: String,
      default: '',
    },
  },
  setup() {
    const authStore = useAuthStore();
    const hubCourse = useHubCoursesStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { authStore, hubCourse, hubSpaces, hubSidebar };
  },
  data() {
    return {
      savePopup: false,
      lastTarget: 'overview',
      spaceOpen: false,
      spaceHover: false,
      folderOpen: false,
      folderHover: false,
      courseOpen: false,
    };
  },
  computed: {
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
    spaceId() {
      return this.$route.query.space;
    },
    folderId() {
      return this.$route.query.folder;
    },
    courseId() {
      return this.$route.params.name;
    },
    course() {
      return this.hubSidebar.course.data;
    },
    folder() {
      return this.hubSidebar.course.folder;
    },
    isRootFolder() {
      return this.folder?._root;
    },
    isCourse() {
      return this.type === 'builder' || this.type === 'course';
    },
    editable() {
      return this.hubSpaces.checkCourseEditable(this.course);
    },
    canPreview() {
      if (this.hubCourse.inReview) {
        return true;
      }
      return this.type === 'builder' && this.editable;
    },
    saving() {
      return this.hubCourse.saving;
    },
    spaces() {
      return this.hubSpaces.spaces;
    },
    path() {
      return `${this.authStore.hub}/spaces`;
    },
  },
  methods: {
    async onSave() {
      await this.hubCourse.saveCourse();
      this.onCancel();
    },
    async onCancel() {
      this.savePopup = false;
      await sleep(300);
      const target = this.lastTarget;
      if (target) {
        this.$emit('close', target);
      } else {
        this.hubSidebar.$reset();
      }
    },
    onClose(target) {
      this.lastTarget = target;

      // 判断课程是否有变化
      const currentCourseJson = this.hubCourse.getCourseJson();
      const lastCourseJson = this.hubCourse.lastCourseJson;
      const hasCourseChanged = lastCourseJson !== currentCourseJson;

      // 退出Builder前,且非验证模式下，提示保存
      if (
        this.type === 'builder' &&
        hasCourseChanged &&
        this.hubCourse.detail.status !== 'verifying'
      ) {
        this.savePopup = true;
      } else {
        if (target) {
          this.$emit('close', target);
        } else {
          this.hubSidebar.$reset();
        }
      }
    },
    onSpaceOpen(space) {
      this.hubSidebar.space.data = space;
      this.hubSidebar.state = true;
      this.onClose('overview');
    },
    onFolderOpen() {
      this.hubSidebar.space.data = this.space;
      this.hubSidebar.state = true;
      this.hubSidebar.children.state = true;
      this.onClose('course');
    },
    onCourseClick(course) {
      if (course.id !== this.course.id) {
        this.hubSidebar.edieCourse({
          course,
        });
      }
    },
    onBackClick() {
      let target = '';
      if (this.courseId && this.course?.id) {
        target = 'course';
      } else if (this.folderId && this.folder?.id) {
        target = 'overview';
      }
      this.onClose(target);
    },
  },
};
</script>

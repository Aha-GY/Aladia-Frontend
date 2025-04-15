<template>
  <div class="mb-6 flex items-center text-xs text-[#FAFAFA] md:text-sm">
    <div
      class="cursor-pointer rounded py-0.5 text-xl transition-all hover:bg-white/10"
      data-cy="f4f7d7967291b411"
      @click="onTopClick"
    >
      {{ $t('org.tab.spaces') }}
    </div>
    <!-- Space -->
    <div v-if="spaceId && space?.id" class="flex items-center">
      <i class="fa-regular fa-pipe px-2 text-xs" />
      <div
        data-type="space"
        :data-id="space.id"
        :data-folder-id="space.rootFolder.id"
        class="flex cursor-pointer items-center rounded-md bg-[#FFFFFF0D] px-2 py-0.5 transition-all hover:bg-white/10"
        data-cy="5bfbc4110c8f7ddc"
      >
        <div
          class="flex items-center gap-2"
          @click="onSpaceClick(spaceId)"
          @mouseenter="spaceHover = true"
          @mouseleave="spaceHover = false"
        >
          <BaseSpaceLogo class="!size-4" :space="space" :expand="spaceHover" />
          <div class="max-w-36 truncate" :title="space.name">
            {{ space.name }}
          </div>
        </div>
        <el-popover
          v-if="space?.id"
          :width="200"
          trigger="hover"
          placement="bottom-start"
          :popper-style="{ zIndex: 70 }"
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
              @click="onSpaceClick(space.id)"
            >
              <BaseSpaceLogo class="!size-5" :space="space" />
              <div class="max-w-36 truncate" :title="space.name">
                {{ space.name }}
              </div>
            </div>
          </div>
        </el-popover>
        <OrganizationHubSpaceBreadcrumbPipe />
        <OrganizationHubSpaceBreadcrumbSidebarFlip
          v-if="view === 'grid'"
          data-cy="3758786c28b20e24"
          @click="onSpaceOpen"
        />
      </div>
      <OrganizationHubSpaceBreadcrumbClose
        v-if="view === 'list'"
        data-cy="6d92bc6f26821e68"
        @click="onSpaceClose"
      />
    </div>
    <!-- Folder -->
    <div v-if="folderId && folder?.id" class="flex items-center">
      <i class="fa-regular fa-pipe px-2 text-xs" />
      <div
        class="flex cursor-pointer items-center rounded-md bg-[#FFFFFF0D] px-2 py-0.5 transition-all hover:bg-white/10"
        data-cy="aadc8fac75e52558"
      >
        <div
          class="flex items-center gap-2"
          @click="onFolderClick(folderId)"
          @mouseenter="folderHover = true"
          @mouseleave="folderHover = false"
        >
          <BaseIconFolder :open="folderHover" class="size-5" />
          <div class="max-w-36 truncate" :title="folder.name">
            {{ folder.name }}
          </div>
        </div>
        <el-popover
          v-if="folderId && space"
          :width="240"
          trigger="hover"
          placement="bottom-start"
          :popper-style="{ zIndex: 70 }"
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
              @click="onFolderClick(folder.id)"
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
        <OrganizationHubSpaceBreadcrumbPipe />
        <OrganizationHubSpaceBreadcrumbSidebarFlip
          data-cy="8795cc83ac0bce94"
          @click="onFolderOpen"
        />
      </div>
    </div>
    <!-- Course -->
    <div v-if="courseId && course?.id" class="flex items-center">
      <i class="fa-regular fa-pipe px-2 text-xs" />
      <div
        class="flex items-center rounded-md bg-[#FFFFFF0D] px-2 py-0.5 hover:bg-white/10"
      >
        <div class="flex items-center gap-2">
          <BaseCourseThumbnail
            class="w-8 !rounded-sm"
            :url="course.thumbnail?.url"
          />
          <div class="max-w-36 truncate" :title="course.title">
            {{ course.title }}
          </div>
        </div>
        <el-popover
          v-if="courseId && folder"
          :width="240"
          trigger="hover"
          placement="bottom-start"
          :popper-style="{ zIndex: 70 }"
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
              @click="onCourseOpen(course)"
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
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const courseStore = useCourseStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { authStore, hubSpaces, hubSidebar, courseStore };
  },
  data() {
    return {
      spaceOpen: false,
      spaceHover: false,
      folderOpen: false,
      folderHover: false,
      courseOpen: false,
    };
  },
  computed: {
    view() {
      return this.$route.query.view || 'grid';
    },
    spaceId() {
      return this.$route.query.space;
    },
    folderId() {
      return this.$route.query.folder;
    },
    isFolder() {
      return !!this.folderId;
    },
    courseId() {
      return this.$route.params.name;
    },
    space() {
      return this.hubSpaces.find(this.spaceId);
    },
    folder() {
      if (this.folderId === this.space?.rootFolder?.id) {
        return null;
      }
      return this.hubSpaces.find(this.folderId);
    },
    course() {
      return this.courseStore.course;
    },
    spaces() {
      return this.hubSpaces.spaces;
    },
    path() {
      return `${this.authStore.hub}/spaces`;
    },
    inSpaces() {
      return this.$route.name.endsWith('name-spaces');
    },
    isShopping() {
      return this.space?.mode === 'shopping';
    },
    editable() {
      if (this.isShopping) {
        return false;
      }
      return this.hubSpaces.checkCourseEditable(this.course);
    },
  },
  mounted() {
    if (!this.inSpaces) {
      this.load();
    }
  },
  methods: {
    async load() {
      if (!this.authStore.logged) {
        return;
      }

      const spaces = await this.hubSpaces.getSpaces();

      if (!spaces.find((space) => space.id === this.spaceId)) {
        return;
      }

      await this.loadFolders();
      await this.loadCourses();
    },
    async loadFolders() {
      await this.hubSpaces.getFolders({
        spaceId: this.spaceId,
      });
    },
    async loadCourses() {
      const folderId = this.isFolder
        ? this.folderId
        : this.space?.rootFolder?.id;

      if (folderId) {
        await this.hubSpaces.getCourses({
          spaceId: this.spaceId,
          folderId,
        });
      }
    },
    onTopClick() {
      this.$router.push({
        path: this.path,
        query: {
          view: 'grid',
        },
      });
    },
    onSpaceClick(spaceId) {
      this.$router.push({
        path: this.path,
        query: {
          view: 'grid',
          space: spaceId,
        },
      });
    },
    onFolderClick(folderId) {
      this.$router.push({
        path: this.path,
        query: {
          view: 'grid',
          space: this.spaceId,
          folder: folderId,
        },
      });
    },
    redirect() {
      if (!this.inSpaces) {
        this.$router.push({
          path: this.path,
          query: {
            view: 'grid',
            space: this.spaceId,
            folder: this.folderId,
          },
        });
      }
    },
    onCourseClick(course) {
      this.redirect();
      this.hubSidebar.edieCourse({
        course,
      });
    },
    onSpaceOpen() {
      this.redirect();
      this.hubSidebar.space.data = this.space;
      this.hubSidebar.state = true;
    },
    onFolderOpen() {
      this.redirect();
      this.hubSidebar.space.data = this.space;
      this.hubSidebar.state = true;
      this.hubSidebar.children.state = true;
    },
    onSpaceClose() {
      this.hubSpaces.spacesExpand = [];
      this.$router.push({
        path: this.path,
        query: {
          view: 'list',
        },
      });
    },
    onCourseOpen(course) {
      this.$router.push({
        path: `/courses/${course.id}`,
        query: {
          space: this.spaceId,
          folder: this.folderId,
          from: 'space',
          version: this.editable ? 'latest' : undefined,
        },
      });
    },
  },
};
</script>

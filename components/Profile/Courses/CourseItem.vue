<template>
  <div class="w-full shrink-0 p-4 md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
    <div
      ref="course"
      data-type="course"
      :data-id="course.id"
      :data-draging="isDraging ? 'true' : 'false'"
      class="group/course relative touch-none select-none overflow-hidden rounded transition-all"
      :class="checked ? 'bg-[#060606]' : 'bg-[#1c1c1c] hover:bg-black'"
      :style="{
        opacity: isDraging ? '0.5' : '1',
        transform: isDraging ? 'scale(0.95)' : 'scale(1)',
        pointerEvents: isDraging ? 'none' : '',
      }"
      @pointerenter="hover = true"
      @pointerleave="hover = false"
      @pointerdown="onMouseDown"
      @pointerup="onMouseUp"
    >
      <div
        class="course-handle relative h-40 cursor-grab select-none overflow-hidden rounded-t active:cursor-grabbing"
      >
        <BaseCourseThumbnail
          class="h-48 w-full !rounded-b-none !rounded-t bg-black/50 object-cover text-4xl transition-all duration-300"
          :class="{
            'translate-y-0': checked,
            '-translate-y-8 group-hover/course:translate-y-0': !checked,
          }"
          :url="course?.thumbnail?.url"
        />
        <div
          class="absolute inset-0 flex flex-col items-start justify-between rounded-t p-2"
        >
          <div class="flex w-full items-center justify-between">
            <OrganizationHubSpaceGridCourseState :course="course" />
          </div>
        </div>
        <OrganizationHubSpaceGridCourseCycle
          :is-shopping="isShopping"
          :editable="editable"
          :course="course"
          :space="space"
        />
        <div
          class="absolute bottom-2 right-2 flex items-center gap-1.5 rounded bg-black/80 px-2 py-1.5 text-xs text-white/80 shadow-md backdrop-blur"
        >
          <i class="fa-regular fa-cart-shopping text-xs" />
          {{ moneyFormat(billing.totalPrice || 0) }} $
        </div>
      </div>
      <div class="flex items-center gap-2 px-2 py-1.5">
        <BaseAvatarProgress
          :member="course.owner"
          :completion="course.completion"
        />
        <div class="flex-1">
          <div
            class="flex max-w-36 items-center gap-1 truncate text-sm text-white/50"
          >
            {{ course.owner?.name }}
          </div>
          <div class="line-clamp-2 max-w-48 text-13" :title="course.title">
            {{ course.title }}
          </div>
        </div>
        <OrganizationHubSpaceGridCourseOption
          v-if="isPublisher"
          :course="course"
          :space="space"
          :folder="folder"
        />
      </div>
      <div
        class="pointer-events-none absolute inset-0 rounded transition-all"
        :class="checked ? 'border-2' : 'border-b-2'"
        :style="{
          borderColor: checked || hover ? course.color : 'transparent',
        }"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const profileStore = useProfileStore();
    const authStore = useAuthStore();
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { authStore, hubCourse, hubSpaces, hubSidebar, profileStore };
  },
  data() {
    return {
      lastUrl: '',
      mouseDownStart: 0,
      isMouseUp: false,
      hover: false,
    };
  },
  computed: {
    isPublisher() {
      return this.profileStore.myProfileDetail.id === this.course.owner.id;
    },

    owner() {
      return this.course.owner;
    },
    spaceId() {
      return this.$route.query.space;
    },
    folderId() {
      return this.$route.query.folder;
    },
    checked() {
      return this.course._state === 'checked';
    },
    isDraging() {
      return this.checked && this.hubSpaces.isDraging;
    },
    billing() {
      return this.course.billing || {};
    },
    space() {
      return this.hubSpaces.find(this.spaceId);
    },
    folder() {
      return this.hubSpaces.find(this.folderId);
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
  methods: {
    onOpen() {
      this.$router.push({
        path: `/courses/${this.course.id}`,
        query: {
          space: this.spaceId,
          folder: this.folderId,
          from: 'space',
          version: this.editable ? 'latest' : undefined,
        },
      });
    },
    onEdit() {
      this.hubSidebar.edieCourse({
        course: this.course,
      });
    },
    onChecked() {
      if (this.checked) {
        this.course._state = 'unchecked';
      } else {
        this.course._state = 'checked';
      }
    },
    async onMouseDown(event) {
      if (event.button !== 0) {
        return;
      }
      this.lastUrl = location.href;
      this.mouseDownStart = Date.now();
      this.isMouseUp = false;

      await sleep(300);
      if (location.href !== this.lastUrl) {
        return;
      }
      if (this.isMouseUp) {
        return;
      }

      this.hubSpaces.isDraging = true;
      this.hubSpaces.dragLeft = `${event.x}px`;
      this.hubSpaces.dragTop = `${event.y}px`;
      if (this.hubSpaces.checkeds.length === 0) {
        this.hubSpaces.isTmpCheck = true;
        this.hubSpaces.uncheck();
      }
      this.course._state = 'checked';
    },
    onMouseUp() {
      this.isMouseUp = true;
      if (Date.now() - this.mouseDownStart < 300) {
        if (this.editable) {
          this.onEdit();
        } else {
          this.onOpen();
        }
      }
    },
  },
};
</script>

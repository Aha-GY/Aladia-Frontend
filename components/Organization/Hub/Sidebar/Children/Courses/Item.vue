<template>
  <div>
    <OrganizationHubSidebarChildrenCoursesEdit
      v-if="isEdit"
      :course="course"
      :folder="folder"
      @close="isEdit = false"
    />
    <div
      v-else
      data-type="course"
      :data-id="course.id"
      :data-draging="isDraging ? 'true' : 'false'"
      :data-cy="`course-card-${course.id}`"
      class="group/course flex h-14 touch-none select-none items-center justify-between gap-2 rounded p-2 pr-4 hover:bg-[#141414]"
      :class="level === 1 ? '-ml-2 -mr-4' : ''"
      :style="{
        opacity: isDraging ? '0.5' : '1',
        transform: isDraging ? 'scale(0.95)' : 'scale(1)',
        pointerEvents: isDraging ? 'none' : '',
      }"
      @pointerenter="hover = true"
      @pointerleave="hover = false"
    >
      <div
        class="flex size-5 cursor-grab items-center justify-center rounded-sm hover:bg-white/5 active:cursor-grabbing"
        :class="
          checked || $device.isMobile
            ? ''
            : 'opacity-0 group-hover/course:opacity-100'
        "
        @pointerdown="onMouseDown"
        @pointerup="onMouseUp"
      >
        <i class="fa-solid fa-grip-dots-vertical text-10" />
      </div>
      <div class="relative">
        <BaseCourseThumbnail
          class="!aspect-auto h-7 w-10 !bg-white/10 text-xs"
          :url="course.thumbnail?.url"
        >
          <div
            class="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/75 text-xs font-semibold text-[#9D50ED]"
          >
            {{ course.completion }}%
          </div>
        </BaseCourseThumbnail>
        <OrganizationHubSidebarChildrenCheck
          :item="course"
          :folder="folder"
          :space="space"
          :class="
            checked || $device.isMobile
              ? 'flex'
              : 'hidden group-hover/course:flex'
          "
        />
      </div>
      <div
        class="flex h-full w-full flex-col items-start justify-between gap-0.5"
      >
        <div class="flex w-full items-start justify-start gap-1">
          <div
            class="w-0 flex-1 cursor-pointer truncate text-sm"
            data-cy="e88a1fcd6c9f713d"
            @click="onEdit"
          >
            {{ course.title }}
          </div>
          <div class="flex shrink-0 gap-1">
            <OrganizationHubSidebarChildrenCoursesStatusBadge
              :status="course.status"
              :type="course.type"
              :purchased="true"
            />
          </div>
        </div>

        <div class="flex items-center pl-0.5 text-[#707070]">
          <div
            class="mr-1 flex size-4 items-center justify-center rounded-full bg-black"
          >
            <img
              v-if="course.owner?.picture"
              :src="course.owner?.picture"
              class="size-full rounded-full object-cover"
            />
            <div
              v-else
              class="flex size-full items-center justify-center rounded-full bg-[#2c2c2c] p-2 text-white/20"
            >
              <i class="fa-solid fa-user text-xs" />
            </div>
          </div>
          <div
            class="max-w-[14rem] cursor-pointer truncate text-xs hover:text-white hover:underline"
            @click="handleUserClick(course.owner)"
          >
            {{ course.owner?.name }}
          </div>

          <el-tooltip
            v-if="course.type === 'live'"
            placement="bottom-end"
            effect="light"
            :width="0"
          >
            <div
              class="flex cursor-pointer items-center gap-0.5 p-0.5 pr-0 text-xs hover:text-white"
            >
              <span class="text-[#707070]">•</span>
              <i class="fa-regular fa-calendar-days text-xs" />
              <span>{{ course.cycles?.length }}</span>
            </div>
            <template #content>
              <div
                class="flex max-h-72 flex-col gap-1.5 overflow-y-auto py-1.5 text-xs font-medium text-[#E5E5E5]"
              >
                <div
                  v-for="item in cyclesOptions"
                  :key="item.id"
                  class="flex items-center justify-between gap-2 rounded p-1"
                  :class="
                    item.cycleDisabled ? 'pointer-events-none opacity-50' : ''
                  "
                  @click="onClick(item)"
                >
                  <div>
                    {{ formatDate(item.startDate, 'DD MMM YYYY') }} -
                    {{ formatDate(item.endDate, 'DD MMM YYYY') }}
                  </div>
                </div>
              </div>
            </template>
          </el-tooltip>

          <el-tooltip
            v-if="course.availableLicenses"
            :width="0"
            placement="bottom"
            effect="light"
          >
            <div
              class="group/license flex h-full cursor-pointer items-center gap-0.5 p-0.5 text-xs text-[#E0B92C]"
            >
              <span class="text-[#707070]">•</span>
              <i
                class="fa-regular fa-file-certificate text-xs group-hover/license:font-extrabold"
              />
              <span>{{ course.availableLicenses }}</span>
            </div>
            <template #content>
              <div
                class="flex h-full cursor-pointer items-center gap-1 p-1.5 text-xs text-[#E0B92C]"
              >
                <i class="fa-regular fa-file-certificate text-xs" />
                <span>
                  {{ course.availableLicenses }}
                  {{
                    `${course.availableLicenses.length > 1 ? 'Licenses' : 'License'}`
                  }}
                </span>
              </div>
            </template>
          </el-tooltip>
        </div>
      </div>
      <OrganizationHubSidebarChildrenCoursesOption
        :course="course"
        :space="space"
        :folder="folder"
        @on-rename="onRename"
      />

      <div
        class="absolute bottom-0 left-0 hidden w-full px-7 group-hover/course:flex"
      >
        <el-progress
          class="w-full"
          :percentage="course.completion"
          :height="1"
          status="success"
          :color="'#7C27B2'"
          :show-text="false"
          :stroke-width="2"
        />
      </div>
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
    folder: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    const profileStore = useProfileStore();
    return { hubSpaces, hubCourse, hubSidebar, profileStore };
  },
  data() {
    return {
      lastUrl: '',
      mouseDownStart: 0,
      isMouseUp: false,
      hover: false,
      more: false,
      isEdit: false,
    };
  },
  computed: {
    checked() {
      return this.course._state === 'checked';
    },
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
    isDraging() {
      return this.checked && this.hubSpaces.isDraging;
    },
    cyclesOptions() {
      const { cycles } = handleCourseAvailableAndCycles(this.course);
      return cycles;
    },
  },
  methods: {
    onEdit() {
      this.hubSidebar.edieCourse({
        course: this.course,
      });
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
    },
    onRename() {
      this.isEdit = true;
    },
    handleUserClick(item) {
      this.profileStore.gotoProfilePage(item);
    },
  },
};
</script>

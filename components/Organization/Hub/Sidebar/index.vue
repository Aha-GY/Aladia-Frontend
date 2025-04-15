<template>
  <Teleport to="body">
    <div
      class="fixed top-4 z-[70] h-[calc(100vh-2rem)] w-[calc(100vw-1rem)] overflow-hidden rounded font-light transition-all duration-300 md:w-[28rem]"
      :class="
        isPreview ? 'right-[100vw] md:right-[60vw]' : 'right-2 md:right-5'
      "
    >
      <OrganizationHubSidebarSpace v-if="inSpace" class="z-0" />
      <OrganizationHubSidebarSpaceEdit
        v-if="inSpace && space.state"
        class="z-10"
      />
      <OrganizationHubSidebarPayment v-if="payment.state" class="z-10" />
      <OrganizationHubSidebarSort v-if="sort.state" class="z-10" />
      <OrganizationHubSidebarChildren
        v-if="inSpace && children.state"
        class="z-20"
      />
      <OrganizationHubSidebarCourseOrg
        v-if="course.purchasedByOrg"
        class="z-30"
      />
      <OrganizationHubSidebarCourseUser v-if="course.state" class="z-30" />
      <OrganizationHubSidebarLicenseAssign v-if="license.assign" class="z-40" />
      <OrganizationHubSidebarLicenseGroups v-if="license.groups" class="z-40" />
      <OrganizationHubSidebarLicenseManage v-if="license.manage" class="z-50" />
      <OrganizationHubSidebarBuilder v-if="builder.state" class="z-40" />
      <OrganizationHubSidebarInvite v-if="invite.state" class="z-50" />
      <OrganizationHubSidebarVersion v-if="version.state" class="z-[60]" />
      <OrganizationHubSidebarCalendar v-if="calendar.state" class="z-10" />
      <OrganizationHubSidebarCalendarDetail
        v-if="calendar.detailState"
        class="z-20"
      />
      <OrganizationHubSidebarCalendarSchedule
        v-if="calendar.scheduleState"
        class="z-20"
      />
    </div>
    <div
      class="fixed top-4 z-[70] h-[calc(100vh-5rem)] w-[calc(100vw-1rem)] rounded bg-black font-light transition-all duration-300 md:right-5 md:h-[calc(100vh-2rem)] md:w-[calc(60vw-2rem)]"
      :class="{
        'right-2 opacity-100 md:right-5': isPreview,
        'right-[-100vw] opacity-0 md:right-[-60vw]': !isPreview,
        'border border-white/10': !hubCourse.versionViewing,
        'border-2 border-[#61329e]': hubCourse.versionViewing,
      }"
    >
      <OrganizationHubCoursePreview v-if="isPreview" />
      <OrganizationHubCoursePopup v-if="isPreview && isPopup" />
      <OrganizationHubCourseAi v-if="isPreview && aiOpen" />
    </div>
    <client-only>
      <el-dialog
        v-model="hubCourse.version.restore.state"
        :show-close="false"
        append-to-body
        destroy-on-close
        width="24rem"
      >
        <OrganizationHubSidebarVersionRestore />
      </el-dialog>
      <el-dialog
        v-model="hubCourse.log.restore.state"
        :show-close="false"
        append-to-body
        destroy-on-close
        width="24rem"
      >
        <OrganizationHubSidebarVersionItemRestore />
      </el-dialog>
      <el-dialog
        v-model="hubCourse.version.exit"
        :show-close="false"
        append-to-body
        destroy-on-close
        width="24rem"
      >
        <OrganizationHubSidebarVersionExit />
      </el-dialog>
    </client-only>
    <client-only>
      <el-dialog
        v-model="hubSidebar.invite.infoState"
        :show-close="false"
        append-to-body
        destroy-on-close
        align-center
        top="1rem"
        width="25rem"
      >
        <OrganizationHubSidebarInviteInfo />
      </el-dialog>
    </client-only>
  </Teleport>
  <div
    v-if="hubCourse.ai.backgroundAILoad"
    class="fixed bottom-20 right-20 !z-[100] flex w-80 flex-col items-center justify-center gap-2 rounded-lg bg-black px-2 py-4"
  >
    <div class="absolute -top-0.5 right-0 p-2">
      <i
        class="fa-regular fa-close cursor-pointer text-lg text-white/30 hover:text-white/50"
        @click="hubCourse.ai.backgroundAILoad = false"
      />
    </div>
    <div class="flex items-center gap-2">
      <i
        v-if="hubCourse.ai.done"
        class="fa-solid fa-check-circle text-xl text-[#02826B]"
      />
      <i v-else class="fa-solid fa-sparkles text-xl text-white" />
      <div v-if="hubCourse.ai.done" class="">
        {{ $t('course.ai.generate') }}
      </div>
      <div v-else class="">{{ $t('course.ai.generating') }}</div>
    </div>
    <el-progress
      class="w-full"
      :percentage="100"
      status="success"
      :color="hubCourse.ai.done ? '#02826B' : '#7C27B2'"
      :duration="hubCourse.ai.done ? 0 : 2"
      :indeterminate="true"
      :show-text="false"
    />
  </div>
</template>

<script>
import WebSocketService from '~/utils/websocket';

export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    const websocket = WebSocketService.getInstance();
    return { hubCourse, hubSpaces, hubSidebar, websocket };
  },
  computed: {
    inSpace() {
      return this.$route.name.endsWith('name-spaces');
    },
    inCalendar() {
      return this.$route.name.endsWith('name-calendar');
    },
    space() {
      return this.hubSidebar.space;
    },
    payment() {
      return this.hubSidebar.payment;
    },
    sort() {
      return this.hubSidebar.sort;
    },
    course() {
      return this.hubSidebar.course;
    },
    children() {
      return this.hubSidebar.children;
    },
    builder() {
      return this.hubSidebar.builder;
    },
    invite() {
      return this.hubSidebar.invite;
    },
    version() {
      return this.hubSidebar.version;
    },
    calendar() {
      return this.hubSidebar.calendar;
    },
    license() {
      return this.hubSidebar.license;
    },
    isPreview() {
      return this.hubCourse.isPreview;
    },
    isPopup() {
      return this.hubCourse.popupOpen;
    },
    aiOpen() {
      return this.hubCourse.ai.open;
    },
    spaceId() {
      return this.$route.query.space;
    },
    view() {
      return this.$route.query.view;
    },
  },
  watch: {
    // 切换空间时关闭侧边栏
    spaceId() {
      this.hubSidebar.state = false;
    },
    // 切换视图时关闭侧边栏
    view() {
      this.hubSidebar.state = false;
    },
    // 切换路由时关闭侧边栏
    '$route.name'() {
      this.hubSidebar.state = false;
    },
  },
  mounted() {
    this.websocket.on(
      'course-generation-completed',
      this.hubCourse.courseGenerationCompleted,
    );
  },
  beforeUnmount() {
    this.hubSidebar.$reset();
    this.hubCourse.$reset();
    this.websocket.off(
      'course-generation-completed',
      this.hubCourse.courseGenerationCompleted,
    );
  },
};
</script>

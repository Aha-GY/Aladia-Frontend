<template>
  <div id="meet-container" class="relative h-full w-full pt-5">
    <div
      v-if="!end.show"
      class="flex h-full flex-col items-center justify-center gap-2"
    >
      <MeetNotification />
      <div
        class="relative flex h-0 w-full flex-1 flex-col items-center px-3"
        :class="[
          course ? 'pr-[4.5rem]' : '',
          $device.isMobile ? 'bg-[#060606] pt-6' : 'justify-center',
        ]"
      >
        <MeetHeader v-if="hmsStore.hmsIsConnectedToRoom" />
        <LazyMeetConference v-if="hmsStore.hmsIsConnectedToRoom" />
        <LazyMeetJoin
          v-if="!hmsStore.hmsIsConnectedToRoom"
          :room-id="roomId"
          :event-id="eventId"
          :calendar-id="calendarId"
        />
      </div>
      <MeetFooter v-if="hmsStore.hmsIsConnectedToRoom" />
      <MeetFlyingEmoji />
    </div>
    <MeetEnd v-else />
    <LazyMeetSidebar
      v-if="!$device.isMobile && !hmsStore.hmsIsConnectedToRoom"
    />
    <client-only>
      <el-drawer
        v-if="$device.isMobile"
        :model-value="isSidebar"
        :with-header="false"
        direction="btt"
        size="80%"
        @close="hmsStore.openPopup = ''"
      >
        <MeetSidebarChat v-if="hmsStore.openPopup === 'chat'" />
        <MeetSidebarParticipant v-else-if="hmsStore.openPopup === 'user'" />
        <MeetSidebarQuizzes v-else-if="hmsStore.openPopup === 'quiz'" />
        <MeetSidebarPolls v-else-if="hmsStore.openPopup === 'poll'" />
        <MeetSidebarActive v-else-if="hmsStore.openPopup === 'active'" />
        <MeetSidebarSetting v-else-if="hmsStore.openPopup === 'setting'" />
        <MeetSidebarVisualEffects v-else-if="hmsStore.openPopup === 'visual'" />
        <MeetSidebarFeedback v-else-if="hmsStore.openPopup === 'feedback'" />
      </el-drawer>
    </client-only>
    <LazyMeetDialog />
  </div>
</template>

<script>
import { hmsActions } from '~/utils/hms';

export default {
  props: {
    roomId: String,
    calendarId: String,
    eventId: String,
    course: Object,
  },
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      timer: null,
    };
  },
  computed: {
    end() {
      return this.hmsStore.end;
    },
    hmsPeers() {
      return this.hmsStore.hmsPeers;
    },
    isSidebar() {
      return !![
        'chat',
        'user',
        'poll',
        'active',
        'quiz',
        'setting',
        'visual',
        'feedback',
      ].includes(this.hmsStore.openPopup);
    },
  },
  beforeMount() {
    this.init();
  },
  mounted() {
    window.addEventListener('mousemove', this.handleUserActivity);
    window.addEventListener('keydown', this.handleUserActivity);
    window.addEventListener('beforeunload', this.handleUnload);
    window.addEventListener('onunload', this.handleUnload);
    this.resetInactivityTimeout();
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.handleUserActivity);
    window.removeEventListener('keydown', this.handleUserActivity);
    window.removeEventListener('beforeunload', this.handleUnload);
    window.removeEventListener('unload', this.handleUnload);
    this.timer && clearTimeout(this.timer);
    if (!this.hmsStore.hmsIsConnectedToRoom) {
      this.hmsStore.$reset();
    }
  },
  methods: {
    init() {
      if (!this.hmsStore.hmsIsConnectedToRoom) {
        this.hmsStore.initialiseSubscribe();
      }
      if (this.course) {
        this.hmsStore.course = this.course;
      }
    },
    handleUnload() {
      hmsActions.leave();
    },
    handleUserActivity() {
      this.resetInactivityTimeout();
    },
    resetInactivityTimeout() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(
        () => {
          if (this.hmsPeers.length) {
            return;
          }
          this.hmsStore.dialog.disconnect = true;
        },
        1000 * 60 * 5,
      );
    },
  },
};
</script>

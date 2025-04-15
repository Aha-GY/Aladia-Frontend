<template>
  <div
    ref="main"
    class="relative flex h-full flex-1 flex-col items-end transition-all"
  >
    <OrganizationHubCalendarHeader />
    <OrganizationHubCalendarMain />
    <Teleport to="body">
      <OrganizationHubCalendarCreate
        v-if="hubCalendarStore.createOpen && !$device.isMobile"
      />
    </Teleport>
    <Teleport to="body">
      <BaseNotification
        v-if="hubCalendarStore.notifyShow"
        :title="hubCalendarStore.notifyTitle"
        :is-undo="hubCalendarStore.isUndo"
        @on-hide="onHide"
        @on-undo="onUndo"
      />
    </Teleport>
    <client-only>
      <el-drawer
        v-if="$device.isMobile"
        v-model="hubCalendarStore.createOpen"
        :close-on-press-escape="false"
        :with-header="false"
        direction="btt"
        size="80%"
      >
        <div class="flex h-full flex-col">
          <OrganizationHubCalendarCreateHeader />
          <OrganizationHubCalendarCreateChapterHeader
            v-if="event.chapterSummary"
          />

          <div
            class="flex flex-1 flex-col gap-4 overflow-y-auto p-3 text-sm transition-all"
          >
            <OrganizationHubEventTitle>
              <BaseInput
                v-model="event.name"
                :title="$t('index.title')"
                class="pl-1"
                :class="type === 'event' ? '' : 'pointer-events-none'"
              />
            </OrganizationHubEventTitle>

            <OrganizationHubEvent :type="type" :calendar-list="calendarList" />
          </div>

          <OrganizationHubCalendarCreateFooter v-if="type === 'event'" />
        </div>
      </el-drawer>
    </client-only>
    <client-only>
      <el-dialog
        v-model="hubCalendarStore.shareOpen"
        :show-close="false"
        append-to-body
        align-center
        :width="$device.isMobile ? '346px' : '426px'"
      >
        <OrganizationHubCalendarCreateShareConfirm />
      </el-dialog>
    </client-only>
    <client-only>
      <el-dialog
        v-model="hubCalendarStore.frequencyOpen"
        :show-close="false"
        append-to-body
        align-center
        :width="$device.isMobile ? '346px' : '426px'"
      >
        <OrganizationHubCalendarCreateFrequencyConfirm />
      </el-dialog>
    </client-only>
  </div>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    const hubEventStore = useHubEventStore();
    const hubSpaces = useHubSpacesStore();
    return { hubCalendarStore, hubEventStore, hubSpaces };
  },
  computed: {
    event() {
      return this.hubEventStore.event;
    },
    type() {
      return this.event?.entity?.type === 'course' ? 'lecture' : 'event';
    },
    calendarList() {
      return this.hubCalendarStore.calendarList;
    },
    calendarId() {
      return this.$route.query.calendarId;
    },
    eventId() {
      return this.$route.query.eventId;
    },
  },
  watch: {
    'hubCalendarStore.dateRange': {
      handler() {
        this.hubCalendarStore.searchAllEvents();
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.course) {
        this.hubCalendarStore.courseId = this.course.id;
        this.hubCalendarStore.courseActives = [
          { ...this.course, cycleId: this.course?.cycles[0]?.id },
        ];
        this.hubCalendarStore.courses.push(
          ...this.hubCalendarStore.courseActives,
        );
      } else {
        this.hubCalendarStore.courseId = null;
        this.hubCalendarStore.courseActives = [];
      }
      if (this.calendarId && this.eventId) {
        this.hubCalendarStore.create({
          calendarId: this.calendarId,
          id: this.eventId,
        });
      }
    },
    onHide() {
      this.hubCalendarStore.notifyShow = false;
    },
    async onUndo() {
      const entryData = this.hubCalendarStore.beforeEntryData;
      if (!entryData.id) {
        return;
      }
      this.hubEventStore.setEvent(entryData);
      const data = this.hubEventStore.getEvent(entryData);
      const isDelete = !this.hubCalendarStore.entryDataList.filter(
        (r) => r.id === entryData.id,
      ).length;
      if (isDelete) {
        delete data.id;
        delete data.updateEventTarget;
        await this.hubCalendarStore.createEvent(data, entryData.color);
      } else {
        await this.hubCalendarStore.updateEvent(data);
      }
    },
  },
};
</script>

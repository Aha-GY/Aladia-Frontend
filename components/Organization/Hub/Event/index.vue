<template>
  <div
    class="flex flex-col gap-4"
    :class="!logged ? 'pointer-events-none' : ''"
  >
    <OrganizationHubEventTime
      :class="hubEvent.event.id && isPast ? 'pointer-events-none' : ''"
    />
    <OrganizationHubEventFrequency />
    <OrganizationHubEventMember v-if="isLecture" type="observer" />
    <OrganizationHubEventMember v-if="isLecture" type="teacher" />
    <OrganizationHubEventMember v-if="isLecture" type="attendant" />
    <OrganizationHubEventHost v-if="isEvent" />
    <OrganizationHubEventCohost v-if="isEvent" />
    <OrganizationHubEventGuest v-if="isEvent" />
    <OrganizationHubEventMeet v-if="!course?.id" />
    <OrganizationHubEventAdress />
    <OrganizationHubEventDescription />
    <OrganizationHubEventAttachment />
    <!-- <OrganizationHubEventCalendar v-if="logged" /> -->
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    event: {
      type: Object,
      default: () => null,
    },
    course: {
      type: Object,
      default: () => ({}),
    },
    chapter: {
      type: Object,
      default: () => ({}),
    },
    lecture: {
      type: Object,
      default: () => ({}),
    },
    calendarList: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const hubEvent = useHubEventStore();
    const authStore = useAuthStore();
    return { hubEvent, authStore };
  },
  computed: {
    isEvent() {
      return this.type === 'event';
    },
    isLecture() {
      return this.type === 'lecture';
    },
    isPast() {
      return dayjs().isAfter(this.hubEvent.event?.endDate);
    },
    logged() {
      return this.authStore.logged;
    },
    availableList() {
      return this.hubEvent.availableList;
    },
  },
  beforeMount() {
    if (this.event) {
      this.hubEvent.setEvent(cloneDeep(this.event));
    }

    this.hubEvent.type = this.type;
    this.hubEvent.course = this.course;
    this.hubEvent.chapter = this.chapter;
    this.hubEvent.lecture = this.lecture;
    if (this.calendarList.length) {
      this.hubEvent.calendarList = this.calendarList;
    }
  },
};
</script>

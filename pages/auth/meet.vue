<template>
  <div />
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const hubCalendar = useHubCalendarStore();
    const hubEvent = useHubEventStore();
    return { hubEvent, authStore, hubCalendar };
  },
  computed: {
    type() {
      return this.$route.query.type;
    },
    token() {
      return this.$route.query.token;
    },
    calendarId() {
      return this.$route.query.calendarId;
    },
    eventId() {
      return this.$route.query.eventId;
    },
    logged() {
      return this.authStore.logged;
    },
  },
  watch: {
    logged() {
      if (this.logged) {
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (!this.logged) {
        this.authStore.popup = true;
        return;
      }

      if (this.type === 'meet' || !this.type) {
        const { exists } = await this.checkEventMemberExists();
        if (exists) {
          await this.getEventAuthToken();
        } else {
          await this.acceptEventInvite();
        }
      }
      if (this.type === 'calendar') {
        const { exists } = await this.checkEventMemberExists();
        if (exists) {
          const url = `${this.authStore.hub}/calendar?calendarId=${this.calendarId}&eventId=${this.eventId}`;
          this.$router.replace(url);
        } else {
          await this.acceptEventInvite();
        }
      }
    },
    async acceptEventInvite() {
      await this.hubCalendar.acceptEventInvite({
        eventId: this.eventId,
        calendarId: this.calendarId,
        token: this.token,
      });

      const url = `${this.authStore.hub}/calendar?calendarId=${this.calendarId}&eventId=${this.eventId}`;
      if (this.type === 'calendar') {
        this.$router.replace(url);
        return;
      }
      await this.getEventAuthToken();
    },
    async getEventAuthToken() {
      const { roomId } = await this.hubEvent.getEventAuthToken({
        calendarId: this.calendarId,
        eventId: this.eventId,
      });
      this.$router.replace(`/meet/${roomId}`);
    },

    async checkEventMemberExists() {
      return await this.hubEvent.checkMemberExists({
        calendarId: this.calendarId,
        eventId: this.eventId,
      });
    },
  },
};
</script>

<template>
  <NuxtLayout name="empty">
    <Head>
      <Title>{{ $t('event.meet.label') }}</Title>
    </Head>
    <div class="h-screen w-screen">
      <Meet :calendar-id="calendarId" :event-id="eventId" />
    </div>
  </NuxtLayout>
</template>

<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      calendarId: null,
      eventId: null,
    };
  },
  beforeMount() {
    this.init();
  },
  methods: {
    init() {
      this.calendarId = this.$route.query.calendarId;
      this.eventId = this.$route.query.eventId;
    },
  },
};
</script>

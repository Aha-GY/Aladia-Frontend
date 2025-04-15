<template>
  <div class="flex w-full shrink-0 items-center justify-between gap-2">
    <div />
    <MeetHeaderInfo />
    <div>
      <MeetHeaderHLSStream
        v-if="isRunning && hmsHLSState?.variants[0]?.startedAt"
      />
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  computed: {
    hmsHLSState() {
      return this.hmsStore.hmsHLSState;
    },
    isRunning() {
      return this.hmsHLSState?.running;
    },
  },
  methods: {
    copyShareLink() {
      const url = `${window.location.origin}${this.$route.path}`;
      navigator.clipboard.writeText(url).then(
        () => {
          this.$toast.success(this.$t('meet.room.link.copy.success'));
        },
        function (err) {
          console.error(this.$t('meet.room.link.copy.fail'), err);
        },
      );
    },
  },
};
</script>

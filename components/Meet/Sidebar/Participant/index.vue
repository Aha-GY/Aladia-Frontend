<template>
  <div
    class="flex h-full w-full flex-col gap-2.5 overflow-hidden rounded-5 border border-white/10 bg-[#060606]"
  >
    <MeetSidebarHeader title="Participants" icon="fa-people-group" />
    <div class="hide-scrollbar flex h-0 flex-1 flex-col gap-2 overflow-y-auto">
      <MeetSidebarParticipantHandBox />
      <MeetSidebarParticipantBox role="host" />
      <MeetSidebarParticipantBox role="co-host" />
      <MeetSidebarParticipantBox role="guest" />
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
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    isHost() {
      const roleName = this.hmsLocalPeer.roleName;
      return roleName === 'host' || roleName === 'co-host';
    },
  },
};
</script>

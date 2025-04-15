<template>
  <div
    class="flex h-full w-full flex-col gap-2.5 overflow-hidden rounded-5 border border-white/10 bg-[#060606]"
  >
    <MeetSidebarHeader
      :title="$t('meet.banner.activity.label')"
      icon="fa-shapes"
    >
      <div class="flex items-center gap-1.5">
        <div
          v-if="isQuiz"
          class="flex items-center rounded-5 bg-white/5 pr-1 text-xs text-[#D9D9D9]"
        >
          <div class="flex h-6 w-6 items-center justify-center">
            <i class="fa-regular fa-comments-question text-[#707070]" />
          </div>
          Quiz is active
        </div>
        <div
          v-if="isPoll"
          class="flex items-center rounded-5 bg-white/5 pr-1 text-xs text-[#D9D9D9]"
        >
          <div class="flex h-6 w-6 items-center justify-center">
            <i class="fa-regular fa-poll-people text-[#707070]" />
          </div>
          Poll is active
        </div>
      </div>
    </MeetSidebarHeader>
    <div
      class="hide-scrollbar flex h-0 flex-1 flex-col gap-2 overflow-y-auto bg-[#060606]"
    >
      <MeetSidebarActiveBanner />
      <MeetSidebarActiveList />
      <MeetSidebarActiveActions />
      <MeetSidebarActiveEndList />
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
    hmsPolls() {
      return this.hmsStore.hmsPolls.filter(
        (item) =>
          (item.visibility || this.hmsLocalPeer.id === item.createdBy) &&
          item.state === 'started',
      );
    },
    isQuiz() {
      return this.hmsPolls.some((item) => item.type === 'quiz');
    },
    isPoll() {
      return this.hmsPolls.some((item) => item.type === 'poll');
    },
  },
};
</script>

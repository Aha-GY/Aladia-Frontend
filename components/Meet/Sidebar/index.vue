<template>
  <client-only>
    <div
      class="absolute top-0 h-full w-[25rem] overflow-hidden rounded-5 py-4 transition-all"
      :class="[
        open ? 'z-10' : 'pointer-events-none',
        hmsStore.course ? 'right-[4.25rem]' : 'right-2',
      ]"
    >
      <Transition
        :name="open ? 'slide-fade-left' : 'slide-fade-right'"
        mode="out-in"
      >
        <MeetSidebarVisualEffects v-if="hmsStore.openPopup === 'visual'" />
        <MeetSidebarFeedback v-else-if="hmsStore.openPopup === 'feedback'" />
        <!-- <MeetSidebarChat v-else-if="hmsStore.openPopup === 'chat'" />
        <MeetSidebarParticipant v-else-if="hmsStore.openPopup === 'user'" />
        <MeetSidebarPollQuiz v-else-if="hmsStore.openPopup === 'poll'" />
        <MeetSidebarActive v-else-if="hmsStore.openPopup === 'active'" /> -->
      </Transition>
    </div>
  </client-only>
</template>
<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  computed: {
    open() {
      return ['visual', 'feedback'].includes(this.hmsStore.openPopup);
    },
  },
};
</script>

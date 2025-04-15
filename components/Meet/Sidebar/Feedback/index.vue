<template>
  <div
    class="relative flex h-full w-full flex-col gap-2 overflow-hidden rounded-5 border border-white/10 bg-[#060606]"
  >
    <MeetSidebarHeader
      :title="$t('meet.end.feedback.label')"
      icon="fa-message-smile"
    />
    <div class="flex items-center justify-center bg-[#0D0D0D] px-6 py-4">
      <img src="~/assets/meet/feedback.svg" alt="" />
    </div>

    <div class="bg-[#0D0D0D] px-4 py-2">
      <div
        class="flex cursor-pointer items-center gap-2 rounded-5 p-2 text-sm hover:bg-white/5"
        @click="open = 'report'"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-light fa-flag text-[#FAFAFA]" />
        </div>
        <div class="w-0 flex-1 truncate text-[#BBB]">
          {{ $t('meet.actions.report.issue') }}
        </div>
        <div class="flex h-6 w-6 items-center justify-center">
          <i class="fa-regular fa-chevron-right text-xs text-[#FAFAFA]" />
        </div>
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded-5 p-2 text-sm hover:bg-white/5"
        @click="open = 'review'"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-light fa-message-pen text-[#FAFAFA]" />
        </div>
        <div class="w-0 flex-1 truncate text-[#BBB]">
          {{ $t('meet.actions.write.review.title') }}
        </div>
        <div class="flex h-6 w-6 items-center justify-center">
          <i class="fa-regular fa-chevron-right text-xs text-[#FAFAFA]" />
        </div>
      </div>
    </div>
    <div
      class="absolute left-0 top-0 h-full w-full"
      :class="open ? 'z-10' : 'pointer-events-none'"
    >
      <Transition
        :name="open ? 'slide-fade-left' : 'slide-fade-right'"
        mode="out-in"
      >
        <MeetSidebarFeedbackReport v-if="open === 'report'" @back="open = ''" />
        <MeetSidebarFeedbackReview
          v-else-if="open === 'review'"
          @back="open = ''"
        />
      </Transition>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      open: '',
    };
  },
};
</script>

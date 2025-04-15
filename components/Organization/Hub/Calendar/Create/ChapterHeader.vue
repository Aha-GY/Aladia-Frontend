<template>
  <div class="bg-[#0f0f0f] p-3" :class="!logged ? 'pointer-events-none' : ''">
    <div class="mb-2 flex items-center gap-4">
      <div class="w-4">
        <i class="fa-light fa-bookmark text-base text-white/20" />
      </div>
      <div class="flex-1">
        <BaseInput
          v-model="chapterSummary.title"
          :title="$t('course.chapter.title')"
        />
      </div>
    </div>
    <div class="flex items-center gap-4">
      <div>
        <i class="fa-light fa-calendar text-base text-white/20" />
      </div>
      <div class="flex-1">
        <OrganizationHubCourseEditContentChapterDuration
          :chapter="chapterSummary"
          :course="course"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubEventStore = useHubEventStore();
    const authStore = useAuthStore();
    const hubCalendarStore = useHubCalendarStore();
    return { hubEventStore, authStore, hubCalendarStore };
  },
  computed: {
    event() {
      return this.hubEventStore.event;
    },
    course() {
      return this.hubCalendarStore.courses.find(
        (r) => r.id === this.event?.entity?.id,
      );
    },
    chapterSummary() {
      return this.event.chapterSummary;
    },
    logged() {
      return this.authStore.logged;
    },
  },
};
</script>

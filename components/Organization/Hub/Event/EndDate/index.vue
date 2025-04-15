<template>
  <div class="flex flex-col gap-1 text-sm font-light text-white/50">
    <div
      v-if="hubEvent.type === 'lecture'"
      class="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-white/5"
      data-cy="f4582c69e5cd8548"
      @click="onEndDateReferenceChange('chapter')"
    >
      <BaseCheckbox :active="endDateReference.reference === 'chapter'" />
      <OrganizationHubEventEndDateChapter />
    </div>
    <div
      v-if="hubEvent.type === 'lecture'"
      class="flex cursor-pointer items-center justify-between rounded p-1 hover:bg-white/5"
      data-cy="2188373dffb8f925"
      @click="onEndDateReferenceChange('course')"
    >
      <div class="flex items-center gap-2">
        <BaseCheckbox :active="endDateReference.reference === 'course'" />
        {{ $t('course.period') }}
      </div>
      <div v-if="dates.endDate">
        {{ $t('course.date.end') }}
        {{ formatDate(dates.endDate, 'DD MMM YYYY') }}
      </div>
    </div>
    <div
      class="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-white/5"
      data-cy="644ed21a7f3cea01"
      @click="onEndDateReferenceChange('custom')"
    >
      <BaseCheckbox
        v-if="hubEvent.type === 'lecture'"
        :active="endDateReference.reference === 'custom'"
      />
      <OrganizationHubEventEndDateCustom />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubEvent = useHubEventStore();
    return { hubEvent };
  },
  computed: {
    course() {
      return this.hubEvent.course;
    },
    chapter() {
      return this.hubEvent.chapter;
    },
    lecture() {
      return this.hubEvent.lecture;
    },
    event() {
      return this.hubEvent.event;
    },
    frequency() {
      return this.event.frequency;
    },
    endDateReference() {
      return this.event.endDateReference || {};
    },
    dates() {
      if (this.course?.cycles) {
        return this.course?.cycles[0]?.dates || {};
      } else {
        return {};
      }
    },
  },
  methods: {
    onEndDateReferenceChange(reference) {
      this.endDateReference.reference = reference;

      if (reference === 'course') {
        this.endDateReference.referenceId = this.course.id;
        this.event.frequency.endDate = this.dates.endDate;
      }

      if (reference === 'chapter') {
        this.endDateReference.referenceId = this.chapter.id || null;
        this.event.frequency.endDate =
          this.chapter?.cycles[0]?.dates?.endDate || null;
      }

      if (reference === 'custom') {
        this.endDateReference.referenceId = null;
        this.event.frequency.endDate = null;
      }
    },
  },
};
</script>

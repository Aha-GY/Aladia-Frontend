<template>
  <div class="relative flex w-full items-center justify-between gap-2">
    <div
      ref="buttonRef"
      class="group/line relative flex flex-1 items-center justify-between pb-1"
      data-cy="e5e2fa641368b7c5"
      @click="open = true"
    >
      <div v-if="!chapter" class="h-5 text-white/50">
        {{ $t('course.chapter.choose') }}
      </div>
      <div v-if="chapter" class="h-5 w-0 flex-1 truncate text-white">
        {{ chapter.name }}
      </div>
      <i v-if="open" class="fa-light fa-angles-up-down text-white/20" />
      <BaseLine :active="open" />
    </div>
    <div v-if="chapter?.cycles[0]?.dates?.endDate">
      {{ $t('course.chapter.end') }}
      {{ formatDate(chapter?.cycles[0]?.dates.endDate, 'DD MMM YYYY') }}
    </div>
    <el-popover
      :visible="open"
      :virtual-ref="buttonRef"
      :show-arrow="false"
      :width="310"
      virtual-triggering
      :persistent="false"
      :teleported="false"
      placement="top"
      @close="open = false"
    >
      <div ref="popupRef" class="p-2">
        <div class="mb-2 max-h-64 overflow-auto">
          <div
            v-for="item in chapters"
            :key="item"
            class="cursor-pointer rounded px-1.5 py-1 text-13 text-white/50 hover:bg-white/5 hover:text-white"
            data-cy="07603d2de62535a3"
            @click.stop="onChapterClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
        <BasePopupBottom @close="open = false" />
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  setup() {
    const open = ref(false);
    const buttonRef = ref(null);
    const popupRef = ref(null);
    const hubEvent = useHubEventStore();

    onClickOutside(
      buttonRef,
      () => {
        open.value = false;
      },
      {
        ignore: [popupRef],
      },
    );

    return { hubEvent, open, buttonRef, popupRef };
  },
  computed: {
    course() {
      return this.hubEvent.course;
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
    chapters() {
      try {
        return this.course?.chapters.filter(
          (chapter) => chapter.id && chapter?.cycles[0]?.dates?.endDate,
        );
      } catch (error) {
        return [];
      }
    },
    endDateReference() {
      return this.event.endDateReference;
    },
    chapter() {
      try {
        return (
          this.course.chapters.find(
            (item) => item.id === this.endDateReference.referenceId,
          ) || this.hubEvent.chapter
        );
      } catch (error) {
        return null;
      }
    },
  },
  watch: {
    'endDateReference.reference'(reference) {
      if (reference !== 'chapter') {
        this.open = false;
      }
    },
  },
  methods: {
    onChapterClick(chapter) {
      this.endDateReference.referenceId = chapter.id;
      this.frequency.endDate = chapter.cycles[0].dates.endDate;
      this.open = false;
    },
  },
};
</script>

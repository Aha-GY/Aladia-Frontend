<template>
  <client-only>
    <el-dialog
      v-model="popup.state"
      :show-close="false"
      append-to-body
      width="80vw"
      class="overflow-hidden !rounded-md"
      destroy-on-close
      :z-index="1000"
    >
      <div class="flex items-center justify-between bg-[#0C0C0C] px-4 py-3.5">
        <CoursePopupMenu />
        <BaseIconClose data-cy="aadfd67f209c2f70" @click="handleCloseDialog" />
      </div>
      <div class="hide-scrollbar h-[65vh] overflow-y-auto px-4">
        <CoursePopupCalendar v-if="popup.type === 'calendar'" />
        <CoursePopupChat v-if="popup.type === 'chat'" />
        <CoursePopupDescription v-if="popup.type === 'description'" />
        <CoursePopupQuestion v-if="popup.type === 'question'" />
        <CoursePopupReview v-if="popup.type === 'review'" />
        <CoursePopupSubject v-if="popup.type === 'subjects'" />
      </div>
    </el-dialog>
  </client-only>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    popup() {
      return this.courseStore.popup;
    },
  },
  methods: {
    handleCloseDialog() {
      this.popup.state = false;
    },
  },
};
</script>

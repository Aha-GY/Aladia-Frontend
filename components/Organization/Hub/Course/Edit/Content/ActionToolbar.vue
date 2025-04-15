<template>
  <div
    class="flex w-full items-center justify-between rounded-md bg-[#171715] px-3 py-1.5 text-xs text-[#FAFAFA] shadow-[1px_1px_3px_0px_rgba(0,0,0,0.25)]"
    :class="{ 'py-2': hubCourse.isPreview }"
  >
    <div class="flex gap-2 px-3 py-1.5">
      <div>{{ hubCourse.deleteCheck.length }} Element Selected</div>
      <button @click="oncancel">
        <i class="fa-light fa-circle-xmark text-sm" />
      </button>
    </div>
    <div class="flex gap-2 px-3 py-1.5">
      <client-only>
        <el-tooltip
          :show-arrow="false"
          trigger="click"
          placement="top-end"
          effect="light"
          :offset="4"
          popper-class="!bg-black !border-white/30 !p-1"
        >
          <button
            class="flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-white/5"
          >
            <i
              v-if="assigning"
              class="fa-solid fa-spinner animate-spin text-sm"
            />
            <i v-else class="fa-regular fa-chalkboard-user" />

            <span>Assign Subject</span>
          </button>

          <template #content>
            <div
              v-if="!subjects || subjects.length === 0"
              class="flex w-60 items-center justify-between gap-6 p-2 text-sm"
            >
              <div>No subjects</div>
              <button
                class="text-white/50 hover:text-white"
                @click="onAddSubject"
              >
                <i class="fa-regular fa-plus h-3 w-3 text-xs" />
                Add
              </button>
            </div>
            <div v-else class="max-h-80 overflow-auto pr-3">
              <div
                v-for="subject in subjects"
                :key="subject.id"
                class="flex cursor-pointer items-center gap-2 rounded-md p-1 px-2 text-sm hover:bg-white/15"
                @click="onAssign(subject.id)"
              >
                <i
                  class="fa-regular fa-chalkboard-user"
                  :style="{ color: subject.color }"
                />
                <span class="max-w-60 truncate">
                  {{ subject.title }}
                </span>
              </div>
            </div>
            <button
              class="flex items-center gap-2 p-1 text-sm text-[#EF4444]/60 hover:text-[#EF4444]/80"
              :class="{ 'cursor-not-allowed': !subjects.length }"
              :disabled="!subjects.length"
              @click="onUnassignSubject"
            >
              <i class="fa-light fa-circle-xmark text-sm" />
              Unassign All
            </button>
          </template>
        </el-tooltip>
      </client-only>
      <button
        class="flex items-center gap-1.5 rounded-md bg-[#450A0A] px-1.5 py-1 text-[#EF4444]"
        @click="onRemove"
      >
        <i v-if="deleting" class="fa-solid fa-spinner animate-spin text-sm" />
        <i v-else class="fa-light fa-trash-can" />

        <span>Delete</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSubject = useHubSubjectStore();
    return { hubCourse, hubSubject };
  },

  computed: {
    deleting() {
      return this.hubCourse.deleting;
    },
    assigning() {
      return this.hubCourse.assigning;
    },
    subjects() {
      return this.hubSubject.detail.subjects;
    },
  },
  methods: {
    oncancel() {
      this.hubCourse.deleting = false;
      this.hubCourse.clearSelected();
    },
    async onRemove() {
      await this.hubCourse.remove();
      this.hubCourse.clearSelected();
    },
    async onAssign(subjectId) {
      await this.hubCourse.assignSubjects({ subjectId });
    },
    async onUnassignSubject() {
      await this.hubCourse.unassignSubjects();
    },
    onAddSubject() {
      this.hubCourse.popupOpen = true;
      this.hubSubject.subjectPopup = true;
      this.hubCourse.isPreview = true;
      this.hubCourse.popupFrom = 'edit';
      this.hubCourse.clearSelected();
    },
  },
};
</script>

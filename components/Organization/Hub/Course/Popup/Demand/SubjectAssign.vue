<template>
  <div :lecture-id="lecture.id" class="flex w-full items-center gap-3.5 pt-4">
    <div>
      <i v-if="loading" class="fa-light fa-loader animate-spin" />
      <i
        v-else
        class="fa-regular fa-chalkboard-user"
        :style="{
          color: assignedSubject.color ? assignedSubject.color : '#707070',
        }"
      />
    </div>
    <OrganizationHubCourseEditItem
      :value="assignedSubject.title"
      :focus="assignSubjectFocus"
      title="Assign Subject"
      class="flex-1"
    >
      <div
        ref="modelRef"
        class="group/subject relative z-0 h-8 w-0 flex-1 cursor-pointer"
        :class="
          assignSubjectFocus || assignedSubject.id ? 'opacity-100' : 'opacity-0'
        "
        @click="assignSubjectFocus = !assignSubjectFocus"
      >
        <div
          v-if="assignedSubject.id"
          class="flex items-center justify-between"
        >
          <div class="w-full truncate py-1">
            {{ assignedSubject.title }}
          </div>
          <div
            class="hidden pr-2 hover:text-white/90 group-hover/subject:block"
          >
            <i
              class="fa-light fa-circle-xmark cursor-pointer"
              @click.stop="onUnassignSubject"
            />
          </div>
        </div>
        <div v-else class="flex h-full items-center text-white/50">
          select a subject
        </div>
      </div>
    </OrganizationHubCourseEditItem>
    <BasePopup
      id="create-model"
      :open="assignSubjectFocus"
      :store="hubCourse"
      :button-ref="modelRef"
      placement="bottom-start"
      :width="452"
      @close="assignSubjectFocus = false"
    >
      <div class="p-1">
        <div class="max-h-80 overflow-auto">
          <div
            v-for="subject in subjects"
            :key="subject.id"
            :class="subject.id === assignedSubject.id ? 'bg-white/10' : ''"
            class="mb-1 flex cursor-pointer items-center gap-2 rounded-md p-2 py-1 text-sm hover:bg-white/15"
            @click="assignSubject(subject.id)"
          >
            <i
              class="fa-regular fa-chalkboard-user"
              :style="{ color: subject.color }"
            />
            <span class="max-w-full truncate">
              {{ subject.title }}
            </span>
          </div>
        </div>
        <div class="py-1">
          <div
            class="flex w-full items-center justify-between border-white/10 font-medium"
            :class="!subjects || subjects.length === 0 ? '' : 'border-t pt-2'"
          >
            <div
              class="inline-flex cursor-pointer items-center justify-center gap-2 rounded bg-[#A20F0F]/5 px-2 py-0.5 text-[#94231b] hover:bg-[#a20f0f26]"
              data-cy="cd3481255369869d"
              @click.stop="assignSubjectFocus = false"
            >
              <div class="flex size-3 items-center justify-center">
                <i class="fa-solid fa-arrow-turn-left text-sm" />
              </div>
              {{ $t('base.dialog.close') }}
            </div>
            <button
              class="py-0.5 pr-1 text-white/50 hover:text-white"
              @click="onAddSubject"
            >
              <i class="fa-regular fa-plus h-3 w-3 text-xs" />
              Add a new Subject
            </button>
          </div>
        </div>
      </div>
    </BasePopup>
  </div>
</template>

<script>
export default {
  props: {
    chapter: Object,
    lecture: Object,
  },
  setup() {
    const modelRef = ref(null);
    const loading = ref(false);
    const assignSubjectFocus = ref(false);

    onClickOutside(modelRef, () => {
      assignSubjectFocus.value = false;
    });

    const hubCourse = useHubCoursesStore();
    const hubSubject = useHubSubjectStore();
    return {
      hubCourse,
      hubSubject,
      modelRef,
      loading,
      assignSubjectFocus,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    subjects() {
      return this.hubSubject.detail.subjects;
    },
    assignedSubject() {
      if (!this.lecture.subjectId) {
        return {};
      }
      return (
        this.hubSubject.detail.subjects.find(
          (subject) => subject.id === this.lecture.subjectId,
        ) || {}
      );
    },
  },
  methods: {
    async getSubject() {
      this.assignedSubject = {};
      const subject = this.hubSubject.detail.subjects.find(
        (subject) => subject.id === this.lecture.subjectId,
      );
      this.assignedSubject = { ...subject };
    },

    async assignSubject(subjectId) {
      try {
        this.loading = true;
        if (this.lecture.subjectId) {
          const currentSubject = this.subjects.find(
            (subject) => subject.id === this.lecture.subjectId,
          );
          if (currentSubject) {
            const lectureIndex = currentSubject.lectures.indexOf(
              this.lecture.id,
            );
            if (lectureIndex > -1) {
              currentSubject.lectures.splice(lectureIndex, 1);
            }
          }
        }
        await this.hubSubject.assignSubjects({
          subjectId,
          courseId: this.hubCourse.detail.id,
          lectureIds: [this.lecture.id],
        });
        const newSubject = this.subjects.find(
          (subject) => subject.id === subjectId,
        );
        if (newSubject) {
          newSubject.lectures.push(this.lecture.id);
        }
        this.lecture.subjectId = subjectId;
        this.loading = false;
        this.assignSubjectFocus = false;
        this.lecture.subjectId = subjectId;
      } catch (e) {
        this.loading = false;
      }
    },

    async onUnassignSubject() {
      this.loading = true;
      await this.hubSubject.unassignSubjects({
        subjectId: this.assignedSubject.id,
        courseId: this.hubCourse.detail.id,
        lectureIds: [this.lecture.id],
      });
      if (this.lecture.subjectId) {
        const currentSubject = this.subjects.find(
          (subject) => subject.id === this.lecture.subjectId,
        );
        if (currentSubject) {
          const lectureIndex = currentSubject.lectures.indexOf(this.lecture.id);
          if (lectureIndex > -1) {
            currentSubject.lectures.splice(lectureIndex, 1);
          }
        }
      }

      this.lecture.subjectId = null;
      this.assignedSubject = {};
      this.loading = false;
    },

    onAddSubject() {
      this.hubCourse.popupOpen = true;
      this.hubSubject.subjectPopup = true;
      this.hubSubject.addNewSubject = true;
      this.hubCourse.isPreview = true;
      this.hubCourse.popupFrom = 'edit';
      this.assignSubjectFocus = false;
    },
  },
};
</script>

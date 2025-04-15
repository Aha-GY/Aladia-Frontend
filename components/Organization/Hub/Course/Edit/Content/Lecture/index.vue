<template>
  <div
    :lecture-id="lecture.id"
    class="group/lecture mb-4 flex items-center justify-between gap-2 pl-8 pr-1 text-sm text-white/30"
    :data-cy="`lecture-${lecture.id}`"
  >
    <BaseInput
      v-model="lecture.title"
      :title="`${$t('course.lesson')} ${lectureIndex + 1}`"
      :data-cy="`lecture-title-${lecture.id}`"
      :max-length="200"
      @blur="onBlur"
    >
      <template #suffix>
        <el-tooltip
          v-if="assignedSubject.id"
          effect="light"
          :content="assignedSubject.title"
          placement="top-start"
          :offset="5"
        >
          <div
            ref="subjectRef"
            class="absolute bottom-6 left-16 flex cursor-pointer items-center justify-between gap-1.5 rounded-full px-1.5 py-1 text-xs font-light text-white"
            :class="{ 'ml-2': lectureIndex >= 9 }"
            :style="{ background: hexToRgba(assignedSubject.color, 0.2) }"
            @click="open = !open"
          >
            <div class="flex items-center justify-between gap-2">
              <i class="fa-regular fa-chalkboard-user" />
              <span class="max-w-52 truncate">{{ assignedSubject.title }}</span>
            </div>
            <button
              class="flex hover:text-white/80"
              @click.stop="onUnassignSubject"
            >
              <i v-if="unassigning" class="fa-light fa-loader animate-spin" />
              <i v-else class="fa-light fa-circle-xmark text-sm" />
            </button>
          </div>
        </el-tooltip>
        <div
          class="flex shrink-0 items-center justify-center gap-1 rounded pb-2"
        >
          <div
            ref="moreRef"
            class="flex h-6 w-6 cursor-pointer items-center justify-center rounded"
            :class="more ? 'bg-white/5' : 'hover:bg-white/5'"
            @click="more = !more"
          >
            <i class="fa-light fa-ellipsis" />
          </div>
          <div
            class="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-white"
            :class="
              lecture._state === 'checked'
                ? ''
                : 'opacity-0 group-hover/lecture:opacity-100'
            "
          >
            <OrganizationHubCourseEditContentCheckbox :item="lecture" />
          </div>
        </div>
      </template>
    </BaseInput>
    <BasePopup
      :id="`edit-more-${lecture.id}`"
      :open="more"
      :store="hubCourse"
      :button-ref="moreRef"
      placement="left-end"
      :show-arrow="false"
      :offset="5"
      :width="0"
      @close="more = false"
    >
      <div ref="morePopup" class="p-1">
        <div
          class="group/menu flex cursor-pointer items-center gap-2 rounded py-1.5 pl-2 text-white/50 hover:bg-white/10 hover:text-white"
          @click="onLectureEdit"
        >
          <div class="flex h-3 w-3 items-center justify-center">
            <i class="fa-light fa-pen-to-square" />
          </div>
          <span>Edit</span>
        </div>
        <client-only>
          <el-tooltip
            trigger="click"
            placement="right-start"
            effect="light"
            :offset="5"
            :show-arrow="false"
            popper-class="!bg-black !border-white/20 !p-1"
          >
            <div
              class="group/menu group/assign relative flex cursor-pointer items-center rounded px-1 py-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              data-cy="group-assign-subject"
            >
              <div class="mr-3 flex h-3 w-3 items-center justify-center">
                <i class="fa-regular fa-chalkboard-user h-3 w-3" />
              </div>
              <span data-cy="group-assign-subject-span">Assign Subject</span>
              <i
                class="fa-light fa-chevron-right !invisible ml-1 w-3 text-white/20 group-hover/assign:!visible"
              />
            </div>

            <template #content>
              <div
                v-if="!subjects || subjects.length === 0"
                class="flex w-60 items-center justify-between gap-6 p-2 text-sm"
              >
                <div>No subjects</div>
                <button
                  class="text-white/50 hover:text-white"
                  data-cy="group-add-new-subject"
                  @click="onAddSubject"
                >
                  <i class="fa-regular fa-plus h-3 w-3 text-xs" />
                  Add
                </button>
              </div>
              <div
                v-else
                class="hide-scrollbar flex max-h-96 flex-col gap-1 overflow-auto"
              >
                <div
                  v-for="subject in subjects"
                  :key="subject.id"
                  class="flex cursor-pointer items-center gap-2 rounded-md p-2 py-1 text-sm hover:bg-white/15"
                  :class="
                    subject.id === assignedSubject.id ? 'bg-white/10' : ''
                  "
                  :data-cy="`subject-list-${subject.id}`"
                  @click="assignSubject(subject.id)"
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
            </template>
          </el-tooltip>
        </client-only>
      </div>
    </BasePopup>
    <BasePopup
      :open="open && assignedSubject.id ? true : false"
      :store="hubCourse"
      :button-ref="subjectRef"
      placement="bottom-start"
      :show-arrow="false"
      :offset="5"
      :width="400"
      @close="open = false"
    >
      <div
        v-if="assignedSubject.id"
        ref="subjectPopup"
        class="relative h-full p-0"
      >
        <div v-if="hubSubject.isTeacherPoup" class="h-[34rem]">
          <OrganizationHubCourseEditContentSubjectTeacherPopup />
        </div>
        <div v-else>
          <OrganizationHubCourseEditContentSubjectItem
            :subject="assignedSubject"
            :subject-index="0"
          />
        </div>
      </div>
    </BasePopup>
  </div>
</template>

<script>
export default {
  props: {
    lecture: Object,
    chapter: Object,
    lectureIndex: Number,
    chapterIndex: Number,
  },
  setup() {
    const more = ref(false);
    const morePopup = ref(null);
    const moreRef = ref(null);

    const open = ref(false);
    const subjectPopup = ref(null);
    const subjectRef = ref(null);

    onClickOutside(morePopup, () => {
      more.value = false;
    });

    onClickOutside(
      subjectPopup,
      () => {
        open.value = false;
        hubSubject.isTeacherPoup = false;
      },
      {
        ignore: ['.el-popper', '.pcr-app', '.subject-toggler', subjectRef],
      },
    );

    const hubCourse = useHubCoursesStore();
    const hubEvent = useHubEventStore();
    const hubSubject = useHubSubjectStore();
    const hubCalendarStore = useHubCalendarStore();
    return {
      hubEvent,
      hubCourse,
      hubSubject,
      moreRef,
      more,
      morePopup,
      open,
      subjectPopup,
      subjectRef,
      hubCalendarStore,
    };
  },
  data() {
    return {
      unassigning: false,
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
    async onLectureEdit() {
      this.more = false;
      if (!this.hubCourse.isPreview) {
        this.hubCourse.isPreview = true;
        await sleep(300);
      }

      this.hubCourse.popupOpen = false;
      await this.$nextTick();
      this.hubCourse.popupOpen = true;
      this.hubCourse.chapterPopup = this.chapter;
      this.hubCourse.lecturePopup = this.lecture;
      this.hubCourse.popupFrom = 'edit';
      if (this.lecture?.event?.dates?.startDate) {
        this.hubCalendarStore.initDate = new Date(
          this.lecture.event.dates.startDate,
        );
      }
    },
    onBlur() {
      if (this.lecture.title) {
        this.hubCourse.updateLecture({
          chapterId: this.chapter.id,
          lectureId: this.lecture.id,
          title: this.lecture.title,
        });
      }
    },
    async assignSubject(subjectId) {
      try {
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
          courseId: this.course.id,
          lectureIds: [this.lecture.id],
        });
        const newSubject = this.subjects.find(
          (subject) => subject.id === subjectId,
        );
        if (newSubject) {
          newSubject.lectures.push(this.lecture.id);
        }
        this.lecture.subjectId = subjectId;
      } catch (e) {
        console.log(e);
      }
    },

    async onUnassignSubject() {
      try {
        this.unassigning = true;
        await this.hubSubject.unassignSubjects({
          subjectId: this.assignedSubject.id,
          courseId: this.course.id,
          lectureIds: [this.lecture.id],
        });

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

        this.lecture.subjectId = null;
        this.assignedSubject = {};
        this.unassigning = false;
      } catch (e) {
        this.unassigning = false;
      }
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

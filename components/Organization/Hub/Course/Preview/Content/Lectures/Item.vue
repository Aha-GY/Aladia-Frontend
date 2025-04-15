<template>
  <div
    :data-lecture-index="lectureIndex"
    :data-lecture-id="lecture.id"
    class="group/lecture lecture-item flex items-start gap-3"
    :class="active ? 'lecture-selected' : ''"
    :data-cy="`lecture-${lecture.id}`"
  >
    <div
      class="lecture-handle mt-8 flex cursor-move items-center justify-center opacity-100 transition-all group-hover/lecture:opacity-100 md:opacity-0"
      :class="disabled ? 'pointer-events-none !opacity-0' : ''"
    >
      <i class="fa-regular fa-grip-dots-vertical text-xs" />
    </div>
    <div class="flex-1">
      <div class="flex items-center justify-between gap-3">
        <OrganizationHubCoursePreviewContentLecturesThumbnail
          :lecture="lecture"
          data-cy="7e4ed4277d582fbb"
          @click="onLectureEdit"
        />
        <div class="flex h-20 w-0 flex-1 flex-col justify-end gap-2 pr-4">
          <div class="flex items-center gap-2">
            <div class="text-13 text-white/50">
              {{ $t('base.courses.lesson.index', { index: lectureIndex + 1 }) }}
            </div>
            <el-tooltip
              v-if="assignedSubject.id"
              effect="light"
              :content="assignedSubject.title"
              placement="top-end"
              :offset="5"
            >
              <div
                ref="subjectRef"
                class="flex cursor-pointer items-center justify-between gap-1.5 rounded-full px-1.5 py-1 text-xs font-light text-white"
                :style="{ background: hexToRgba(assignedSubject.color, 0.2) }"
                @click="open = !open"
              >
                <div class="flex items-center justify-between gap-2">
                  <i class="fa-regular fa-chalkboard-user" />
                  <span class="max-w-60 truncate">
                    {{ assignedSubject.title }}
                  </span>
                </div>
                <button
                  class="flex items-center hover:text-white/80"
                  @click.stop="onUnassignSubject"
                >
                  <i
                    v-if="unassigning"
                    class="fa-light fa-loader animate-spin"
                  />
                  <i v-else class="fa-light fa-circle-xmark text-sm" />
                </button>
              </div>
            </el-tooltip>
          </div>
          <BaseInput
            v-model="lecture.title"
            fixed
            title="Lecture Title"
            :max-length="200"
            show-limit
            @blur="onLectureNameBlur"
          />
        </div>
        <div class="flex h-20 items-end">
          <div class="flex items-center gap-6">
            <div
              ref="moreRef"
              class="flex h-6 w-6 cursor-pointer items-center justify-center rounded"
              :class="more ? 'bg-white/5' : 'hover:bg-white/5'"
              data-cy="3d4f59d84283ae15"
              @click="more = !more"
            >
              <i class="fa-light fa-ellipsis" />
            </div>
            <div class="flex h-7 w-7 items-center justify-center">
              <div
                v-if="!showAttachments"
                class="group/file relative cursor-pointer"
                data-cy="7b0825f91258de29"
                @click="showAttachments = true"
              >
                <i
                  class="fa-solid fa-file-arrow-up opacity-50 transition-all duration-300 group-hover/file:scale-110 group-hover/file:opacity-100"
                />
                <div
                  v-if="lecture.attachments.length"
                  class="absolute -right-3 -top-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#6a130c] text-xs font-light"
                >
                  <span class="scale-75">{{ lecture.attachments.length }}</span>
                </div>
              </div>
              <div
                v-else
                class="flex cursor-pointer items-center justify-center"
                data-cy="efd43915f4f7ff6d"
                @click="showAttachments = false"
              >
                <i class="fa-light fa-xmark" />
              </div>
            </div>
            <OrganizationHubCourseEditContentCheckbox
              :item="lecture"
              :class="
                active
                  ? ''
                  : 'opacity-100 group-hover/lecture:opacity-100 md:opacity-0'
              "
            />
          </div>
        </div>
      </div>
      <div
        class="overflow-hidden transition-all duration-300"
        :class="showAttachments ? 'mt-4 max-h-[1024rem]' : 'mt-0 max-h-0'"
      >
        <OrganizationHubEventAttachment
          v-if="showAttachments"
          type="preview"
          :chapter="chapter"
          :files="lecture.attachments"
          @add="onAttachmentsUpdate"
          @remove="onAttachmentsUpdate"
        />
      </div>
      <OrganizationHubCoursePreviewContentLecturesAdd
        v-if="showAdd"
        :chapter="chapter"
        :lecture-index="lectureIndex"
        :chapter-index="chapterIndex"
      />
      <div v-else class="h-6" />
    </div>
    <BasePopup
      :id="`edit-more-${lecture.id}`"
      :open="more"
      :store="hubCourse"
      :button-ref="moreRef"
      placement="bottom-start"
      :show-arrow="false"
      :offset="5"
      :width="0"
      @close="more = false"
    >
      <div ref="morePopup" class="p-1">
        <div
          class="group/menu flex cursor-pointer items-center gap-2 rounded py-1.5 pl-2 text-white/50 hover:bg-white/10 hover:text-white"
          data-cy="b96e2f0060a30752"
          @click="onInfoClick"
        >
          <div class="flex h-3 w-4 flex-shrink-0 items-center justify-center">
            <i class="fa-solid fa-circle-info ml-auto" />
          </div>
          {{ $t('org.activity.chat.info') }}
        </div>
        <div
          class="group/menu flex cursor-pointer items-center gap-2 rounded py-1.5 pl-2 text-white/50 hover:bg-white/10 hover:text-white"
          data-cy="ee3dffa393aa101d"
          @click="onDeleteClick"
        >
          <div class="flex h-3 w-4 flex-shrink-0 items-center justify-center">
            <i
              v-if="deleting"
              class="fa-solid fa-spinner animate-spin text-xs"
            />
            <i v-else class="fa-sharp fa-solid fa-trash ml-auto" />
          </div>
          {{ $t('base.editor.delete') }}
        </div>
        <client-only>
          <el-tooltip
            trigger="click"
            placement="left-end"
            effect="light"
            :offset="16"
            popper-class="!bg-black !border-white/20 !p-1"
          >
            <div
              class="group/menu group/assign relative flex cursor-pointer items-center rounded px-1 py-1.5 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <div
                class="mr-3 flex h-3 w-4 flex-shrink-0 items-center justify-center"
              >
                <i class="fa-regular fa-chalkboard-user ml-auto h-3 w-3" />
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
                  @click="
                    hubCourse.popupOpen = true;
                    hubSubject.subjectPopup = true;
                  "
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
                  :data-cy="`lecture-assign-subject-${subject.id}`"
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
    chapter: {
      type: Object,
      required: true,
    },
    chapterIndex: {
      type: Number,
      required: true,
    },
    lecture: {
      type: Object,
      required: true,
    },
    drag: {
      type: Boolean,
      required: true,
    },
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
    const hubSubject = useHubSubjectStore();
    return {
      hubCourse,
      more,
      morePopup,
      moreRef,
      hubSubject,
      open,
      subjectPopup,
      subjectRef,
    };
  },
  data() {
    return {
      showAttachments: false,
      deleting: false,
      unassigning: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    active() {
      return this.lecture._state === 'checked';
    },
    lectureIndex() {
      return this.chapter.lectures.findIndex(
        (item) => item.id === this.lecture.id,
      );
    },
    showAdd() {
      // 第一章可以插入
      // 课程类型是on-demand可以插入
      // 最后一个lecture可以插入
      return (
        this.chapterIndex === 0 ||
        this.course.type === 'on-demand' ||
        this.lectureIndex === this.chapter.lectures.length - 1
      );
    },
    disabled() {
      return this.lecture.type !== 'on-demand';
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
  watch: {
    drag(state) {
      if (state) {
        this.showAttachments = false;
      }
    },
  },
  methods: {
    onLectureNameBlur() {
      if (this.lecture.title) {
        this.hubCourse.updateLecture({
          chapterId: this.chapter.id,
          lectureId: this.lecture.id,
          title: this.lecture.title,
        });
      }
    },
    async onLectureEdit() {
      this.hubCourse.popupOpen = false;
      await this.$nextTick();
      this.hubCourse.popupOpen = true;
      this.hubCourse.chapterPopup = this.chapter;
      this.hubCourse.lecturePopup = this.lecture;
      this.hubCourse.popupFrom = 'preview';
    },
    onInfoClick() {
      this.more = false;
      this.onLectureEdit();
    },
    async onDeleteClick() {
      try {
        this.deleting = true;
        await this.hubCourse.deleteLecture({
          lectureId: this.lecture.id,
          chapterId: this.chapter.id,
        });
        this.chapter.lectures.splice(this.lectureIndex, 1);
        this.more = false;
        this.deleting = false;
      } catch (error) {
        this.deleting = false;
        throw error;
      }
    },
    async onAttachmentsUpdate() {
      await this.hubCourse.save({
        chapter: this.chapter,
        lecture: this.lecture,
      });
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
      } catch (e) {
        console.log(e);
      }
    },

    async onUnassignSubject() {
      try {
        this.unassigning = true;
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
  },
};
</script>

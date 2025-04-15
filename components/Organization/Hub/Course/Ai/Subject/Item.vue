<template>
  <div
    :subject-id="subject.id"
    class="relative flex flex-col rounded-md border-l bg-[#181818] pl-1.5 pr-4 pt-2 transition-all duration-300"
    :style="{ borderLeftColor: subject.color }"
    @click="!open && (open = true)"
  >
    <div
      class="relative flex flex-col justify-between gap-3 overflow-hidden transition-all duration-300"
      :class="open ? 'max-h-[25rem]' : 'max-h-12'"
    >
      <div v-if="!open" class="flex h-12 items-center gap-1">
        <div
          class="flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded text-sm hover:bg-white/5"
        >
          <i
            class="fa-light fa-chevron-right text-white/20 transition-all duration-300 hover:text-white/50"
            :class="open ? 'rotate-90' : ''"
          />
        </div>
        <div
          class="flex w-full flex-col items-start text-sm font-light"
          :class="open ? 'text-white' : 'text-white/50'"
        >
          <p class="text-xs text-[#707070]">Subject Title</p>
          <p class="w-[90%] truncate text-base text-white">
            {{ subject.title || '---' }}
          </p>
        </div>
        <div class="absolute right-1 top-4">
          <BaseCheckbox
            :active="subject.selected"
            class="ml-auto"
            @click.stop="subject.selected = !subject.selected"
          />
        </div>
      </div>

      <div
        class="flex flex-col justify-between gap-5 overflow-hidden transition-all duration-300"
        :class="open ? 'max-h-[25rem]' : 'max-h-12'"
      >
        <div v-if="open" class="flex h-12 items-center gap-1">
          <div
            class="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-sm hover:bg-white/5"
            @click.stop="toggleOpen"
          >
            <i
              class="fa-light fa-chevron-right text-white/20 transition-all duration-300 hover:text-white/50"
              :class="open ? 'rotate-90' : ''"
            />
          </div>

          <div class="flex-1">
            <div class="text-xs text-[#707070]">Subject Title</div>
            <BaseInput
              v-model="subject.title"
              fixed
              class="w-8 flex-1 truncate text-black"
              title="Subject Title"
              :max-length="60"
              data-cy="edit-subject-title-2"
              show-limit
            >
              <template #suffix>
                <div class="flex h-full gap-1.5 pr-1">
                  <BaseCheckbox
                    :active="subject.selected"
                    @click="subject.selected = !subject.selected"
                  />
                </div>
              </template>
            </BaseInput>
          </div>
        </div>

        <el-popover
          :width="350"
          :visible="openColor"
          trigger="click"
          placement="bottom"
          :offset="0"
        >
          <template #reference>
            <div
              ref="buttonRef"
              class="relative flex cursor-pointer items-end gap-2 pl-6"
              @click="openColor = !openColor"
            >
              <BaseInput
                ref="color"
                v-model="subject.color"
                readonly
                title="Choose a color for this subject"
              />
              <img
                src="~/assets/icons/color-pick.svg"
                class="absolute right-1 mb-1.5 h-7"
                data-cy="subject-image-picker-tooltip"
              />
            </div>
          </template>

          <div ref="popupRef">
            <LazyBaseColor :color="subject.color" @change="onColorChange" />
            <div class="px-2 pb-2">
              <BasePopupBottom @close="openColor = false" />
            </div>
          </div>
        </el-popover>

        <div
          class="flex cursor-pointer items-center justify-between gap-4 pl-6 pr-1"
        >
          <div
            class="group/input relative flex flex-1 items-center justify-between font-light"
            @click="onTeacherClick"
          >
            <div
              class="flex h-6 cursor-pointer items-center gap-1.5 rounded-5 bg-white/5 px-1.5 text-xs text-[#FAFAFA] hover:bg-white/10"
            >
              {{ teachers.length }} Teacher selected
              <i
                v-if="teachers.length"
                class="fa-light fa-chevron-down transition-all"
              />
            </div>
            <BaseMemberPreview
              :members="teachers"
              :total="teachers.length"
              :add="true"
              :online="true"
              width="1.75rem"
              gap="0.375rem"
            />
            <BaseLine class="-my-1.5" />
          </div>
        </div>
        <div
          class="relative flex w-full items-center justify-between pl-6 text-sm"
        >
          <div>Lectures per chapter</div>
          <BaseInputStepNumber v-model="lecturesPerChapter" />
          <div
            class="absolute -bottom-1.5 left-1 h-[1px] w-full bg-[#303030]/60"
          />
        </div>

        <div
          class="flex h-10 items-center justify-between gap-2 pb-2 pl-5 pt-0 text-sm"
        >
          <button
            class="flex items-center justify-start gap-2 rounded-md p-1.5 pl-1 hover:bg-white/10"
            data-cy="delete-subject-content-update"
            @click="onDelete"
          >
            <i
              v-if="isDeleting"
              class="fa-solid fa-spinner animate-spin text-sm"
            />
            <i v-else class="fa-solid fa-trash-can" />
            Delete
          </button>
          <button
            class="flex items-center justify-start gap-2 rounded-md p-1.5 hover:bg-white/10"
            data-cy="save-subject-content-update"
            @click="onSave"
          >
            <i
              v-if="isSaving"
              class="fa-solid fa-spinner animate-spin text-sm"
            />
            <i v-else class="fa-regular fa-floppy-disk" />
            save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    subject: Object,
    subjectIndex: Number,
  },
  setup() {
    const isSaving = ref(false);
    const hubSpace = useHubSpacesStore();
    const hubSubject = useHubSubjectStore();
    const hubCourse = useHubCoursesStore();

    const openColor = ref(false);
    const buttonRef = ref(null);
    const popupRef = ref(null);

    onClickOutside(
      buttonRef,
      () => {
        openColor.value = false;
      },
      {
        ignore: [popupRef],
      },
    );

    return {
      hubSubject,
      hubCourse,
      hubSpace,
      isSaving,
      openColor,
      buttonRef,
      popupRef,
    };
  },
  data() {
    return {
      isDeleting: false,
      lecturesPerChapter: this.subject.lecturesPerChapter || 5,
      teachers: [],
    };
  },
  computed: {
    open: {
      get() {
        return this.subject?.open || false;
      },
      set(value) {
        this.subject.open = value;
      },
    },
    ai() {
      return this.hubCourse?.ai || {};
    },
    subjects() {
      return this.hubSubject.detail.subjects || [];
    },
    detail() {
      return this.hubSubject.detail;
    },
    color() {
      return this.subject.color;
    },
    title() {
      return this.subject.title;
    },
    length() {
      return this.title.length;
    },
  },
  watch: {
    lecturesPerChapter: {
      handler(newValue) {
        this.subject.lecturesPerChapter = newValue;
      },
      immediate: true,
    },
    'subject.teachers': {
      handler() {
        this.init();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async init() {
      if (this.subject.teachers.length === 0) {
        return;
      }
      this.teachers = this.subject.teachers.map((teacherId) =>
        this.hubSubject.courseMembers.find((member) => member.id === teacherId),
      );
    },

    async onTeacherClick() {
      this.hubSubject.activeSubject = this.subject.id;
      this.hubSubject.selectedTeachers = this.teachers;
      this.ai.isTeacherPopup = true;
    },

    async onColorChange(color) {
      this.subject.color = color;
    },
    async onDelete() {
      this.hubSpace.deleteSubject = this.subject;
    },
    async onSave() {
      if (this.isSaving) {
        return;
      }
      this.isSaving = true;
      await this.hubSubject.updateSubject({
        courseId: this.hubCourse.detail.id,
        subjectId: this.subject.id,
        title: this.subject.title,
        color: this.subject.color,
        teachers: this.teachers.map((m) => m.id),
      });
      this.isSaving = false;
      this.$toast.success('Subject saved');
    },
    toggleOpen() {
      this.open = !this.open;
    },
  },
};
</script>

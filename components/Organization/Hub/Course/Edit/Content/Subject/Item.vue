<template>
  <div
    :subject-id="subject.id"
    class="relative flex flex-col rounded-md border-l bg-[#181818] py-2 pr-4 transition-all duration-300"
    :class="showChevron ? 'pl-1.5' : 'pl-4'"
    :style="{ borderLeftColor: subject.color }"
    @click="!open && toggleOpen()"
  >
    <div
      class="flex flex-col justify-between gap-3 overflow-hidden transition-all duration-300"
      :class="open ? 'max-h-[25rem]' : 'max-h-10'"
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
          class="flex w-full flex-col items-start overflow-hidden text-sm font-light"
          :class="open ? 'text-white' : 'text-white/50'"
        >
          <p class="text-xs text-[#707070]">
            {{ $t('event.subject.title') }}
          </p>
          <p
            class="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap text-base text-white"
          >
            {{ subject.title || '---' }}
          </p>
        </div>
      </div>

      <div
        class="flex flex-col justify-between gap-5 overflow-hidden transition-all duration-300"
        :class="open ? 'max-h-[25rem]' : 'max-h-12'"
      >
        <div v-if="open" class="flex h-12 items-center gap-1">
          <div
            v-if="showChevron"
            class="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-sm hover:bg-white/5"
            @click.stop="toggleOpen"
          >
            <i
              class="fa-light fa-chevron-right text-white/20 transition-all duration-300 hover:text-white/50"
              :class="open ? 'rotate-90' : ''"
            />
          </div>

          <div class="flex-1">
            <div class="text-xs text-[#707070]">
              {{ $t('event.subject.title') }}
            </div>
            <div class="relative">
              <BaseInput
                v-model="subject.title"
                fixed
                class="w-8 flex-1 truncate text-black"
                title="Subject Title"
                :max-length="60"
                data-cy="edit-subject-title-1"
                show-limit
              />
            </div>
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
              class="relative flex cursor-pointer items-end gap-2"
              :class="{ 'pl-6': showChevron }"
              @click="openColor = !openColor"
            >
              <BaseInput
                ref="color"
                v-model="subject.color"
                readonly
                :title="$t('event.subject.color')"
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
          class="flex cursor-pointer items-center justify-between gap-4 pr-1"
          :class="{ 'pl-6': showChevron }"
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
          class="flex h-8 items-center justify-between gap-2 pb-2 pt-0 text-sm"
          :class="{ 'pl-6': showChevron }"
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
      open: this.subject.open,
      isDeleting: false,
      teachers: [],
    };
  },
  computed: {
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
    showChevron() {
      return this.hubCourse.subjectOpen || this.hubSubject.subjectPopup;
    },
  },
  watch: {
    'subject.teachers': {
      handler() {
        this.init();
      },
      immediate: true,
    },
    'subject.open': {
      handler(newValue) {
        if (newValue === undefined) {
          this.subject.open = true;
          this.open = true;
        } else if (this.showChevron) {
          this.open = newValue;
        } else {
          this.open = true;
        }
      },
      immediate: true,
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
      this.hubSubject.isTeacherPoup = true;
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

      try {
        this.isSaving = true;
        await this.hubSubject.updateSubject({
          courseId: this.hubCourse.detail.id,
          subjectId: this.subject.id,
          title: this.subject.title,
          color: this.subject.color,
          teachers: this.teachers.map((m) => m.id),
        });
        this.$toast.success('Subject saved');
      } catch (e) {
        this.isSaving = false;
      } finally {
        this.isSaving = false;
      }
    },
    toggleOpen() {
      this.subject.open = !this.subject.open;
    },
  },
};
</script>

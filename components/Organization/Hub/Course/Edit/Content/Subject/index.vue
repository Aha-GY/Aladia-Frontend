<template>
  <div
    ref="popupRef"
    :class="
      hubSubject.isTeacherPoup
        ? 'border-white/5'
        : 'rounded-lg border-white/20 py-1'
    "
    class="mx-auto flex h-full w-full max-w-[95%] flex-col justify-between border bg-[#0c0c0c]"
  >
    <OrganizationHubCourseEditContentSubjectHeader
      v-if="!hubSubject.isTeacherPoup"
      :container-ref="subjectsContainer"
    />
    <div
      ref="subjectsContainer"
      class="hide-scrollbar flex w-full flex-1 flex-col gap-2 overflow-scroll border-white/20 px-4 py-2"
      :class="subjects.length && !hubSubject.isTeacherPoup ? 'block' : 'hidden'"
    >
      <OrganizationHubCourseEditContentSubjectItem
        v-for="(subjectItem, subjectHeader) in subjects"
        :key="subjectItem.id"
        :subject="subjectItem"
        :subject-index="subjectHeader"
      />
      <div class="my-1 flex h-8 items-center justify-center">
        <button @click="onAdd">
          <i
            class="fa-regular fa-plus h-3 w-3 text-xs"
            :class="adding ? 'animate-spin' : 'animate-none'"
          />
        </button>
      </div>
    </div>
    <slot v-if="hubSubject.isTeacherPoup" />
    <div
      v-if="!hubSubject.isTeacherPoup"
      class="flex h-12 items-center justify-between pl-3 pr-5"
    >
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-normal transition-all duration-300 hover:bg-white/5 active:scale-95"
        data-cy="cancel-subjects-creation"
        @click="
          hubCourse.chapterOpen = true;
          hubCourse.subjectOpen = false;
        "
      >
        <i class="fa-light fa-reply text-sm" />
        {{ $t('base.dialog.close') }}
      </div>
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-2 rounded bg-[#E0B92C] px-2 py-1 text-sm font-medium text-[#0A0A0A] transition-all duration-300 hover:bg-[#E0B92C]/80 active:scale-95"
          data-cy="save-subjects-created"
          @click="onSave"
        >
          <i
            v-if="isSaving"
            class="fa-light fa-loader animate-spin text-base"
          />
          <i v-else class="fa-regular fa-floppy-disk" />
          {{ $t('base.upload.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const isSaving = ref(false);
    const adding = ref(false);

    const hubSubject = useHubSubjectStore();
    const hubCourse = useHubCoursesStore();
    const authStore = useAuthStore();
    const popupRef = ref(null);
    const subjectsContainer = ref(null);

    onClickOutside(
      popupRef,
      () => {
        hubSubject.isTeacherPoup = false;
        hubCourse.subjectOpen = false;
        hubCourse.chapterOpen = true;
        hubSubject.subjectPopup = false;
      },
      {
        ignore: ['.el-popper', '.pcr-app', '.subject-toggler'],
      },
    );

    return {
      hubSubject,
      hubCourse,
      authStore,
      isSaving,
      adding,
      popupRef,
      subjectsContainer,
    };
  },
  computed: {
    subjects() {
      return this.hubSubject.detail?.subjects || [];
    },
    subjectOpen() {
      return this.hubCourse.subjectOpen;
    },
  },
  methods: {
    async onSave() {
      if (this.isSaving) {
        return;
      }
      try {
        this.isSaving = true;
        for (const subject of this.subjects) {
          await this.hubSubject.updateSubject({
            courseId: this.hubCourse.detail.id,
            subjectId: subject.id,
            title: subject.title,
            teachers: subject.teachers,
            color: subject.color,
          });
        }
        this.isSaving = false;
        this.hubCourse.chapterOpen = true;
        this.hubCourse.subjectOpen = false;
        this.$toast.success('Subjects saved successfully!');
      } catch (e) {
        this.isSaving = false;
      }
    },
    async onAdd() {
      try {
        if (this.adding) {
          return;
        }

        this.adding = true;
        await this.hubSubject.createSubject({
          courseId: this.hubCourse.detail.id,
          title: `Subject ${this.subjects.length + 1}`,
          color: '#707070',
          teachers: [this.authStore.user.id],
        });
        this.adding = false;

        this.$nextTick(() => {
          const container = this.$refs.subjectsContainer;
          if (container && container.lastElementChild) {
            container.lastElementChild.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
            });
          }
        });
      } catch (e) {
        this.adding = false;
      }
    },
  },
};
</script>

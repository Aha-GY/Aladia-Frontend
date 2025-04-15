<template>
  <div
    class="mb-2 flex w-full flex-col gap-4 rounded-md border-[0.5px] border-[#FFFFFF0D] bg-[#0C0C0C] p-2 text-sm"
  >
    <OrganizationHubCourseAiSubjectHeader
      v-if="!ai.isTeacherPopup"
      :container-ref="subjectsContainer"
    />
    <div
      ref="subjectsContainer"
      class="hide-scrollbar flex w-full flex-1 flex-col gap-2 overflow-scroll border-white/20 px-2"
      :class="subjects.length ? 'flex' : 'hidden'"
    >
      <OrganizationHubCourseAiSubjectItem
        v-for="(subjectItem, subjectIndex) in subjects"
        :key="subjectItem.id"
        :subject="subjectItem"
        :subject-index="subjectIndex"
      />
      <div class="flex h-8 items-center justify-center">
        <button @click="onAdd">
          <i
            class="fa-regular fa-plus h-3 w-3 text-xs"
            :class="adding ? 'animate-spin' : 'animate-none'"
          />
        </button>
      </div>
    </div>
    <div
      v-if="ai.isTeacherPopup"
      class="absolute left-0 top-0 !z-[900] h-full w-full"
    >
      <OrganizationHubCourseAiSubjectTeacherPopup />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const adding = ref(false);
    const hubCourse = useHubCoursesStore();
    const hubSubject = useHubSubjectStore();
    const authStore = useAuthStore();
    const subjectsContainer = ref(null);
    return { hubCourse, hubSubject, authStore, adding, subjectsContainer };
  },
  computed: {
    ai() {
      return this.hubCourse?.ai || {};
    },
    subjects() {
      return this.hubSubject.detail.subjects || [];
    },
  },
  mounted() {
    this.hubCourse.ai.info.subjects = this.hubSubject.detail.subjects;
  },
  methods: {
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

        const newSubject =
          this.hubSubject.detail.subjects[
            this.hubSubject.detail.subjects.length - 1
          ];

        if (newSubject) {
          newSubject.selected = true;
          newSubject.open = true;
        }

        this.adding = false;

        this.$nextTick(() => {
          setTimeout(() => {
            const container = this.$refs.subjectsContainer;
            if (container && container.lastElementChild) {
              container.lastElementChild.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          }, 100);
        });
      } catch (e) {
        this.adding = false;
      }
    },
  },
};
</script>

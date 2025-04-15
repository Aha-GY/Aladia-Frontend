<template>
  <div class="relative flex items-center justify-between p-2 px-4">
    <div class="flex flex-1 items-center gap-2">
      <div class="text-sm font-light text-white">
        {{ $t('event.create.new.subject') }}
      </div>
    </div>
    <div class="flex shrink-0 items-center gap-2">
      <div
        class="flex h-6 cursor-pointer items-center justify-center gap-2 rounded bg-white/10 px-1.5 text-xs text-[#FAFAFA]"
      >
        <i
          class="fa-light fa-list-tree hover:bg-white/10 hover:text-white/50"
          @click="toggleListView(true)"
        />
        <i
          class="fa-light fa-list hover:bg-white/10 hover:text-white/50"
          @click="toggleListView(false)"
        />
      </div>

      <div
        class="flex h-6 cursor-pointer items-center justify-center gap-1.5 rounded bg-white/10 px-1.5 text-xs text-[#FAFAFA] hover:bg-white/20"
        data-cy="course-event-subject-add"
        @click="onAdd"
      >
        <i v-if="isAdding" class="fa-light fa-loader animate-spin text-xs" />
        <i v-else class="fa-light fa-add" />
        {{ $t('event.add') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    containerRef: {
      type: [Object, null],
      default: null,
      required: true,
    },
  },
  setup() {
    const isAdding = ref(false);
    const hubCourse = useHubCoursesStore();
    const hubSubject = useHubSubjectStore();
    const authStore = useAuthStore();
    return { hubCourse, hubSubject, authStore, isAdding };
  },
  computed: {
    subjects() {
      return this.hubSubject.detail?.subjects || [];
    },
  },
  methods: {
    async onAdd() {
      try {
        if (this.isAdding) {
          return;
        }

        this.isAdding = true;
        await this.hubSubject.createSubject({
          courseId: this.hubCourse.detail.id,
          title: `Subject ${this.hubSubject.detail.subjects.length + 1}`,
          color: '#707070',
          teachers: [this.authStore.user.id],
        });
        this.isAdding = false;

        this.$nextTick(() => {
          if (this.containerRef && this.containerRef.lastElementChild) {
            this.containerRef.lastElementChild.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
            });
          }
        });
      } catch (e) {
        this.isAdding = false;
      }
    },
    toggleListView(value) {
      if (value) {
        for (const subject of this.subjects) {
          subject.open = true;
        }
      } else {
        for (const subject of this.subjects) {
          subject.open = false;
        }
      }
    },
  },
};
</script>

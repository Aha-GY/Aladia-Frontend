<template>
  <div class="group/toggle relative flex items-center justify-between p-2">
    <div class="flex w-full items-center justify-between p-1">
      <div class="text-sm font-light">{{ $t('event.create.new.subject') }}</div>
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
          :class="{ 'text-white/50': adding }"
          data-cy="course-subject-add-ai"
          @click="onAdd"
        >
          <i v-if="adding" class="fa-light fa-loader animate-spin text-xs" />
          <i v-else class="fa-light fa-add text-xs" />
          <span>
            {{ $t('event.add') }}
          </span>
        </div>
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
    const adding = ref(false);
    const hubCourse = useHubCoursesStore();
    const hubSubject = useHubSubjectStore();
    const authStore = useAuthStore();
    return { hubCourse, hubSubject, authStore, adding };
  },
  computed: {
    subjects() {
      return this.hubSubject.detail.subjects || [];
    },
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
            if (this.containerRef && this.containerRef.lastElementChild) {
              this.containerRef.lastElementChild.scrollIntoView({
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

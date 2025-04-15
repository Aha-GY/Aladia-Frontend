<template>
  <div
    v-if="subject"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/10"
  >
    <div class="px-2 transition-all duration-300">
      <div class="-mt-36 w-full rounded bg-black p-3 md:w-[28rem]">
        <div class="mb-3 flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <i class="fa-sharp fa-solid fa-trash-can" />
            {{ $t('base.editor.delete') }}
          </div>
          <BaseIconClose @click="hubSpaces.deleteSubject = false" />
        </div>
        <div class="mb-5 px-2 text-sm">
          <div class="mb-1">
            {{ $t('space.workspace.delete.dialog') }}
          </div>
          <div v-if="subject.lectures.length > 0">
            {{ $t('space.workspace.delete.content') }}

            <span class="text-white/60">{{ subject.title }}</span>
            {{
              $t('space.workspace.delete.content2', {
                length: subject.lectures.length,
              })
            }}
          </div>
        </div>
        <div class="flex justify-end">
          <BaseButton type="error" @click="onDelete">
            <i
              v-if="loading"
              class="fa-solid fa-spinner animate-spin text-xs"
            />
            <i v-else class="fa-sharp fa-solid fa-trash-can" />

            {{ $t('base.editor.delete') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSubject = useHubSubjectStore();
    return { hubSpaces, hubSubject };
  },
  data() {
    return {
      loading: false,
      animation: false,
    };
  },
  computed: {
    subject() {
      return this.hubSpaces.deleteSubject || { title: '', lectures: [] };
    },
  },

  methods: {
    async onDelete() {
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;
        await this.hubSubject.deleteSubject({
          courseId: this.subject.courseId,
          subjectId: this.subject.id,
        });
      } catch (error) {
        console.error('Failed to delete subject:', error);
      } finally {
        this.loading = false;
        this.hubSpaces.deleteSubject = false;
      }
    },
  },
};
</script>

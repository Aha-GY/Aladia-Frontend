<template>
  <div class="group/add flex items-center gap-6">
    <div class="relative flex h-[1px] flex-1 justify-center bg-white/5">
      <div
        class="h-full w-0 bg-white/50 transition-all duration-300 group-hover/add:w-full"
      />
    </div>
    <div
      class="flex h-5 cursor-pointer items-center justify-center"
      data-cy="44a828fae29af8eb"
      @click="onAddClick"
    >
      <i v-if="loading" class="fa-solid fa-spinner animate-spin text-sm" />
      <i
        v-else
        class="fa-light fa-plus-large transition-all duration-300 group-hover/add:rotate-90"
      />
    </div>
    <div class="relative flex h-[1px] flex-1 justify-center bg-white/5">
      <div
        class="h-full w-0 bg-white/50 transition-all duration-300 group-hover/add:w-full"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async onAddClick() {
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;
        await this.hubCourse.appendChapter();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
};
</script>

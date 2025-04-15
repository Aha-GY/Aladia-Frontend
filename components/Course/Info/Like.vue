<template>
  <div class="relative">
    <div
      class="relative z-0 flex h-10 items-center gap-2 rounded border border-[#565656] bg-black px-3"
    >
      <div
        class="flex cursor-pointer"
        data-cy="21f70e13207852fe"
        @click="likeCourse"
      >
        <i
          v-if="active"
          class="fa-solid fa-heart scale-100 text-2xl text-red-600 transition-all duration-300 active:scale-90"
          :class="animation ? 'scale-100 opacity-100' : 'scale-150 opacity-0'"
        />
        <i
          v-else
          class="fa-regular fa-heart scale-100 text-2xl transition-all duration-300 hover:text-red-600 active:scale-90"
        />
      </div>
      <div class="bg-gradient-left h-9 w-[1px] opacity-50" />
      <div class="min-w-[1rem] text-center text-13 font-extrabold">
        {{ like }}
      </div>
    </div>
    <div
      class="bg-gradient-border absolute left-[10%] top-0 z-10 h-[1px] w-4/5"
    />
    <div
      class="bg-gradient-border absolute bottom-0 left-[10%] z-10 h-[1px] w-4/5"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const courseStore = useCourseStore();
    return { authStore, courseStore };
  },
  data() {
    return {
      like: 0,
      active: false,
      animation: false,
    };
  },
  watch: {
    active(state) {
      if (state) {
        setTimeout(() => {
          this.animation = true;
        }, 100);
      } else {
        this.animation = false;
      }
    },
  },
  methods: {
    likeCourse() {
      if (this.authStore.logged) {
        this.courseStore.likeCourse({
          courseId: this.$route.params.name,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-gradient-border {
  background: transparent
    linear-gradient(90deg, #565656 0%, #000 50%, #565656 100%) 0% 0% no-repeat
    padding-box;
}
</style>

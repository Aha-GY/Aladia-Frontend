<template>
  <div class="relative">
    <div
      id="share"
      class="relative z-10 flex h-10 items-center gap-2 rounded border border-[#565656] bg-black px-3"
    >
      <div
        class="inline-flex scale-100 cursor-pointer items-center justify-center transition-all active:scale-90"
        data-cy="c6592ff5630c551c"
        @click="share = !share"
      >
        <i class="fa-solid fa-share-nodes" />
      </div>
    </div>
    <CourseInfoSocial :share="share" @on-share="share = false" />
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
    const courseStore = useCourseStore();
    return { courseStore };
  },
  data() {
    return {
      share: false,
    };
  },
  mounted() {
    document.body.addEventListener('click', this.onClick);
  },
  beforeUnmount() {
    document.body.removeEventListener('click', this.onClick);
  },
  methods: {
    onClick(event) {
      if (!event.target.closest('#share')) {
        this.share = false;
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

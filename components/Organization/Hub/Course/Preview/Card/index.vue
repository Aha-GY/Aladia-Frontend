<template>
  <div class="flex h-full w-full items-center justify-center">
    <MarketCardCourse :course="course" class="!w-80" />
    <Teleport to="body">
      <MarketCardFloat v-if="marketStore.floatCourse" class="z-[90]" />
    </Teleport>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const marketStore = useMarketStore();
    return { hubCourse, marketStore };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
  },
};
</script>

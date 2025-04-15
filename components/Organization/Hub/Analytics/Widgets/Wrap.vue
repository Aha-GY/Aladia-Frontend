<template>
  <div class="group/widget relative h-full w-full overflow-hidden p-3">
    <slot />
  </div>
</template>

<script>
export default {
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
};
</script>

<template>
  <div>
    <div class="flex">
      <div
        class="-ml-2 -mt-2 w-0 flex-1"
        :class="{
          dragging: analyticsStore.widgetDragging,
        }"
      >
        <client-only>
          <OrganizationHubAnalyticsWidgetsFilter v-if="analyticsStore.filter" />
          <OrganizationHubAnalyticsWidgetsStandard v-else />
        </client-only>
      </div>
      <OrganizationHubAnalyticsWidgetsSidebar />
    </div>
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

<style lang="scss" scoped>
.dragging .vgl-layout::before {
  position: absolute;
  width: calc(100% - 5px);
  height: calc(100% - 5px);
  margin: 5px;
  content: '';
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-repeat: repeat;
  background-size: calc(calc(100% - 5px) / 12) 40px;
}

:deep(.vgl-item) {
  border-radius: 0.25rem;
  border-width: 1px;
  background-color: #000;
  border-color: transparent;
  &:hover {
    border-color: rgb(255 255 255 / 0.5);
  }
}
</style>

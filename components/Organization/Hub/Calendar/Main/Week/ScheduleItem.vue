<template>
  <div
    class="pointer-events-none absolute left-0 flex overflow-hidden rounded"
    :class="item.name ? '' : 'border px-[1px]'"
    :style="{
      top: item.top + 'px',
      left: item.left + 'px',
      height: item.height + 'px',
      width: `calc(100% - ${item.left}px)`,
      'border-color': item.color,
    }"
  >
    <div
      class="my-[1px] mr-0.5 w-[1.125rem] shrink-0 rounded-sm opacity-50"
      :style="{ 'background-color': item.color }"
    >
      <!-- <i class="fa-light fa-table-cells-large" v-if=""></i> -->
    </div>
    <div
      class="absolute left-0 top-0 flex h-6 w-full items-center gap-2 p-1 font-light"
    >
      <i class="fa-light fa-table-cells-large text-10" />
      <div
        v-if="item.name && !isHide && !item?.isAlHide"
        class="flex items-center truncate text-xs"
      >
        {{ item.name }}，{{ item.time }}
      </div>
    </div>
    <div v-if="!item.name" class="flex w-full flex-col">
      <div
        v-for="box in length"
        :key="box"
        class="mt-1 shrink-0 rounded-sm opacity-20 first:mt-0.5 last:h-0 last:flex-1"
        :style="{ 'background-color': item.color, height: `${height}rem` }"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    isHide: Boolean,
  },
  setup() {
    const hubSidebar = useHubSidebarStore();
    return { hubSidebar };
  },
  computed: {
    length() {
      return Math.ceil(this.item.height / (this.height * 16));
    },
    detail() {
      return this.hubSidebar?.calendar?.data;
    },
    height() {
      const surHour =
        this.detail.eventDuration > 60
          ? 48
          : this.detail.eventDuration === 60
            ? 46
            : 42;
      return this.detail.eventDuration
        ? ((surHour / 60) * this.detail.eventDuration) / 16
        : 3;
    },
  },
};
</script>

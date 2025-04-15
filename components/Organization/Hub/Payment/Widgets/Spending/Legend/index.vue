<template>
  <div class="flex h-full min-w-[21.875rem] flex-col gap-4">
    <div
      class="flex items-center justify-between border-b border-[#282828] pb-2"
    >
      <div class="text-lg">
        {{ $t('filter.general.spending.chart') }}
      </div>
      <i class="fa-solid fa-arrow-down text-[#DA4242]" />
    </div>
    <div class="flex flex-1 flex-col justify-center gap-2 overflow-y-auto">
      <OrganizationHubPaymentWidgetsSpendingLegendItem
        v-for="(item, index) in data"
        :key="index"
        :item="item"
        :color="color[index]"
        :length="data.length"
        @mouseenter="$emit('enter', index)"
        @mouseleave="$emit('leave')"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Array,
    color: Array,
  },
  data() {
    return {
      // data: [
      //   { name: "Courses", value: -62370 },
      //   { name: "Streaming", value: -42320 },
      //   { name: "Manteinance", value: -20470 },
      // ],
      // colors: ["#DE034B", "#FD6C69", "#FF7A00"],
    };
  },
};
</script>

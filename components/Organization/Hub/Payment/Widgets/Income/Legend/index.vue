<template>
  <div class="flex h-full w-[21.875rem] flex-col gap-4">
    <div
      class="flex items-center justify-between border-b border-[#282828] pb-2"
    >
      <div class="text-lg">
        {{ $t('filter.general.income.chart') }}
      </div>
      <i class="fa-solid fa-arrow-up text-[#88C359]" />
    </div>
    <div class="flex flex-1 flex-col justify-center gap-2 overflow-y-auto">
      <OrganizationHubPaymentWidgetsIncomeLegendItem
        v-for="(item, index) in data"
        :key="index"
        :item="item"
        :color="color[index]"
        :length="data.length"
        data-cy="c9aed09048212c59"
        @mouseenter="$emit('enter', index)"
        @mouseleave="$emit('leave')"
        @click="$emit('change', index)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: Array,
  color: Array,
});
</script>

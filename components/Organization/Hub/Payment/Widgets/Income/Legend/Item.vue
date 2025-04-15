<template>
  <div
    class="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 transition-all hover:bg-white/5"
    :class="length >= 3 ? '' : 'py-2'"
  >
    <div class="flex w-0 flex-1 items-center gap-4">
      <div
        class="h-4 w-4 rounded-full shadow-[0px_5px_12px_rgba(255,255,255,0.2)]"
        :style="{ backgroundColor: color }"
      />
      <div class="truncate text-lg opacity-80">{{ $t(item.name) }}</div>
    </div>
    <div class="text-sm text-[#88C359]">{{ moneyFormat(item.value) }}$</div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    color: String,
    length: Number,
  },
};
</script>

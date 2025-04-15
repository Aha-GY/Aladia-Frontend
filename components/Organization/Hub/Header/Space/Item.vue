<template>
  <div class="flex h-7 items-center gap-2 px-1 text-[#B0B0B0]">
    <div
      class="flex h-5 w-9 items-center justify-center rounded-sm bg-white/5"
    />
    <div class="w-0 flex-1 truncate">{{ item.name }}</div>
    <BaseSwitcher
      :active="actions.includes(item.id)"
      @change="change(item.id)"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    actions: Array,
    change: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

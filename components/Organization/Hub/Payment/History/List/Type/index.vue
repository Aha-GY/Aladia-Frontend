<template>
  <div class="group flex items-center gap-2 overflow-hidden">
    <div class="flex w-0 flex-1 items-center gap-2">
      <div class="truncate">
        {{ item.type || $t('meet.visual.effects.none') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
};
</script>

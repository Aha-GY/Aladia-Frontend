<template>
  <i v-if="isShopping && !item.image" class="fa-solid fa-book-open-reader" />
  <i
    v-else-if="item.icon"
    :class="[
      item.icon,
      isSelect ? 'fa-solid' : 'fa-light',
      size === 'small' ? 'text-xs' : 'text-sm',
    ]"
    :style="{ color: item.color }"
  />
  <i
    v-else
    class="fa-hexagon"
    :class="[
      isSelect ? 'fa-solid' : 'fa-light',
      size === 'small' ? 'text-xs' : 'text-sm',
    ]"
    :style="{ color: item.color }"
  />
</template>
<script setup>
defineProps({
  isShopping: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    default: () => ({}),
  },
  size: {
    type: String,
    default: 'sm',
  },
  isSelect: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <img
    :src="item.gif"
    alt="GIF"
    class="max-h-[18.4375rem] w-full rounded-5 object-contain sm:max-h-[31.25rem]"
  />
</template>
<script setup>
defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});
</script>

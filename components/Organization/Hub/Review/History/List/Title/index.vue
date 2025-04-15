<template>
  <div class="truncate py-1 text-sm">
    {{ item.title || '---' }}
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
};
</script>

<template>
  <div class="flex items-center gap-2 text-sm text-[#D9D9D9]">
    {{ comments }}
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    comments() {
      return this.item.numberOf?.comments || 0;
    },
  },
};
</script>

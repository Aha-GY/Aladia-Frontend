<template>
  <a
    :href="item.invoiceUrl"
    target="_blank"
    class="flex cursor-pointer items-center justify-center text-[#d9d9d9] transition-all hover:text-white"
    data-cy="7a4fb54734836d55"
    @click.stop
  >
    <i class="fa-thin fa-file-arrow-down" />
  </a>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

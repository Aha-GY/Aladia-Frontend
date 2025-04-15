<template>
  <div class="flex items-center justify-center">
    <img
      v-if="open"
      class="h-full w-full"
      src="~/assets/icons/folder-open.svg"
    />
    <img v-else class="h-full w-full" src="~/assets/icons/folder.svg" />
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

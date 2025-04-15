<template>
  <div class="flex flex-col gap-6">
    <ProfileReelsList :is-view="isView" />
  </div>
</template>
<script>
export default {
  props: {
    isView: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
